<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DataExportController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\HabitLogController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\MoodLogController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/habits', [HabitController::class, 'index'])->name('habits.index');
    Route::post('/habits', [HabitController::class, 'store'])->name('habits.store');
    Route::put('/habits/{habit}', [HabitController::class, 'update'])->name('habits.update');
    Route::delete('/habits/{habit}', [HabitController::class, 'destroy'])->name('habits.destroy');
    Route::post('/habits/{habit}/archive', [HabitController::class, 'archive'])->name('habits.archive');
    Route::post('/habits/{habit}/unarchive', [HabitController::class, 'unarchive'])->name('habits.unarchive');

    Route::post('/habits/{habit}/logs', [HabitLogController::class, 'store'])->name('habits.logs.store');
    Route::delete('/habits/{habit}/logs/{date}', [HabitLogController::class, 'destroy'])->name('habits.logs.destroy');

    Route::get('/moods', [MoodLogController::class, 'index'])->name('moods.index');
    Route::post('/moods', [MoodLogController::class, 'store'])->name('moods.store');
    Route::put('/moods/{moodLog}', [MoodLogController::class, 'update'])->name('moods.update');
    Route::delete('/moods/{moodLog}', [MoodLogController::class, 'destroy'])->name('moods.destroy');

    Route::resource('journals', JournalController::class);

    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');

    Route::get('/export/json', [DataExportController::class, 'exportJson'])->name('export.json');
    Route::get('/export/csv', [DataExportController::class, 'exportCsv'])->name('export.csv');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::delete('/profile/sessions', [ProfileController::class, 'destroyOtherSessions'])->name('profile.sessions.destroy');
});

require __DIR__.'/auth.php';
