<?php

namespace Tests\Feature\Habit;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\Journal;
use App\Models\User;
use App\Services\StreakCalculationService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserDailyStreakTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_daily_streak_increments_only_when_all_habits_and_journal_completed(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 5, 20, 12, 0, 0));
        $user = User::factory()->create();

        // 2 Habits aktif
        $habit1 = Habit::factory()->create([
            'user_id' => $user->id,
            'frequency_type' => 'daily',
            'start_date' => now()->subDays(5)->toDateString(),
        ]);
        $habit2 = Habit::factory()->create([
            'user_id' => $user->id,
            'frequency_type' => 'daily',
            'start_date' => now()->subDays(5)->toDateString(),
        ]);

        $service = app(StreakCalculationService::class);

        // Kasus 1: Hari ini habit 1 selesai, habit 2 belum, jurnal belum -> streak 0
        HabitLog::factory()->create([
            'habit_id' => $habit1->id,
            'user_id' => $user->id,
            'log_date' => now()->toDateString(),
            'status' => 'completed',
        ]);

        $result1 = $service->calculateForUser($user, now());
        $this->assertEquals(0, $result1['current_streak']);
        $this->assertFalse($result1['today_perfect']);

        // Kasus 2: Habit 2 selesai, tapi jurnal belum dibuat -> streak tetap 0
        HabitLog::factory()->create([
            'habit_id' => $habit2->id,
            'user_id' => $user->id,
            'log_date' => now()->toDateString(),
            'status' => 'completed',
        ]);

        $result2 = $service->calculateForUser($user, now());
        $this->assertEquals(0, $result2['current_streak']);
        $this->assertFalse($result2['today_perfect']);

        // Kasus 3: Jurnal dibuat pada tanggal yang sama -> streak jadi 1 (Perfect Day)
        Journal::factory()->create([
            'user_id' => $user->id,
            'entry_date' => now()->toDateString(),
        ]);

        $result3 = $service->calculateForUser($user, now());
        $this->assertEquals(1, $result3['current_streak']);
        $this->assertTrue($result3['today_perfect']);

        Carbon::setTestNow();
    }
}
