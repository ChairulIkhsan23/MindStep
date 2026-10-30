<?php

namespace App\Services;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\Journal;
use App\Models\MoodLog;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class AnalyticsAggregationService
{
    /**
     * @return array{
     *     range: array{key: string, start_date: string, end_date: string},
     *     habit_analytics: array{
     *         daily_trend: array<int, array{date: string, scheduled: int, completed: int, rate: int}>,
     *         top_consistent: array<int, array{id: int, name: string, color: string, rate: int, completed_count: int}>,
     *         needs_attention: array<int, array{id: int, name: string, color: string, rate: int, missed_count: int}>
     *     },
     *     mood_analytics: array{
     *         trend: array<int, array{date: string, avg_score: float|null}>,
     *         distribution: array<int, array{score: int, label: string, count: int, percentage: int}>,
     *         top_emotions: array<int, array{emotion: string, count: int}>
     *     },
     *     journal_analytics: array{
     *         total_entries: int,
     *         top_tags: array<int, array{name: string, count: int}>
     *     },
     *     activity_heatmap: array<string, int>,
     *     cross_correlation: array{
     *         successful_days_count: int,
     *         unsuccessful_days_count: int,
     *         avg_mood_on_successful_days: float|null,
     *         avg_mood_on_unsuccessful_days: float|null,
     *         insight_message: string
     *     }
     * }
     */
    public function getAnalytics(User $user, string $rangeKey = '7d', ?string $customStart = null, ?string $customEnd = null): array
    {
        $timezone = $user->timezone ?? config('app.timezone', 'UTC');
        [$startDate, $endDate, $resolvedKey] = $this->resolveDateRange($timezone, $rangeKey, $customStart, $customEnd);

        $period = CarbonPeriod::create($startDate, $endDate);
        $periodDates = collect($period)->map(fn (Carbon $date) => $date->toDateString());

        // 1. Habits Aggregation
        $habits = Habit::where('user_id', $user->id)
            ->where('start_date', '<=', $endDate)
            ->where(fn ($q) => $q->whereNull('end_date')->orWhere('end_date', '>=', $startDate))
            ->get();

        $habitLogs = HabitLog::where('user_id', $user->id)
            ->whereDate('log_date', '>=', $startDate)
            ->whereDate('log_date', '<=', $endDate)
            ->get()
            ->groupBy(fn (HabitLog $log) => $log->log_date->toDateString());

        $dailyHabitStats = [];
        $habitPerformance = [];

        foreach ($habits as $habit) {
            $habitPerformance[$habit->id] = [
                'id' => $habit->id,
                'name' => $habit->name,
                'color' => $habit->color,
                'scheduled' => 0,
                'completed' => 0,
            ];
        }

        foreach ($periodDates as $dateStr) {
            $carbonDate = Carbon::parse($dateStr, $timezone);
            $dayOfWeek = $carbonDate->dayOfWeek; // 0..6
            $dayLogs = $habitLogs->get($dateStr, collect());

            $scheduledCount = 0;
            $completedCount = 0;

            foreach ($habits as $habit) {
                // Pastikan habit sudah aktif pada tanggal tersebut
                if ($carbonDate->lt(Carbon::parse($habit->start_date)->startOfDay())) {
                    continue;
                }
                if ($habit->end_date && $carbonDate->gt(Carbon::parse($habit->end_date)->endOfDay())) {
                    continue;
                }

                $isScheduled = false;
                if ($habit->frequency_type === 'daily' || $habit->frequency_type === 'weekly_target') {
                    $isScheduled = true;
                } elseif ($habit->frequency_type === 'specific_days') {
                    $days = $habit->scheduled_days ?? [];
                    $isScheduled = in_array($dayOfWeek, $days, true);
                }

                if ($isScheduled) {
                    $scheduledCount++;
                    $habitPerformance[$habit->id]['scheduled']++;

                    $log = $dayLogs->firstWhere('habit_id', $habit->id);
                    if ($log && $log->status === 'completed') {
                        $completedCount++;
                        $habitPerformance[$habit->id]['completed']++;
                    }
                }
            }

            $rate = $scheduledCount > 0 ? (int) round(($completedCount / $scheduledCount) * 100) : 0;

            $dailyHabitStats[$dateStr] = [
                'date' => $dateStr,
                'scheduled' => $scheduledCount,
                'completed' => $completedCount,
                'rate' => $rate,
            ];
        }

        // Top consistent vs needs attention
        $habitRanking = collect($habitPerformance)
            ->filter(fn ($item) => $item['scheduled'] > 0)
            ->map(function ($item) {
                $rate = (int) round(($item['completed'] / $item['scheduled']) * 100);
                $missed = $item['scheduled'] - $item['completed'];

                return [
                    'id' => $item['id'],
                    'name' => $item['name'],
                    'color' => $item['color'],
                    'rate' => $rate,
                    'completed_count' => $item['completed'],
                    'missed_count' => max($missed, 0),
                ];
            });

        $topConsistent = $habitRanking->sortByDesc('rate')->take(3)->values()->all();
        $needsAttention = $habitRanking->sortBy('rate')->take(3)->values()->all();

        // 2. Mood Analytics
        $moodLogs = MoodLog::where('user_id', $user->id)
            ->whereDate('log_date', '>=', $startDate)
            ->whereDate('log_date', '<=', $endDate)
            ->get();

        $moodLogsByDate = $moodLogs->groupBy(fn (MoodLog $m) => $m->log_date->toDateString());

        $moodTrend = $periodDates->map(function (string $dateStr) use ($moodLogsByDate) {
            $logs = $moodLogsByDate->get($dateStr);
            $avgScore = $logs && $logs->isNotEmpty() ? round($logs->avg('mood_score'), 1) : null;

            return [
                'date' => $dateStr,
                'avg_score' => $avgScore,
            ];
        })->all();

        // Distribution skor 1 - 5
        $scoreCounts = $moodLogs->countBy('mood_score');
        $totalMoods = $moodLogs->count();
        $labels = [
            1 => 'Sangat Buruk',
            2 => 'Buruk',
            3 => 'Netral',
            4 => 'Baik',
            5 => 'Sangat Baik',
        ];

        $moodDistribution = [];
        for ($s = 1; $s <= 5; $s++) {
            $cnt = $scoreCounts->get($s, 0);
            $pct = $totalMoods > 0 ? (int) round(($cnt / $totalMoods) * 100) : 0;
            $moodDistribution[] = [
                'score' => $s,
                'label' => $labels[$s],
                'count' => $cnt,
                'percentage' => $pct,
            ];
        }

        // Top emotions
        $topEmotions = $moodLogs->pluck('emotions')
            ->flatten()
            ->filter()
            ->countBy()
            ->sortDesc()
            ->take(5)
            ->map(fn ($count, $emotion) => ['emotion' => $emotion, 'count' => $count])
            ->values()
            ->all();

        // 3. Journal Analytics
        $journals = Journal::where('user_id', $user->id)
            ->whereDate('entry_date', '>=', $startDate)
            ->whereDate('entry_date', '<=', $endDate)
            ->with('tags:id,name')
            ->get();

        $topTags = $journals->pluck('tags')
            ->flatten()
            ->countBy('name')
            ->sortDesc()
            ->take(5)
            ->map(fn ($count, $tagName) => ['name' => $tagName, 'count' => $count])
            ->values()
            ->all();

        // 4. Heatmap Aktivitas (Gabungan Habit Log + Mood + Journal per hari)
        $heatmap = [];
        foreach ($periodDates as $dateStr) {
            $habitCount = isset($habitLogs[$dateStr]) ? $habitLogs[$dateStr]->where('status', 'completed')->count() : 0;
            $moodCount = isset($moodLogsByDate[$dateStr]) ? $moodLogsByDate[$dateStr]->count() : 0;
            $journalCount = $journals->where('entry_date', Carbon::parse($dateStr))->count();

            $totalActivity = $habitCount + $moodCount + $journalCount;
            if ($totalActivity > 0) {
                $heatmap[$dateStr] = $totalActivity;
            }
        }

        // 5. Analisis Korelasi Silang (FR-5.4)
        $successfulDaysMoods = [];
        $unsuccessfulDaysMoods = [];

        foreach ($periodDates as $dateStr) {
            $habitStat = $dailyHabitStats[$dateStr];
            $moodsOnDay = $moodLogsByDate->get($dateStr);

            if (! $moodsOnDay || $moodsOnDay->isEmpty() || $habitStat['scheduled'] === 0) {
                continue;
            }

            $avgMoodOnDay = $moodsOnDay->avg('mood_score');

            // Sukses jika seluruh scheduled tuntas (completion rate 100%)
            if ($habitStat['completed'] >= $habitStat['scheduled']) {
                $successfulDaysMoods[] = $avgMoodOnDay;
            } else {
                $unsuccessfulDaysMoods[] = $avgMoodOnDay;
            }
        }

        $avgMoodSuccessful = ! empty($successfulDaysMoods) ? round(collect($successfulDaysMoods)->avg(), 1) : null;
        $avgMoodUnsuccessful = ! empty($unsuccessfulDaysMoods) ? round(collect($unsuccessfulDaysMoods)->avg(), 1) : null;

        $insightMessage = $this->generateCorrelationInsight(
            count($successfulDaysMoods),
            count($unsuccessfulDaysMoods),
            $avgMoodSuccessful,
            $avgMoodUnsuccessful
        );

        return [
            'range' => [
                'key' => $resolvedKey,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'habit_analytics' => [
                'daily_trend' => array_values($dailyHabitStats),
                'top_consistent' => $topConsistent,
                'needs_attention' => $needsAttention,
            ],
            'mood_analytics' => [
                'trend' => $moodTrend,
                'distribution' => $moodDistribution,
                'top_emotions' => $topEmotions,
            ],
            'journal_analytics' => [
                'total_entries' => $journals->count(),
                'top_tags' => $topTags,
            ],
            'activity_heatmap' => $heatmap,
            'cross_correlation' => [
                'successful_days_count' => count($successfulDaysMoods),
                'unsuccessful_days_count' => count($unsuccessfulDaysMoods),
                'avg_mood_on_successful_days' => $avgMoodSuccessful,
                'avg_mood_on_unsuccessful_days' => $avgMoodUnsuccessful,
                'insight_message' => $insightMessage,
            ],
        ];
    }

    /**
     * @return array{0: string, 1: string, 2: string}
     */
    private function resolveDateRange(string $timezone, string $key, ?string $start, ?string $end): array
    {
        $now = Carbon::now($timezone);

        switch ($key) {
            case '30d':
                return [$now->copy()->subDays(29)->toDateString(), $now->toDateString(), '30d'];
            case 'this_month':
                return [$now->copy()->startOfMonth()->toDateString(), $now->toDateString(), 'this_month'];
            case '3m':
                return [$now->copy()->subDays(89)->toDateString(), $now->toDateString(), '3m'];
            case 'custom':
                if ($start && $end && $start <= $end) {
                    $clampedEnd = min($end, $now->toDateString());

                    return [$start, $clampedEnd, 'custom'];
                }

                return [$now->copy()->subDays(6)->toDateString(), $now->toDateString(), '7d'];
            case '7d':
            default:
                return [$now->copy()->subDays(6)->toDateString(), $now->toDateString(), '7d'];
        }
    }

    private function generateCorrelationInsight(
        int $successCount,
        int $unsuccessCount,
        ?float $avgSuccess,
        ?float $avgUnsuccess
    ): string {
        $totalDays = $successCount + $unsuccessCount;

        if ($totalDays < 3 || $avgSuccess === null || $avgUnsuccess === null) {
            return 'Belum cukup data aktivitas dan suasana hati untuk menarik korelasi signifikan. Terus catat minimal 3–5 hari.';
        }

        if ($avgSuccess > $avgUnsuccess) {
            $diff = round($avgSuccess - $avgUnsuccess, 1);

            return "Suasana hati Anda rata-rata {$diff} poin lebih tinggi pada hari ketika seluruh target kebiasaan berhasil dituntaskan.";
        }

        if ($avgSuccess < $avgUnsuccess) {
            return 'Tingkat stres mungkin memengaruhi hari-hari padat aktivitas. Evaluasi beban kebiasaan Anda agar tidak memicu kelelahan.';
        }

        return 'Suasana hati Anda cenderung stabil baik saat target harian tuntas maupun ketika ada yang terlewat.';
    }
}
