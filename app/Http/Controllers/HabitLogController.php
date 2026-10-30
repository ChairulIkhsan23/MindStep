<?php

namespace App\Http\Controllers;

use App\Http\Requests\Habit\LogHabitRequest;
use App\Models\Habit;
use App\Models\HabitLog;
use App\Services\StreakCalculationService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class HabitLogController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected StreakCalculationService $streakService
    ) {}

    /**
     * Store or update a habit log for a given date.
     */
    public function store(LogHabitRequest $request, Habit $habit): RedirectResponse
    {
        $validated = $request->validated();
        $logDate = $validated['log_date'];
        $actualValue = (float) ($validated['actual_value'] ?? 0);
        $status = $validated['status'] ?? null;

        // Freeze status check
        if ($status === 'freeze') {
            if (! $this->streakService->canApplyFreeze($habit, $logDate)) {
                throw ValidationException::withMessages([
                    'status' => 'Kuota Streak Freeze bulan ini telah habis atau telah digunakan 2 hari berturut-turut.',
                ]);
            }
            $actualValue = 0;
        } elseif (! $status || $status === 'completed' || $status === 'partial' || $status === 'not_completed') {
            // Automatic status evaluation based on measurement type
            if ($habit->measurement_type === 'boolean') {
                $status = $actualValue >= 1.0 ? 'completed' : 'not_completed';
            } else {
                if ($actualValue >= (float) $habit->target_value) {
                    $status = 'completed';
                } elseif ($actualValue > 0) {
                    $status = 'partial';
                } else {
                    $status = 'not_completed';
                }
            }
        }

        HabitLog::updateOrCreate(
            [
                'habit_id' => $habit->id,
                'log_date' => $logDate,
            ],
            [
                'user_id' => $request->user()->id,
                'actual_value' => $actualValue,
                'status' => $status,
                'notes' => $validated['notes'] ?? null,
            ]
        );

        return back()->with('status', 'Catatan aktivitas habit berhasil disimpan.');
    }

    /**
     * Delete a habit log for a specific date.
     */
    public function destroy(Request $request, Habit $habit, string $date): RedirectResponse
    {
        $this->authorize('update', $habit);

        $habit->logs()->whereDate('log_date', $date)->delete();

        return back()->with('status', 'Catatan aktivitas berhasil dihapus.');
    }
}
