<?php

namespace Tests\Feature;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\Journal;
use App\Models\MoodLog;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CoreModelsTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_have_habits_and_journals(): void
    {
        $user = User::factory()->create();

        $habit = Habit::create([
            'user_id' => $user->id,
            'name' => 'Baca Buku',
            'measurement_type' => 'quantitative',
            'target_value' => 20,
            'unit' => 'halaman',
            'frequency_type' => 'daily',
            'start_date' => now()->toDateString(),
        ]);

        $journal = Journal::create([
            'user_id' => $user->id,
            'title' => 'Hari Pertama Membaca',
            'entry_type' => 'freeform',
            'content' => 'Membaca bab satu tentang kebiasaan atomik.',
            'entry_date' => now()->toDateString(),
            'mood_score' => 4,
        ]);

        $this->assertCount(1, $user->habits);
        $this->assertEquals('Baca Buku', $user->habits->first()->name);
        $this->assertCount(1, $user->journals);
        $this->assertEquals('Hari Pertama Membaca', $user->journals->first()->title);
    }

    public function test_habit_log_enforces_unique_habit_and_date(): void
    {
        $user = User::factory()->create();
        $habit = Habit::create([
            'user_id' => $user->id,
            'name' => 'Minum Air',
            'measurement_type' => 'quantitative',
            'target_value' => 8,
            'unit' => 'gelas',
            'frequency_type' => 'daily',
            'start_date' => now()->toDateString(),
        ]);

        $date = now()->toDateString();

        HabitLog::create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => $date,
            'actual_value' => 4,
            'status' => 'partial',
        ]);

        $this->expectException(QueryException::class);

        HabitLog::create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => $date,
            'actual_value' => 8,
            'status' => 'completed',
        ]);
    }

    public function test_journal_tag_association(): void
    {
        $user = User::factory()->create();
        $tag = Tag::create([
            'user_id' => null,
            'name' => 'Pengembangan Diri',
            'slug' => 'pengembangan-diri',
        ]);

        $journal = Journal::create([
            'user_id' => $user->id,
            'title' => 'Evaluasi Diri',
            'entry_type' => 'freeform',
            'content' => 'Belajar konsisten.',
            'entry_date' => now()->toDateString(),
        ]);

        $journal->tags()->attach($tag->id);

        $this->assertCount(1, $journal->fresh()->tags);
        $this->assertEquals('Pengembangan Diri', $journal->fresh()->tags->first()->name);
    }

    public function test_mood_log_can_be_associated_with_journal(): void
    {
        $user = User::factory()->create();
        $journal = Journal::create([
            'user_id' => $user->id,
            'title' => 'Catatan Syukur',
            'entry_type' => 'freeform',
            'content' => 'Alhamdulillah hari ini baik.',
            'entry_date' => now()->toDateString(),
            'mood_score' => 5,
        ]);

        $moodLog = MoodLog::create([
            'user_id' => $user->id,
            'journal_id' => $journal->id,
            'log_date' => now()->toDateString(),
            'mood_score' => 5,
            'emotions' => ['Bersyukur', 'Tenang'],
            'note' => 'Hari yang damai.',
        ]);

        $this->assertEquals($journal->id, $moodLog->journal->id);
        $this->assertEquals(5, $journal->moodLog->mood_score);
    }
}
