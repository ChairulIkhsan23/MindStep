<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\Journal;
use App\Models\MoodLog;
use App\Services\StreakCalculationService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected StreakCalculationService $streakService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $timezone = $user->timezone ?? config('app.timezone', 'UTC');
        $now = Carbon::now($timezone);
        $today = $now->toDateString();
        $dayOfWeek = $now->dayOfWeek; // 0 (Minggu) - 6 (Sabtu)

        // 1. Sapaan Kontekstual & Tanggal
        $greetingMessage = $this->getGreetingMessage($now->hour, $user->name);
        $dateFormatted = $now->translatedFormat('l, d F Y');

        // 2. Actionable Habits Hari Ini
        $activeHabits = Habit::with(['logs' => function ($q) use ($today) {
            $q->whereDate('log_date', $today);
        }])
            ->where('user_id', $user->id)
            ->where('is_archived', false)
            ->get();

        $actionableHabits = $activeHabits->filter(function (Habit $habit) use ($dayOfWeek) {
            if ($habit->frequency_type === 'daily') {
                return true;
            }

            if ($habit->frequency_type === 'specific_days') {
                $days = $habit->scheduled_days ?? [];

                return in_array($dayOfWeek, $days, true);
            }

            // weekly_target selalu relevan ditampilkan
            return true;
        })->values();

        $habitsData = $actionableHabits->map(function (Habit $habit) use ($today) {
            $todayLog = $habit->logs->first();
            $stats = $this->streakService->calculateForHabit($habit, Carbon::parse($today));

            return [
                'id' => $habit->id,
                'name' => $habit->name,
                'description' => $habit->description,
                'color' => $habit->color,
                'icon' => $habit->icon,
                'measurement_type' => $habit->measurement_type,
                'target_value' => $habit->target_value,
                'unit' => $habit->unit,
                'frequency_type' => $habit->frequency_type,
                'today_log' => [
                    'id' => $todayLog?->id,
                    'current_value' => (float) ($todayLog?->actual_value ?? 0),
                    'status' => $todayLog?->status ?? 'unlogged',
                ],
                'stats' => [
                    'current_streak' => $stats['current_streak'],
                    'is_at_risk' => $stats['is_at_risk'],
                    'level' => $stats['streak_level']['level'],
                    'level_name' => $stats['streak_level']['label'],
                ],
            ];
        });

        $totalToday = $habitsData->count();
        $completedToday = $habitsData->where('today_log.status', 'completed')->count();
        $progressPercent = $totalToday > 0 ? (int) round(($completedToday / $totalToday) * 100) : 0;

        // 3. Quick Mood Status Hari Ini
        $todayMoodLogs = MoodLog::where('user_id', $user->id)
            ->whereDate('log_date', $today)
            ->orderBy('created_at', 'desc')
            ->get();

        $hasLoggedMoodToday = $todayMoodLogs->isNotEmpty();

        // 4. Pintasan Draf Jurnal Terakhir & Total Terbit
        $latestDraft = Journal::where('user_id', $user->id)
            ->drafts()
            ->orderBy('updated_at', 'desc')
            ->first();

        $totalPublishedJournals = Journal::where('user_id', $user->id)
            ->published()
            ->count();

        // 5. Mini-Insight 7 Hari Terakhir
        $sevenDaysAgo = Carbon::now($timezone)->subDays(6)->toDateString();

        // Rata-rata Mood 7 Hari
        $recentMoods = MoodLog::where('user_id', $user->id)
            ->whereDate('log_date', '>=', $sevenDaysAgo)
            ->whereDate('log_date', '<=', $today)
            ->get();

        $weeklyMoodAvg = $recentMoods->isNotEmpty()
            ? round($recentMoods->avg('mood_score'), 1)
            : null;

        // Habit Completion Rate 7 Hari
        $weeklyHabitRate = $this->calculateWeeklyHabitCompletionRate($user->id, $activeHabits, $sevenDaysAgo, $today);

        return Inertia::render('Dashboard', [
            'greeting' => [
                'message' => $greetingMessage,
                'date_formatted' => $dateFormatted,
            ],
            'habits' => [
                'summary' => [
                    'total_today' => $totalToday,
                    'completed_today' => $completedToday,
                    'progress_percent' => $progressPercent,
                ],
                'items' => $habitsData,
            ],
            'mood' => [
                'has_logged_today' => $hasLoggedMoodToday,
                'today_logs' => $todayMoodLogs->map(fn (MoodLog $m) => [
                    'id' => $m->id,
                    'mood_score' => $m->mood_score,
                    'emotions' => $m->emotions,
                    'note' => $m->note,
                ]),
                'available_emotions' => MoodLog::AVAILABLE_EMOTIONS,
            ],
            'journal' => [
                'latest_draft' => $latestDraft ? [
                    'id' => $latestDraft->id,
                    'title' => $latestDraft->title,
                    'excerpt' => Str::limit(strip_tags($latestDraft->content), 120),
                    'entry_date' => $latestDraft->entry_date->toDateString(),
                    'updated_at' => $latestDraft->updated_at->toIso8601String(),
                ] : null,
                'total_published' => $totalPublishedJournals,
            ],
            'mini_insights' => [
                'weekly_mood_avg' => $weeklyMoodAvg,
                'weekly_habit_rate' => $weeklyHabitRate,
            ],
        ]);
    }

    private function getGreetingMessage(int $hour, string $name): string
    {
        if ($hour >= 5 && $hour < 12) {
            $timeGreeting = 'Selamat Pagi';
        } elseif ($hour >= 12 && $hour < 15) {
            $timeGreeting = 'Selamat Siang';
        } elseif ($hour >= 15 && $hour < 19) {
            $timeGreeting = 'Selamat Sore';
        } else {
            $timeGreeting = 'Selamat Malam';
        }

        return "{$timeGreeting}, {$name}";
    }

    /**
     * @param  Collection<int, Habit>  $habits
     */
    private function calculateWeeklyHabitCompletionRate(int $userId, $habits, string $startDate, string $endDate): int
    {
        if ($habits->isEmpty()) {
            return 0;
        }

        $habitIds = $habits->pluck('id');

        $completedLogsCount = HabitLog::whereIn('habit_id', $habitIds)
            ->where('user_id', $userId)
            ->whereDate('log_date', '>=', $startDate)
            ->whereDate('log_date', '<=', $endDate)
            ->where('status', 'completed')
            ->count();

        // Estimasi denominator: habit harian aktif * 7 hari
        $expectedTotal = 0;
        $periodDays = Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1;

        foreach ($habits as $habit) {
            if ($habit->frequency_type === 'daily') {
                $expectedTotal += $periodDays;
            } elseif ($habit->frequency_type === 'weekly_target') {
                $expectedTotal += min($habit->target_value, 7);
            } elseif ($habit->frequency_type === 'specific_days') {
                $daysCount = count($habit->scheduled_days ?? []);
                $expectedTotal += max($daysCount, 1);
            }
        }

        if ($expectedTotal === 0) {
            return 0;
        }

        return (int) min(100, round(($completedLogsCount / $expectedTotal) * 100));
    }
}
