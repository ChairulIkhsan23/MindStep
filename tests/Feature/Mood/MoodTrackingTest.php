<?php

namespace Tests\Feature\Mood;

use App\Models\Journal;
use App\Models\MoodLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MoodTrackingTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create([
            'timezone' => 'Asia/Jakarta',
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('moods.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_user_can_view_mood_index_page(): void
    {
        MoodLog::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'log_date' => Carbon::now('Asia/Jakarta')->toDateString(),
        ]);

        $response = $this->actingAs($this->user)->get(route('moods.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Moods/Index')
            ->has('today_logs', 3)
            ->has('stats')
            ->has('available_emotions')
        );
    }

    public function test_user_can_store_standalone_mood_log(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $response = $this->actingAs($this->user)->post(route('moods.store'), [
            'mood_score' => 4,
            'log_date' => $today,
            'emotions' => ['Tenang', 'Bersyukur'],
            'note' => 'Hari produktif dan tenang.',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('mood_logs', [
            'user_id' => $this->user->id,
            'mood_score' => 4,
            'log_date' => $today,
            'note' => 'Hari produktif dan tenang.',
            'journal_id' => null,
        ]);
    }

    public function test_user_can_store_multiple_mood_logs_on_same_day(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $this->actingAs($this->user)->post(route('moods.store'), [
            'mood_score' => 2,
            'log_date' => $today,
            'emotions' => ['Lelah'],
            'note' => 'Pagi kurang tidur.',
        ]);

        $this->actingAs($this->user)->post(route('moods.store'), [
            'mood_score' => 5,
            'log_date' => $today,
            'emotions' => ['Senang', 'Bersyukur'],
            'note' => 'Malam lega tugas selesai.',
        ]);

        $this->assertDatabaseCount('mood_logs', 2);
        $this->assertEquals(2, $this->user->moodLogs()->whereDate('log_date', $today)->count());
    }

    public function test_validation_rejects_out_of_bound_mood_score(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $response = $this->actingAs($this->user)->post(route('moods.store'), [
            'mood_score' => 6,
            'log_date' => $today,
        ]);
        $response->assertSessionHasErrors('mood_score');

        $responseZero = $this->actingAs($this->user)->post(route('moods.store'), [
            'mood_score' => 0,
            'log_date' => $today,
        ]);
        $responseZero->assertSessionHasErrors('mood_score');
    }

    public function test_validation_rejects_future_dates(): void
    {
        $tomorrow = Carbon::now('Asia/Jakarta')->addDay()->toDateString();

        $response = $this->actingAs($this->user)->post(route('moods.store'), [
            'mood_score' => 4,
            'log_date' => $tomorrow,
        ]);

        $response->assertSessionHasErrors('log_date');
    }

    public function test_user_can_backdate_mood_log(): void
    {
        $threeDaysAgo = Carbon::now('Asia/Jakarta')->subDays(3)->toDateString();

        $response = $this->actingAs($this->user)->post(route('moods.store'), [
            'mood_score' => 3,
            'log_date' => $threeDaysAgo,
            'note' => 'Mencatat mood yang lupa diinput.',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('mood_logs', [
            'user_id' => $this->user->id,
            'log_date' => $threeDaysAgo,
            'mood_score' => 3,
        ]);
    }

    public function test_user_can_attach_mood_to_owned_journal(): void
    {
        $journal = Journal::factory()->create(['user_id' => $this->user->id]);
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $response = $this->actingAs($this->user)->post(route('moods.store'), [
            'mood_score' => 5,
            'log_date' => $today,
            'journal_id' => $journal->id,
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('mood_logs', [
            'user_id' => $this->user->id,
            'journal_id' => $journal->id,
            'mood_score' => 5,
        ]);
    }

    public function test_user_cannot_attach_mood_to_other_users_journal(): void
    {
        $otherUser = User::factory()->create();
        $journal = Journal::factory()->create(['user_id' => $otherUser->id]);
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $response = $this->actingAs($this->user)->post(route('moods.store'), [
            'mood_score' => 5,
            'log_date' => $today,
            'journal_id' => $journal->id,
        ]);

        $response->assertSessionHasErrors('journal_id');
    }

    public function test_user_can_update_own_mood_log(): void
    {
        $moodLog = MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'mood_score' => 2,
            'note' => 'Catatan lama',
        ]);

        $response = $this->actingAs($this->user)->put(route('moods.update', $moodLog), [
            'mood_score' => 4,
            'note' => 'Catatan diperbarui',
            'emotions' => ['Tenang'],
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('mood_logs', [
            'id' => $moodLog->id,
            'mood_score' => 4,
            'note' => 'Catatan diperbarui',
        ]);
    }

    public function test_user_cannot_update_other_users_mood_log(): void
    {
        $otherUser = User::factory()->create();
        $moodLog = MoodLog::factory()->create([
            'user_id' => $otherUser->id,
            'mood_score' => 2,
        ]);

        $response = $this->actingAs($this->user)->put(route('moods.update', $moodLog), [
            'mood_score' => 5,
        ]);

        $response->assertForbidden();
    }

    public function test_user_can_delete_own_mood_log(): void
    {
        $moodLog = MoodLog::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user)->delete(route('moods.destroy', $moodLog));

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('mood_logs', ['id' => $moodLog->id]);
    }

    public function test_user_cannot_delete_other_users_mood_log(): void
    {
        $otherUser = User::factory()->create();
        $moodLog = MoodLog::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)->delete(route('moods.destroy', $moodLog));

        $response->assertForbidden();
        $this->assertDatabaseHas('mood_logs', ['id' => $moodLog->id]);
    }
}
