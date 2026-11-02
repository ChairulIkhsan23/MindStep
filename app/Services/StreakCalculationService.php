<?php

namespace App\Services;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\Journal;
use App\Models\User;
use App\Models\UserFreeze;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class StreakCalculationService
{
    public const int MONTHLY_FREEZE_LIMIT = 2;

    public const int MAX_CONSECUTIVE_FREEZES = 2;

    /**
     * Calculate global daily streak for a user:
     * A day is completed if:
     * 1. User has at least 1 active scheduled habit, and ALL scheduled habits are 'completed' (or day has a 'freeze').
     * 2. User has at least 1 journal entry on that date.
     *
     * @return array{
     *     current_streak: int,
     *     longest_streak: int,
     *     today_perfect: bool,
     *     today_habits_completed: int,
     *     today_habits_total: int,
     *     today_journal_completed: bool,
     *     is_at_risk: bool,
     *     streak_level: array{level: int, label: string, badge: string}
     * }
     */
    public function calculateForUser(User $user, ?Carbon $referenceDate = null): array
    {
        $userTimezone = $user->timezone ?? 'UTC';
        $today = $referenceDate ? $referenceDate->copy()->setTimezone($userTimezone) : Carbon::now($userTimezone);
        $today = $today->startOfDay();

        $habits = $user->habits()->where('is_archived', false)->get();
        if ($habits->isEmpty()) {
            return [
                'current_streak' => 0,
                'longest_streak' => 0,
                'today_perfect' => false,
                'today_habits_completed' => 0,
                'today_habits_total' => 0,
                'today_journal_completed' => false,
                'is_at_risk' => false,
                'streak_level' => $this->resolveStreakLevel(0),
            ];
        }

        // Preload logs and journals
        $earliestStart = $habits->min('start_date');
        $earliestDate = $earliestStart ? Carbon::parse($earliestStart, $userTimezone)->startOfDay() : $today->copy()->subDays(60);

        $habitLogs = HabitLog::query()
            ->where('user_id', $user->id)
            ->whereBetween('log_date', [$earliestDate->toDateString(), $today->toDateString()])
            ->get()
            ->groupBy(fn (HabitLog $log) => $log->log_date instanceof Carbon ? $log->log_date->toDateString() : (string) $log->log_date);

        $journalsByDate = Journal::query()
            ->where('user_id', $user->id)
            ->whereBetween('entry_date', [$earliestDate->toDateString(), $today->toDateString()])
            ->get()
            ->groupBy(fn (Journal $j) => $j->entry_date instanceof Carbon ? $j->entry_date->toDateString() : (string) $j->entry_date);

        $userFreezesByDate = UserFreeze::query()
            ->where('user_id', $user->id)
            ->whereBetween('freeze_date', [$earliestDate->toDateString(), $today->toDateString()])
            ->get()
            ->keyBy(fn (UserFreeze $f) => $f->freeze_date instanceof Carbon ? $f->freeze_date->toDateString() : (string) $f->freeze_date);

        // Helper to evaluate a specific date
        $evaluateDate = function (Carbon $date) use ($habits, $habitLogs, $journalsByDate, $userFreezesByDate) {
            $dateStr = $date->toDateString();
            $scheduledHabits = $habits->filter(function (Habit $h) use ($date) {
                if ($date->lt($h->start_date->copy()->startOfDay())) {
                    return false;
                }
                if ($h->end_date && $date->gt($h->end_date->copy()->endOfDay())) {
                    return false;
                }

                return $this->isDayScheduled($h, $date);
            });

            $totalScheduled = $scheduledHabits->count();
            if ($totalScheduled === 0) {
                return ['completed' => false, 'freeze' => false, 'habits_completed' => 0, 'habits_total' => 0, 'journal_completed' => false];
            }

            $dateLogs = $habitLogs->get($dateStr, collect())->keyBy('habit_id');
            $hasFreeze = $dateLogs->contains(fn ($l) => $l->status === 'freeze') || $userFreezesByDate->has($dateStr);

            $completedHabits = 0;
            foreach ($scheduledHabits as $habit) {
                $log = $dateLogs->get($habit->id);
                if ($log && $log->status === 'completed') {
                    $completedHabits++;
                }
            }

            $allHabitsDone = ($completedHabits === $totalScheduled);
            $hasJournal = $journalsByDate->has($dateStr) && $journalsByDate->get($dateStr)->isNotEmpty();

            $isPerfect = ($allHabitsDone && $hasJournal);

            return [
                'completed' => $isPerfect,
                'freeze' => $hasFreeze,
                'habits_completed' => $completedHabits,
                'habits_total' => $totalScheduled,
                'journal_completed' => $hasJournal,
            ];
        };

        // Check Today
        $todayEval = $evaluateDate($today);
        $todayPerfect = $todayEval['completed'];
        $currentStreak = 0;
        $yesterdayMissed = false;

        $cursor = $today->copy();
        if ($todayPerfect) {
            $currentStreak++;
            $cursor->subDay();
        } elseif ($todayEval['freeze']) {
            $cursor->subDay();
        } else {
            $cursor->subDay();
        }

        // Auto-protect yesterday if missing, user has previous streak, and has available freeze credits
        $yesterday = $today->copy()->subDay();
        if ($cursor->equalTo($yesterday)) {
            $yesterdayEval = $evaluateDate($yesterday);
            if (! $yesterdayEval['completed'] && ! $yesterdayEval['freeze']) {
                $yesterdayMissed = true;
                // Check if user had an active streak before yesterday
                $checkBefore = $yesterday->copy()->subDay();
                $hadStreakBefore = false;
                while ($checkBefore->gte($earliestDate)) {
                    $checkEval = $evaluateDate($checkBefore);
                    if ($checkEval['completed']) {
                        $hadStreakBefore = true;
                        break;
                    } elseif ($checkEval['freeze']) {
                        $checkBefore->subDay();

                        continue;
                    }
                    break;
                }

                if ($hadStreakBefore && $this->getRemainingFreezeCredits($user, $yesterday) > 0) {
                    UserFreeze::firstOrCreate([
                        'user_id' => $user->id,
                        'freeze_date' => $yesterday->toDateString(),
                    ]);
                    $userFreezesByDate->put($yesterday->toDateString(), new UserFreeze([
                        'user_id' => $user->id,
                        'freeze_date' => $yesterday->toDateString(),
                    ]));
                }
            }
        }

        // Iterate backwards
        while ($cursor->gte($earliestDate)) {
            $eval = $evaluateDate($cursor);
            if ($eval['completed']) {
                $currentStreak++;
            } elseif ($eval['freeze']) {
                // Freeze holds streak
            } else {
                break;
            }
            $cursor->subDay();
        }

        // Alert banner only triggers if user missed yesterday and has not finished today yet
        $isAtRisk = $yesterdayMissed && ! $todayPerfect;

        return [
            'current_streak' => $currentStreak,
            'longest_streak' => max($currentStreak, 0),
            'today_perfect' => $todayPerfect,
            'today_habits_completed' => $todayEval['habits_completed'],
            'today_habits_total' => $todayEval['habits_total'],
            'today_journal_completed' => $todayEval['journal_completed'],
            'is_at_risk' => $isAtRisk,
            'streak_level' => $this->resolveStreakLevel($currentStreak),
        ];
    }

    /**
     * Calculate streak metrics and status for a habit.
     *
     * @return array{
     *     current_streak: int,
     *     longest_streak: int,
     *     completion_rate: float,
     *     is_at_risk: bool,
     *     streak_level: array{level: int, label: string, badge: string}
     * }
     */
    public function calculateForHabit(Habit $habit, ?Carbon $referenceDate = null): array
    {
        $userTimezone = $habit->user?->timezone ?? 'UTC';
        $today = $referenceDate ? $referenceDate->copy()->setTimezone($userTimezone) : Carbon::now($userTimezone);
        $today = $today->startOfDay();

        $startDate = $habit->start_date->copy()->startOfDay();
        if ($today->lt($startDate)) {
            return [
                'current_streak' => 0,
                'longest_streak' => 0,
                'completion_rate' => 0.0,
                'is_at_risk' => false,
                'streak_level' => $this->resolveStreakLevel(0),
            ];
        }

        /** @var Collection<string, HabitLog> $logsByDate */
        $logsByDate = $habit->logs()
            ->whereDate('log_date', '<=', $today->toDateString())
            ->get()
            ->keyBy(fn (HabitLog $log) => $log->log_date->toDateString());

        // 1. Calculate Current Streak
        $currentStreak = 0;
        $isAtRisk = false;

        $todayStr = $today->toDateString();
        $todayLog = $logsByDate->get($todayStr);
        $todayStatus = $todayLog?->status;

        $isTodayScheduled = $this->isDayScheduled($habit, $today);

        $cursor = $today->copy();

        if ($todayStatus === 'completed') {
            $currentStreak++;
            $cursor->subDay();
        } elseif ($todayStatus === 'freeze' || ($todayStatus === 'rest_day' && ! $isTodayScheduled)) {
            // Freeze or valid rest day today does not break streak
            $cursor->subDay();
        } else {
            // Not completed today
            if ($isTodayScheduled) {
                $isAtRisk = true;
            }
            $cursor->subDay();
        }

        // Iterate backwards from cursor to calculate current continuous chain
        while ($cursor->gte($startDate)) {
            $cursorStr = $cursor->toDateString();
            $log = $logsByDate->get($cursorStr);
            $status = $log?->status;
            $isScheduled = $this->isDayScheduled($habit, $cursor);

            if ($status === 'completed') {
                $currentStreak++;
            } elseif ($status === 'freeze') {
                // Streak holds, but does not increment
            } elseif (! $isScheduled || $status === 'rest_day') {
                // Scheduled rest day on specific_days holds streak
            } else {
                // Missed scheduled day or explicitly not_completed/partial
                break;
            }

            $cursor->subDay();
        }

        // If today is at risk and streak is 0, check if yesterday was actually completed
        if ($isAtRisk && $currentStreak === 0) {
            $yesterdayStr = $today->copy()->subDay()->toDateString();
            $yesterdayLog = $logsByDate->get($yesterdayStr);
            if ($yesterdayLog?->status !== 'completed') {
                $isAtRisk = false;
            }
        }

        // 2. Calculate Longest Streak & Completion Rate
        $longestStreak = 0;
        $runningStreak = 0;
        $totalScheduledDays = 0;
        $totalCompletedDays = 0;

        $forwardCursor = $startDate->copy();
        while ($forwardCursor->lte($today)) {
            $forwardStr = $forwardCursor->toDateString();
            $log = $logsByDate->get($forwardStr);
            $status = $log?->status;
            $isScheduled = $this->isDayScheduled($habit, $forwardCursor);

            if ($isScheduled) {
                $totalScheduledDays++;
            }

            if ($status === 'completed') {
                $totalCompletedDays++;
                $runningStreak++;
                if ($runningStreak > $longestStreak) {
                    $longestStreak = $runningStreak;
                }
            } elseif ($status === 'freeze' || (! $isScheduled && $status === 'rest_day') || (! $isScheduled && ! $status)) {
                // Preserves running streak
            } else {
                // Missed
                $runningStreak = 0;
            }

            $forwardCursor->addDay();
        }

        $completionRate = $totalScheduledDays > 0
            ? round(($totalCompletedDays / $totalScheduledDays) * 100, 1)
            : 0.0;

        return [
            'current_streak' => $currentStreak,
            'longest_streak' => max($longestStreak, $currentStreak),
            'completion_rate' => $completionRate,
            'is_at_risk' => $isAtRisk && $currentStreak > 0,
            'streak_level' => $this->resolveStreakLevel($currentStreak),
        ];
    }

    /**
     * Check if a habit is scheduled for execution on a given date.
     */
    public function isDayScheduled(Habit $habit, Carbon $date): bool
    {
        if ($habit->end_date && $date->gt($habit->end_date->copy()->startOfDay())) {
            return false;
        }

        if ($date->lt($habit->start_date->copy()->startOfDay())) {
            return false;
        }

        return match ($habit->frequency_type) {
            'daily' => true,
            'specific_days' => in_array($date->dayOfWeekIso, $habit->scheduled_days ?? [], true),
            'weekly_target' => true, // Evaluated flexibly
            default => true,
        };
    }

    /**
     * Calculate remaining freeze credits for a user in the given month.
     */
    public function getRemainingFreezeCredits(User $user, ?Carbon $referenceDate = null): int
    {
        $userTimezone = $user->timezone ?? 'UTC';
        $date = $referenceDate ? $referenceDate->copy()->setTimezone($userTimezone) : Carbon::now($userTimezone);

        $usedHabitLogs = HabitLog::query()
            ->where('user_id', $user->id)
            ->where('status', 'freeze')
            ->whereYear('log_date', $date->year)
            ->whereMonth('log_date', $date->month)
            ->distinct()
            ->count('log_date');

        $usedUserFreezes = UserFreeze::query()
            ->where('user_id', $user->id)
            ->whereYear('freeze_date', $date->year)
            ->whereMonth('freeze_date', $date->month)
            ->count();

        $totalUsed = max($usedHabitLogs, $usedUserFreezes);

        return max(0, self::MONTHLY_FREEZE_LIMIT - $totalUsed);
    }

    /**
     * Determine if freeze status can be applied to a specific habit and date.
     */
    public function canApplyFreeze(Habit $habit, string $dateString): bool
    {
        $targetDate = Carbon::parse($dateString);

        if ($this->getRemainingFreezeCredits($habit->user, $targetDate) <= 0) {
            return false;
        }

        // Check if previous 2 consecutive days were already frozen for this habit
        $twoDaysBefore = $targetDate->copy()->subDays(2)->toDateString();
        $oneDayBefore = $targetDate->copy()->subDay()->toDateString();

        $priorFreezesCount = $habit->logs()
            ->whereIn('log_date', [$twoDaysBefore, $oneDayBefore])
            ->where('status', 'freeze')
            ->count();

        return $priorFreezesCount < self::MAX_CONSECUTIVE_FREEZES;
    }

    /**
     * Resolve maturity badge and description based on streak count.
     *
     * @return array{level: int, label: string, badge: string}
     */
    public function resolveStreakLevel(int $streak): array
    {
        return match (true) {
            $streak >= 100 => ['level' => 6, 'label' => 'Mastery', 'badge' => '👑'],
            $streak >= 66 => ['level' => 5, 'label' => 'Otomatis', 'badge' => '💎'],
            $streak >= 22 => ['level' => 4, 'label' => 'Konsisten', 'badge' => '🏆'],
            $streak >= 8 => ['level' => 3, 'label' => 'Membentuk Pola', 'badge' => '🔄'],
            $streak >= 4 => ['level' => 2, 'label' => 'Membangun Ritme', 'badge' => '⚡'],
            $streak >= 1 => ['level' => 1, 'label' => 'Memulai', 'badge' => '🌱'],
            default => ['level' => 0, 'label' => 'Belum Dimulai', 'badge' => '⚪'],
        };
    }
}
