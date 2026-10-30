<?php

namespace Tests\Unit;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\User;
use App\Services\StreakCalculationService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StreakCalculationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected StreakCalculationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new StreakCalculationService;
    }

    public function test_streak_increments_with_consecutive_completed_days(): void
    {
        $user = User::factory()->create(['timezone' => 'UTC']);
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'frequency_type' => 'daily',
            'start_date' => Carbon::parse('2026-10-01'),
        ]);

        // Complete 3 consecutive days: Oct 1, Oct 2, Oct 3
        foreach (['2026-10-01', '2026-10-02', '2026-10-03'] as $date) {
            HabitLog::factory()->create([
                'habit_id' => $habit->id,
                'user_id' => $user->id,
                'log_date' => $date,
                'status' => 'completed',
            ]);
        }

        $metrics = $this->service->calculateForHabit($habit, Carbon::parse('2026-10-03'));

        $this->assertEquals(3, $metrics['current_streak']);
        $this->assertEquals(3, $metrics['longest_streak']);
        $this->assertEquals(100.0, $metrics['completion_rate']);
        $this->assertFalse($metrics['is_at_risk']);
        $this->assertEquals('Memulai', $metrics['streak_level']['label']);
    }

    public function test_streak_handles_specific_days_rest_day_without_breaking(): void
    {
        $user = User::factory()->create(['timezone' => 'UTC']);
        // Monday=1, Wednesday=3, Friday=5
        // 2026-10-19 is Monday, 2026-10-20 is Tuesday (Rest), 2026-10-21 is Wednesday
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'frequency_type' => 'specific_days',
            'scheduled_days' => [1, 3, 5],
            'start_date' => Carbon::parse('2026-10-19'),
        ]);

        // Complete Monday (Oct 19)
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-19',
            'status' => 'completed',
        ]);

        // Tuesday is naturally rest day (no log needed or rest_day log)
        // Complete Wednesday (Oct 21)
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-21',
            'status' => 'completed',
        ]);

        $metrics = $this->service->calculateForHabit($habit, Carbon::parse('2026-10-21'));

        $this->assertEquals(2, $metrics['current_streak']);
        $this->assertEquals(2, $metrics['longest_streak']);
        $this->assertEquals(100.0, $metrics['completion_rate']);
    }

    public function test_freeze_holds_streak_without_incrementing(): void
    {
        $user = User::factory()->create(['timezone' => 'UTC']);
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'frequency_type' => 'daily',
            'start_date' => Carbon::parse('2026-10-01'),
        ]);

        // Day 1: completed
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-01',
            'status' => 'completed',
        ]);

        // Day 2: freeze
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-02',
            'status' => 'freeze',
        ]);

        // Day 3: completed
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-03',
            'status' => 'completed',
        ]);

        $metrics = $this->service->calculateForHabit($habit, Carbon::parse('2026-10-03'));

        // Completed 2 days, frozen 1 day => current streak is 2
        $this->assertEquals(2, $metrics['current_streak']);
    }

    public function test_missed_day_breaks_streak_to_zero(): void
    {
        $user = User::factory()->create(['timezone' => 'UTC']);
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'frequency_type' => 'daily',
            'start_date' => Carbon::parse('2026-10-01'),
        ]);

        // Day 1: completed
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-01',
            'status' => 'completed',
        ]);

        // Day 2: missed (not completed)
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-02',
            'status' => 'not_completed',
        ]);

        // Checked on Day 3 morning (Oct 3 has no log yet)
        $metrics = $this->service->calculateForHabit($habit, Carbon::parse('2026-10-03'));

        $this->assertEquals(0, $metrics['current_streak']);
        $this->assertEquals(1, $metrics['longest_streak']);
    }

    public function test_grace_period_keeps_yesterdays_streak_active_today_if_today_uncompleted(): void
    {
        $user = User::factory()->create(['timezone' => 'UTC']);
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'frequency_type' => 'daily',
            'start_date' => Carbon::parse('2026-10-01'),
        ]);

        // Completed yesterday (Oct 1)
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-01',
            'status' => 'completed',
        ]);

        // Today is Oct 2, no log yet
        $metrics = $this->service->calculateForHabit($habit, Carbon::parse('2026-10-02'));

        $this->assertEquals(1, $metrics['current_streak']);
        $this->assertTrue($metrics['is_at_risk']);
    }

    public function test_monthly_freeze_credit_calculation_limits_to_two(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create(['user_id' => $user->id]);

        $this->assertEquals(2, $this->service->getRemainingFreezeCredits($user, Carbon::parse('2026-10-05')));

        // 1st freeze
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-05',
            'status' => 'freeze',
        ]);
        $this->assertEquals(1, $this->service->getRemainingFreezeCredits($user, Carbon::parse('2026-10-06')));

        // 2nd freeze
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-06',
            'status' => 'freeze',
        ]);
        $this->assertEquals(0, $this->service->getRemainingFreezeCredits($user, Carbon::parse('2026-10-07')));

        // In another month (November), credits reset back to 2
        $this->assertEquals(2, $this->service->getRemainingFreezeCredits($user, Carbon::parse('2026-11-01')));
    }

    public function test_freeze_cannot_be_applied_three_consecutive_days(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create(['user_id' => $user->id]);

        // Freeze on Oct 1 and Oct 2
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-01',
            'status' => 'freeze',
        ]);
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => '2026-10-02',
            'status' => 'freeze',
        ]);

        // Oct 3 check: cannot freeze for 3rd consecutive day
        $this->assertFalse($this->service->canApplyFreeze($habit, '2026-10-03'));
    }

    public function test_streak_maturity_levels_mapping(): void
    {
        $this->assertEquals('Belum Dimulai', $this->service->resolveStreakLevel(0)['label']);
        $this->assertEquals('Memulai', $this->service->resolveStreakLevel(3)['label']);
        $this->assertEquals('Membangun Ritme', $this->service->resolveStreakLevel(7)['label']);
        $this->assertEquals('Membentuk Pola', $this->service->resolveStreakLevel(21)['label']);
        $this->assertEquals('Konsisten', $this->service->resolveStreakLevel(50)['label']);
        $this->assertEquals('Otomatis', $this->service->resolveStreakLevel(80)['label']);
        $this->assertEquals('Mastery', $this->service->resolveStreakLevel(105)['label']);
    }
}
