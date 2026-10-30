<?php

namespace Tests\Feature\Dashboard;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\Journal;
use App\Models\MoodLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create([
            'name' => 'Budi Santoso',
            'timezone' => 'Asia/Jakarta',
            'email_verified_at' => now(),
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_unverified_user_is_redirected(): void
    {
        $unverifiedUser = User::factory()->unverified()->create();

        $response = $this->actingAs($unverifiedUser)->get(route('dashboard'));
        $response->assertRedirect(route('verification.notice'));
    }

    public function test_user_can_view_dashboard_with_greeting_and_date(): void
    {
        $response = $this->actingAs($this->user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('greeting.message')
            ->has('greeting.date_formatted')
            ->where('greeting.message', fn ($msg) => str_contains($msg, 'Budi Santoso'))
        );
    }

    public function test_dashboard_filters_only_active_habits_scheduled_for_today(): void
    {
        $now = Carbon::now('Asia/Jakarta');
        $todayDayOfWeek = $now->dayOfWeek; // 0..6
        $otherDayOfWeek = ($todayDayOfWeek + 1) % 7;

        // Habit 1: Active daily -> Muncul
        Habit::factory()->create([
            'user_id' => $this->user->id,
            'frequency_type' => 'daily',
            'is_archived' => false,
        ]);

        // Habit 2: Active specific days (hari ini) -> Muncul
        Habit::factory()->create([
            'user_id' => $this->user->id,
            'frequency_type' => 'specific_days',
            'scheduled_days' => [$todayDayOfWeek],
            'is_archived' => false,
        ]);

        // Habit 3: Active specific days (bukan hari ini) -> Tidak Muncul
        Habit::factory()->create([
            'user_id' => $this->user->id,
            'frequency_type' => 'specific_days',
            'scheduled_days' => [$otherDayOfWeek],
            'is_archived' => false,
        ]);

        // Habit 4: Archived daily -> Tidak Muncul
        Habit::factory()->create([
            'user_id' => $this->user->id,
            'frequency_type' => 'daily',
            'is_archived' => true,
        ]);

        $response = $this->actingAs($this->user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('habits.items', 2)
            ->where('habits.summary.total_today', 2)
        );
    }

    public function test_dashboard_maps_today_habit_log_status_correctly(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $habit = Habit::factory()->create([
            'user_id' => $this->user->id,
            'frequency_type' => 'daily',
            'measurement_type' => 'boolean',
            'target_value' => 1,
        ]);

        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $this->user->id,
            'log_date' => $today,
            'actual_value' => 1,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($this->user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('habits.summary.completed_today', 1)
            ->where('habits.summary.progress_percent', 100)
            ->where('habits.items.0.today_log.status', 'completed')
        );
    }

    public function test_dashboard_detects_when_mood_has_not_been_logged_today(): void
    {
        $response = $this->actingAs($this->user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('mood.has_logged_today', false)
            ->has('mood.today_logs', 0)
            ->has('mood.available_emotions')
        );
    }

    public function test_dashboard_displays_today_mood_logs(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'log_date' => $today,
            'mood_score' => 4,
            'emotions' => ['Senang', 'Fokus'],
            'note' => 'Pagi produktif',
        ]);

        $response = $this->actingAs($this->user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('mood.has_logged_today', true)
            ->has('mood.today_logs', 1)
            ->where('mood.today_logs.0.mood_score', 4)
        );
    }

    public function test_dashboard_displays_latest_journal_draft_shortcut(): void
    {
        Journal::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Draf Terakhir Saya',
            'is_draft' => true,
            'updated_at' => now(),
        ]);

        Journal::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Jurnal Terbit',
            'is_draft' => false,
        ]);

        $response = $this->actingAs($this->user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('journal.latest_draft.title', 'Draf Terakhir Saya')
            ->where('journal.total_published', 1)
        );
    }

    public function test_dashboard_calculates_mini_insights_weekly_stats(): void
    {
        $now = Carbon::now('Asia/Jakarta');
        $today = $now->toDateString();
        $twoDaysAgo = $now->copy()->subDays(2)->toDateString();

        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'log_date' => $today,
            'mood_score' => 4,
        ]);
        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'log_date' => $twoDaysAgo,
            'mood_score' => 2,
        ]);

        $response = $this->actingAs($this->user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('mini_insights.weekly_mood_avg', fn ($val) => (float) $val === 3.0)
        );
    }

    public function test_multi_tenant_isolation_prevents_other_users_data_leakage(): void
    {
        $otherUser = User::factory()->create();
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        // Other user's habit, mood, and draft
        Habit::factory()->create([
            'user_id' => $otherUser->id,
            'frequency_type' => 'daily',
            'is_archived' => false,
        ]);
        MoodLog::factory()->create([
            'user_id' => $otherUser->id,
            'log_date' => $today,
            'mood_score' => 5,
        ]);
        Journal::factory()->create([
            'user_id' => $otherUser->id,
            'is_draft' => true,
        ]);

        $response = $this->actingAs($this->user)->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('habits.items', 0)
            ->where('habits.summary.total_today', 0)
            ->where('mood.has_logged_today', false)
            ->where('journal.latest_draft', null)
        );
    }
}
