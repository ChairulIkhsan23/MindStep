<?php

namespace Tests\Feature\Journal;

use App\Models\Journal;
use App\Models\JournalTemplate;
use App\Models\MoodLog;
use App\Models\Tag;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\JournalTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JournalManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(JournalTemplateSeeder::class);
        $this->user = User::factory()->create([
            'timezone' => 'Asia/Jakarta',
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('journals.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_user_can_view_journal_index(): void
    {
        Journal::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'is_draft' => false,
        ]);
        Journal::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'is_draft' => true,
        ]);

        $response = $this->actingAs($this->user)->get(route('journals.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Journals/Index')
            ->has('journals.data', 5)
            ->where('draft_count', 2)
            ->has('available_tags')
        );
    }

    public function test_user_can_create_freeform_journal_and_publish(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $response = $this->actingAs($this->user)->post(route('journals.store'), [
            'title' => 'Refleksi Akhir Pekan',
            'entry_type' => 'freeform',
            'content' => 'Hari ini sangat produktif menyelesaikan beberapa pekerjaan penting.',
            'entry_date' => $today,
            'is_draft' => false,
            'tags' => ['Produktivitas', 'Karir'],
        ]);

        $response->assertRedirect(route('journals.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('journals', [
            'user_id' => $this->user->id,
            'title' => 'Refleksi Akhir Pekan',
            'entry_type' => 'freeform',
            'is_draft' => false,
            'entry_date' => $today,
        ]);

        $journal = Journal::where('title', 'Refleksi Akhir Pekan')->first();
        $this->assertCount(2, $journal->tags);
    }

    public function test_user_can_save_journal_as_draft(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $response = $this->actingAs($this->user)->post(route('journals.store'), [
            'title' => 'Ide Jurnal Masa Depan',
            'entry_type' => 'freeform',
            'content' => 'Draf masih berupa poin-poin ide...',
            'entry_date' => $today,
            'is_draft' => true,
        ]);

        $response->assertRedirect(route('journals.index'));
        $this->assertDatabaseHas('journals', [
            'user_id' => $this->user->id,
            'title' => 'Ide Jurnal Masa Depan',
            'is_draft' => true,
        ]);
    }

    public function test_user_can_create_template_based_journal(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $response = $this->actingAs($this->user)->post(route('journals.store'), [
            'title' => 'Rasa Syukur Pagi',
            'entry_type' => 'template',
            'template_name' => 'gratitude',
            'content' => '1. Bersyukur atas kesehatan. 2. Keluarga yang mendukung.',
            'entry_date' => $today,
            'is_draft' => false,
        ]);

        $response->assertRedirect(route('journals.index'));
        $this->assertDatabaseHas('journals', [
            'user_id' => $this->user->id,
            'entry_type' => 'template',
            'template_name' => 'gratitude',
        ]);
    }

    public function test_template_mode_requires_valid_template_name(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $response = $this->actingAs($this->user)->post(route('journals.store'), [
            'title' => 'Gagal Template',
            'entry_type' => 'template',
            'template_name' => 'invalid_template_name',
            'content' => 'Konten...',
            'entry_date' => $today,
        ]);

        $response->assertSessionHasErrors('template_name');
    }

    public function test_template_mode_rejects_inactive_template(): void
    {
        $inactiveTemplate = JournalTemplate::factory()->inactive()->create([
            'slug' => 'old_template',
        ]);
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $response = $this->actingAs($this->user)->post(route('journals.store'), [
            'title' => 'Coba Template Nonaktif',
            'entry_type' => 'template',
            'template_name' => $inactiveTemplate->slug,
            'content' => 'Konten...',
            'entry_date' => $today,
        ]);

        $response->assertSessionHasErrors('template_name');
    }

    public function test_saving_journal_with_mood_automatically_syncs_mood_log(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $response = $this->actingAs($this->user)->post(route('journals.store'), [
            'title' => 'Hari Menyenangkan',
            'entry_type' => 'freeform',
            'content' => 'Catatan jurnal...',
            'entry_date' => $today,
            'is_draft' => false,
            'mood_score' => 5,
            'emotions' => ['Senang', 'Bersyukur'],
        ]);

        $response->assertRedirect(route('journals.index'));

        $journal = Journal::where('title', 'Hari Menyenangkan')->first();
        $this->assertEquals(5, $journal->mood_score);

        $this->assertDatabaseHas('mood_logs', [
            'user_id' => $this->user->id,
            'journal_id' => $journal->id,
            'mood_score' => 5,
            'log_date' => $today,
        ]);
    }

    public function test_validation_rejects_future_dates(): void
    {
        $tomorrow = Carbon::now('Asia/Jakarta')->addDay()->toDateString();

        $response = $this->actingAs($this->user)->post(route('journals.store'), [
            'title' => 'Jurnal Masa Depan',
            'entry_type' => 'freeform',
            'content' => 'Konten...',
            'entry_date' => $tomorrow,
        ]);

        $response->assertSessionHasErrors('entry_date');
    }

    public function test_user_can_view_own_journal_detail(): void
    {
        $journal = Journal::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Detail Jurnal',
        ]);

        $response = $this->actingAs($this->user)->get(route('journals.show', $journal));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Journals/Show')
            ->where('journal.id', $journal->id)
            ->where('journal.title', 'Detail Jurnal')
        );
    }

    public function test_user_cannot_view_other_users_journal(): void
    {
        $otherUser = User::factory()->create();
        $journal = Journal::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)->get(route('journals.show', $journal));

        $response->assertForbidden();
    }

    public function test_user_can_update_journal_and_attached_mood(): void
    {
        $journal = Journal::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Judul Awal',
            'mood_score' => 2,
        ]);
        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'journal_id' => $journal->id,
            'mood_score' => 2,
            'log_date' => $journal->entry_date->toDateString(),
        ]);

        $response = $this->actingAs($this->user)->put(route('journals.update', $journal), [
            'title' => 'Judul Diperbarui',
            'entry_type' => 'freeform',
            'content' => 'Isi diperbarui.',
            'entry_date' => $journal->entry_date->toDateString(),
            'mood_score' => 4,
            'emotions' => ['Tenang'],
            'tags' => ['UpdateTag'],
        ]);

        $response->assertRedirect(route('journals.index'));
        $this->assertDatabaseHas('journals', [
            'id' => $journal->id,
            'title' => 'Judul Diperbarui',
            'mood_score' => 4,
        ]);
        $this->assertDatabaseHas('mood_logs', [
            'journal_id' => $journal->id,
            'mood_score' => 4,
        ]);
    }

    public function test_user_cannot_update_other_users_journal(): void
    {
        $otherUser = User::factory()->create();
        $journal = Journal::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)->put(route('journals.update', $journal), [
            'title' => 'Mencoba Bajak',
        ]);

        $response->assertForbidden();
    }

    public function test_deleting_journal_nullifies_attached_mood_log(): void
    {
        $journal = Journal::factory()->create([
            'user_id' => $this->user->id,
            'mood_score' => 3,
        ]);
        $moodLog = MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'journal_id' => $journal->id,
            'mood_score' => 3,
            'log_date' => $journal->entry_date->toDateString(),
        ]);

        $response = $this->actingAs($this->user)->delete(route('journals.destroy', $journal));

        $response->assertRedirect(route('journals.index'));
        $this->assertDatabaseMissing('journals', ['id' => $journal->id]);

        // Mood log must still exist with journal_id set to null
        $this->assertDatabaseHas('mood_logs', [
            'id' => $moodLog->id,
            'journal_id' => null,
            'mood_score' => 3,
        ]);
    }

    public function test_filter_and_search_journals(): void
    {
        $tag = Tag::factory()->create(['user_id' => $this->user->id, 'name' => 'Fokus', 'slug' => 'fokus']);

        $j1 = Journal::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Catatan Penting Pekerjaan',
            'content' => 'Fokus pada target Q4',
            'mood_score' => 5,
        ]);
        $j1->tags()->attach($tag->id);

        $j2 = Journal::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Liburan Santai',
            'content' => 'Pergi ke pantai menikmati sore',
            'mood_score' => 3,
        ]);

        $response = $this->actingAs($this->user)->get(route('journals.index', [
            'search' => 'Pekerjaan',
        ]));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('journals.data', 1)
            ->where('journals.data.0.id', $j1->id)
        );

        $responseTag = $this->actingAs($this->user)->get(route('journals.index', [
            'tag' => 'fokus',
        ]));
        $responseTag->assertOk();
        $responseTag->assertInertia(fn ($page) => $page
            ->has('journals.data', 1)
            ->where('journals.data.0.id', $j1->id)
        );
    }
}
