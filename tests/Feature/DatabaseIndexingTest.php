<?php

namespace Tests\Feature;

use App\Models\Habit;
use App\Models\Journal;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class DatabaseIndexingTest extends TestCase
{
    use RefreshDatabase;

    public function test_composite_and_lookup_indexes_exist(): void
    {
        $habitsIndexes = Schema::getIndexes('habits');
        $habitIndexNames = array_column($habitsIndexes, 'name');
        $this->assertContains('habits_user_archive_start_index', $habitIndexNames);

        $journalsIndexes = Schema::getIndexes('journals');
        $journalIndexNames = array_column($journalsIndexes, 'name');
        $this->assertContains('journals_user_mood_index', $journalIndexNames);

        $journalTagIndexes = Schema::getIndexes('journal_tag');
        $journalTagIndexNames = array_column($journalTagIndexes, 'name');
        $this->assertContains('journal_tag_tag_id_index', $journalTagIndexNames);
    }

    public function test_indexed_queries_execute_smoothly(): void
    {
        $user = User::factory()->create();

        $h = Habit::create([
            'user_id' => $user->id,
            'name' => 'Olahraga Pagi',
            'measurement_type' => 'duration',
            'target_value' => 30,
            'unit' => 'menit',
            'frequency_type' => 'daily',
            'start_date' => now()->toDateString(),
            'is_archived' => false,
        ]);

        $activeHabits = Habit::query()
            ->where('user_id', $user->id)
            ->where('is_archived', false)
            ->whereDate('start_date', '<=', now()->toDateString())
            ->get();

        $this->assertCount(1, $activeHabits);

        $journal = Journal::create([
            'user_id' => $user->id,
            'title' => 'Catatan Mood',
            'entry_type' => 'freeform',
            'content' => 'Hari cerah dan bersemangat.',
            'entry_date' => now()->toDateString(),
            'mood_score' => 5,
        ]);

        $tag = Tag::create([
            'user_id' => null,
            'name' => 'Kebugaran',
            'slug' => 'kebugaran',
        ]);

        $journal->tags()->attach($tag->id);

        $journalsByTag = Journal::query()
            ->whereHas('tags', fn ($q) => $q->where('tags.id', $tag->id))
            ->where('user_id', $user->id)
            ->where('mood_score', 5)
            ->get();

        $this->assertCount(1, $journalsByTag);
    }
}
