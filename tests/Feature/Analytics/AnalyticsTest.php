<?php

namespace Tests\Feature\Analytics;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\MoodLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalyticsTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create([
            'timezone' => 'Asia/Jakarta',
            'email_verified_at' => now(),
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('analytics.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_user_can_access_analytics_index_page(): void
    {
        $response = $this->actingAs($this->user)->get(route('analytics.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Analytics/Index')
            ->has('range')
            ->has('habit_analytics')
            ->has('mood_analytics')
            ->has('journal_analytics')
            ->has('activity_heatmap')
            ->has('cross_correlation')
        );
    }

    public function test_analytics_filter_date_range_resolution(): void
    {
        // Test 30d filter
        $response30d = $this->actingAs($this->user)->get(route('analytics.index', ['range' => '30d']));
        $response30d->assertOk();
        $response30d->assertInertia(fn ($page) => $page
            ->where('range.key', '30d')
            ->has('habit_analytics.daily_trend', 30)
        );

        // Test custom range
        $today = Carbon::now('Asia/Jakarta')->toDateString();
        $fiveDaysAgo = Carbon::now('Asia/Jakarta')->subDays(4)->toDateString();

        $responseCustom = $this->actingAs($this->user)->get(route('analytics.index', [
            'range' => 'custom',
            'start_date' => $fiveDaysAgo,
            'end_date' => $today,
        ]));
        $responseCustom->assertOk();
        $responseCustom->assertInertia(fn ($page) => $page
            ->where('range.key', 'custom')
            ->where('range.start_date', $fiveDaysAgo)
            ->where('range.end_date', $today)
            ->has('habit_analytics.daily_trend', 5)
        );
    }

    public function test_analytics_computes_top_consistent_and_needs_attention_habits(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        $habitSuccess = Habit::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'Kebiasaan Sukses',
            'frequency_type' => 'daily',
            'start_date' => Carbon::now('Asia/Jakarta')->subDays(6)->toDateString(),
        ]);
        $habitFail = Habit::factory()->create([
            'user_id' => $this->user->id,
            'name' => 'Kebiasaan Sering Gagal',
            'frequency_type' => 'daily',
            'start_date' => Carbon::now('Asia/Jakarta')->subDays(6)->toDateString(),
        ]);

        // Catat log sukses untuk habitSuccess (3 hari)
        for ($i = 0; $i < 3; $i++) {
            HabitLog::factory()->create([
                'habit_id' => $habitSuccess->id,
                'user_id' => $this->user->id,
                'log_date' => Carbon::now('Asia/Jakarta')->subDays($i)->toDateString(),
                'status' => 'completed',
            ]);
        }

        $response = $this->actingAs($this->user)->get(route('analytics.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('habit_analytics.top_consistent.0.name', 'Kebiasaan Sukses')
            ->where('habit_analytics.needs_attention.0.name', 'Kebiasaan Sering Gagal')
        );
    }

    public function test_analytics_computes_mood_distribution_and_top_emotions(): void
    {
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'log_date' => $today,
            'mood_score' => 5,
            'emotions' => ['Senang', 'Bersyukur'],
        ]);
        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'log_date' => Carbon::now('Asia/Jakarta')->subDays(1)->toDateString(),
            'mood_score' => 5,
            'emotions' => ['Bersyukur', 'Tenang'],
        ]);

        $response = $this->actingAs($this->user)->get(route('analytics.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('mood_analytics.distribution.4.count', 2) // Skor 5 ada 2
            ->where('mood_analytics.top_emotions.0.emotion', 'Bersyukur')
            ->where('mood_analytics.top_emotions.0.count', 2)
        );
    }

    public function test_cross_correlation_analysis_evaluates_mood_on_successful_days(): void
    {
        $habit = Habit::factory()->create([
            'user_id' => $this->user->id,
            'frequency_type' => 'daily',
            'start_date' => Carbon::now('Asia/Jakarta')->subDays(6)->toDateString(),
        ]);

        // Hari 1: Sukses habit (mood 5)
        $day1 = Carbon::now('Asia/Jakarta')->subDays(2)->toDateString();
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $this->user->id,
            'log_date' => $day1,
            'status' => 'completed',
        ]);
        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'log_date' => $day1,
            'mood_score' => 5,
        ]);

        // Hari 2: Sukses habit (mood 5)
        $day2 = Carbon::now('Asia/Jakarta')->subDays(1)->toDateString();
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $this->user->id,
            'log_date' => $day2,
            'status' => 'completed',
        ]);
        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'log_date' => $day2,
            'mood_score' => 5,
        ]);

        // Hari 3: Gagal habit (mood 2)
        $day3 = Carbon::now('Asia/Jakarta')->toDateString();
        MoodLog::factory()->create([
            'user_id' => $this->user->id,
            'log_date' => $day3,
            'mood_score' => 2,
        ]);

        $response = $this->actingAs($this->user)->get(route('analytics.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('cross_correlation.successful_days_count', 2)
            ->where('cross_correlation.unsuccessful_days_count', 1)
            ->where('cross_correlation.avg_mood_on_successful_days', fn ($val) => (float) $val === 5.0)
            ->where('cross_correlation.avg_mood_on_unsuccessful_days', fn ($val) => (float) $val === 2.0)
            ->where('cross_correlation.insight_message', fn ($msg) => str_contains($msg, '3 poin lebih tinggi'))
        );
    }

    public function test_multi_tenant_isolation_prevents_other_users_data_in_analytics(): void
    {
        $otherUser = User::factory()->create();
        $today = Carbon::now('Asia/Jakarta')->toDateString();

        MoodLog::factory()->create([
            'user_id' => $otherUser->id,
            'log_date' => $today,
            'mood_score' => 5,
        ]);

        $response = $this->actingAs($this->user)->get(route('analytics.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->where('mood_analytics.distribution.4.count', 0)
        );
    }
}
