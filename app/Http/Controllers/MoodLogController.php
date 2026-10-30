<?php

namespace App\Http\Controllers;

use App\Http\Requests\Mood\StoreMoodLogRequest;
use App\Http\Requests\Mood\UpdateMoodLogRequest;
use App\Models\MoodLog;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MoodLogController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $timezone = $user->timezone ?? config('app.timezone', 'UTC');
        $today = Carbon::now($timezone)->toDateString();

        $logs = MoodLog::with('journal:id,title')
            ->where('user_id', $user->id)
            ->orderBy('log_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $todayLogs = $logs->where('log_date', Carbon::parse($today))->values();

        // 7 days weekly stats
        $sevenDaysAgo = Carbon::now($timezone)->subDays(6)->toDateString();
        $recentWeekLogs = $logs->filter(function (MoodLog $log) use ($sevenDaysAgo, $today) {
            $date = $log->log_date->toDateString();

            return $date >= $sevenDaysAgo && $date <= $today;
        });

        $weeklyAverage = $recentWeekLogs->isNotEmpty()
            ? round($recentWeekLogs->avg('mood_score'), 1)
            : null;

        // Dominant emotion
        $allEmotions = $recentWeekLogs->pluck('emotions')->flatten()->filter();
        $dominantEmotion = $allEmotions->isNotEmpty()
            ? $allEmotions->countBy()->sortDesc()->keys()->first()
            : null;

        return Inertia::render('Moods/Index', [
            'today_logs' => $todayLogs->map(fn (MoodLog $log) => $this->transformLog($log)),
            'recent_logs' => $logs->take(30)->values()->map(fn (MoodLog $log) => $this->transformLog($log)),
            'stats' => [
                'weekly_average' => $weeklyAverage,
                'dominant_emotion' => $dominantEmotion,
                'total_checkins' => $logs->count(),
            ],
            'available_emotions' => MoodLog::AVAILABLE_EMOTIONS,
        ]);
    }

    public function store(StoreMoodLogRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $request->user()->moodLogs()->create($validated);

        return back()->with('success', 'Catatan mood berhasil disimpan.');
    }

    public function update(UpdateMoodLogRequest $request, MoodLog $moodLog): RedirectResponse
    {
        Gate::authorize('update', $moodLog);

        $moodLog->update($request->validated());

        return back()->with('success', 'Catatan mood berhasil diperbarui.');
    }

    public function destroy(Request $request, MoodLog $moodLog): RedirectResponse
    {
        Gate::authorize('delete', $moodLog);

        $moodLog->delete();

        return back()->with('success', 'Catatan mood berhasil dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformLog(MoodLog $log): array
    {
        return [
            'id' => $log->id,
            'log_date' => $log->log_date->toDateString(),
            'mood_score' => $log->mood_score,
            'emotions' => $log->emotions,
            'note' => $log->note,
            'journal_id' => $log->journal_id,
            'journal_title' => $log->journal?->title,
            'created_at' => $log->created_at?->toIso8601String(),
        ];
    }
}
