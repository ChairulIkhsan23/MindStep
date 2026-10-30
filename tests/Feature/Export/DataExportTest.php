<?php

namespace Tests\Feature\Export;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\Journal;
use App\Models\MoodLog;
use App\Models\Tag;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use ZipArchive;

class DataExportTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create([
            'timezone' => 'Asia/Jakarta',
            'email_verified_at' => now(),
            'ai_consent' => true,
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $responseJson = $this->get(route('export.json'));
        $responseJson->assertRedirect(route('login'));

        $responseCsv = $this->get(route('export.csv'));
        $responseCsv->assertRedirect(route('login'));
    }

    public function test_unverified_user_is_redirected(): void
    {
        $unverifiedUser = User::factory()->unverified()->create();

        $response = $this->actingAs($unverifiedUser)->get(route('export.json'));
        $response->assertRedirect(route('verification.notice'));
    }

    public function test_user_can_export_full_data_as_json(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $habit = Habit::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'Olahraga Pagi',
        ]);
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $this->user->id,
            'log_date' => $today,
            'status' => 'completed',
        ]);
        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'log_date' => $today,
            'mood_score' => 5,
            'emotions' => ['Senang', 'Bersyukur'],
        ]);
        $tag = Tag::factory()->create(['user_id' => $this->user->id, 'name' => 'Kesehatan']);
        $journal = Journal::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Catatan Kebugaran',
            'entry_date' => $today,
        ]);
        $journal->tags()->attach($tag->id);

        $response = $this->actingAs($this->user)->get(route('export.json'));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/json');
        $this->assertStringContainsString('attachment; filename="mindstep-export-', (string) $response->headers->get('Content-Disposition'));

        $json = $response->json();

        // Check metadata & security
        $this->assertEquals($this->user->email, $json['metadata']['user']['email']);
        $this->assertTrue($json['metadata']['user']['ai_consent']);
        $this->assertArrayNotHasKey('password', $json['metadata']['user']);
        $this->assertArrayNotHasKey('remember_token', $json['metadata']['user']);

        // Check entities
        $this->assertCount(1, $json['habits']);
        $this->assertEquals('Olahraga Pagi', $json['habits'][0]['name']);
        $this->assertCount(1, $json['habit_logs']);
        $this->assertEquals('completed', $json['habit_logs'][0]['status']);
        $this->assertCount(1, $json['mood_logs']);
        $this->assertEquals(5, $json['mood_logs'][0]['mood_score']);
        $this->assertCount(1, $json['journals']);
        $this->assertEquals('Catatan Kebugaran', $json['journals'][0]['title']);
        $this->assertContains('Kesehatan', $json['journals'][0]['tags']);
    }

    public function test_user_can_export_full_data_as_csv_zip(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $habit = Habit::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'Baca Buku',
        ]);
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $this->user->id,
            'log_date' => $today,
            'status' => 'completed',
        ]);
        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'log_date' => $today,
            'mood_score' => 4,
            'emotions' => ['Fokus'],
        ]);
        Journal::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Resume Buku',
            'entry_date' => $today,
        ]);

        $response = $this->actingAs($this->user)->get(route('export.csv'));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/zip');
        $this->assertStringContainsString('attachment; filename=mindstep-export-', (string) $response->headers->get('Content-Disposition'));

        // Verify zip content
        $tempPath = tempnam(sys_get_temp_dir(), 'test_zip_');
        file_put_contents($tempPath, $response->streamedContent());

        $zip = new ZipArchive;
        $this->assertTrue($zip->open($tempPath));
        $this->assertNotFalse($zip->locateName('habits.csv'));
        $this->assertNotFalse($zip->locateName('habit_logs.csv'));
        $this->assertNotFalse($zip->locateName('mood_logs.csv'));
        $this->assertNotFalse($zip->locateName('journals.csv'));

        $habitsContent = (string) $zip->getFromName('habits.csv');
        $this->assertStringContainsString('Baca Buku', $habitsContent);

        $journalsContent = (string) $zip->getFromName('journals.csv');
        $this->assertStringContainsString('Resume Buku', $journalsContent);

        $zip->close();
        @unlink($tempPath);
    }

    public function test_export_preserves_multi_tenant_isolation(): void
    {
        $otherUser = User::factory()->create();

        Habit::factory()->create([
            'user_id' => $otherUser->id,
            'name' => 'Rahasia User Lain',
        ]);
        MoodLog::factory()->create([
            'user_id' => $otherUser->id,
            'note' => 'Catatan Pribadi Orang Lain',
        ]);
        Journal::factory()->create([
            'user_id' => $otherUser->id,
            'title' => 'Buku Harian Rahasia Orang Lain',
        ]);

        $response = $this->actingAs($this->user)->get(route('export.json'));

        $response->assertOk();
        $json = $response->json();

        $this->assertEmpty($json['habits']);
        $this->assertEmpty($json['mood_logs']);
        $this->assertEmpty($json['journals']);
    }
}
