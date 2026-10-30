<?php

namespace App\Http\Controllers;

use App\Http\Requests\Habit\StoreHabitRequest;
use App\Http\Requests\Habit\UpdateHabitRequest;
use App\Models\Habit;
use App\Services\StreakCalculationService;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HabitController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected StreakCalculationService $streakService
    ) {}

    /**
     * Display a listing of user habits.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $userTimezone = $user->timezone ?? 'UTC';

        $filterDate = $request->query('date')
            ? Carbon::parse($request->query('date'), $userTimezone)->toDateString()
            : Carbon::now($userTimezone)->toDateString();

        $showArchived = $request->boolean('archived');

        $habitsQuery = $user->habits()
            ->where('is_archived', $showArchived)
            ->with(['logs' => function ($query) use ($filterDate) {
                $query->whereDate('log_date', $filterDate);
            }])
            ->orderBy('created_at', 'desc');

        $habits = $habitsQuery->get()->map(function (Habit $habit) use ($filterDate) {
            $todayLog = $habit->logs->first();
            $stats = $this->streakService->calculateForHabit($habit, Carbon::parse($filterDate));

            return [
                'id' => $habit->id,
                'name' => $habit->name,
                'description' => $habit->description,
                'measurement_type' => $habit->measurement_type,
                'target_value' => (float) $habit->target_value,
                'unit' => $habit->unit,
                'frequency_type' => $habit->frequency_type,
                'scheduled_days' => $habit->scheduled_days,
                'weekly_target_days' => $habit->weekly_target_days,
                'start_date' => $habit->start_date->toDateString(),
                'end_date' => $habit->end_date?->toDateString(),
                'color' => $habit->color,
                'icon' => $habit->icon,
                'is_archived' => $habit->is_archived,
                'today_log' => $todayLog ? [
                    'id' => $todayLog->id,
                    'actual_value' => (float) $todayLog->actual_value,
                    'status' => $todayLog->status,
                    'notes' => $todayLog->notes,
                ] : null,
                'stats' => $stats,
            ];
        });

        $archivedCount = $user->habits()->where('is_archived', true)->count();
        $remainingFreezes = $this->streakService->getRemainingFreezeCredits($user, Carbon::parse($filterDate));

        return Inertia::render('Habits/Index', [
            'habits' => $habits,
            'archived_count' => $archivedCount,
            'freeze_credits_remaining' => $remainingFreezes,
            'filter_date' => $filterDate,
            'showing_archived' => $showArchived,
        ]);
    }

    /**
     * Store a newly created habit.
     */
    public function store(StoreHabitRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->habits()->create($request->validated());

        return redirect()->route('habits.index')
            ->with('status', 'Kebiasaan baru berhasil ditambahkan.');
    }

    /**
     * Update the specified habit.
     */
    public function update(UpdateHabitRequest $request, Habit $habit): RedirectResponse
    {
        $habit->update($request->validated());

        return back()->with('status', 'Konfigurasi kebiasaan berhasil diperbarui.');
    }

    /**
     * Remove the specified habit from storage.
     */
    public function destroy(Request $request, Habit $habit): RedirectResponse
    {
        $this->authorize('delete', $habit);

        $habit->delete();

        return back()->with('status', 'Kebiasaan dan seluruh riwayatnya berhasil dihapus.');
    }

    /**
     * Archive the specified habit.
     */
    public function archive(Request $request, Habit $habit): RedirectResponse
    {
        $this->authorize('update', $habit);

        $habit->update(['is_archived' => true]);

        return back()->with('status', 'Kebiasaan berhasil diarsipkan.');
    }

    /**
     * Unarchive the specified habit.
     */
    public function unarchive(Request $request, Habit $habit): RedirectResponse
    {
        $this->authorize('update', $habit);

        $habit->update(['is_archived' => false]);

        return back()->with('status', 'Kebiasaan berhasil diaktifkan kembali.');
    }
}
