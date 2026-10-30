<?php

namespace Tests\Feature\Habit;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HabitLoggingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_log_boolean_habit_as_completed(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'measurement_type' => 'boolean',
            'start_date' => now()->subDays(5)->toDateString(),
        ]);

        $today = now()->toDateString();

        $response = $this->actingAs($user)->post("/habits/{$habit->id}/logs", [
            'log_date' => $today,
            'actual_value' => 1,
            'notes' => 'Selesai tepat waktu',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('habit_logs', [
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => $today,
            'status' => 'completed',
            'notes' => 'Selesai tepat waktu',
        ]);
    }

    public function test_user_can_log_quantitative_habit_partial_and_completed(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->quantitative()->create([
            'user_id' => $user->id,
            'target_value' => 8,
            'start_date' => now()->subDays(5)->toDateString(),
        ]);

        $today = now()->toDateString();

        // Partial (4 dari 8)
        $this->actingAs($user)->post("/habits/{$habit->id}/logs", [
            'log_date' => $today,
            'actual_value' => 4,
        ]);
        $this->assertDatabaseHas('habit_logs', [
            'habit_id' => $habit->id,
            'status' => 'partial',
            'actual_value' => 4.0,
        ]);

        // Complete (8 dari 8)
        $this->actingAs($user)->post("/habits/{$habit->id}/logs", [
            'log_date' => $today,
            'actual_value' => 8,
        ]);
        $this->assertDatabaseHas('habit_logs', [
            'habit_id' => $habit->id,
            'status' => 'completed',
            'actual_value' => 8.0,
        ]);

        // Tetap hanya 1 baris log (idempotent)
        $this->assertEquals(1, HabitLog::where('habit_id', $habit->id)->where('log_date', $today)->count());
    }

    public function test_user_cannot_log_future_dates(): void
    {
        $user = User::factory()->create(['timezone' => 'UTC']);
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'start_date' => now()->toDateString(),
        ]);

        $tomorrow = Carbon::now('UTC')->addDay()->toDateString();

        $response = $this->actingAs($user)->post("/habits/{$habit->id}/logs", [
            'log_date' => $tomorrow,
            'actual_value' => 1,
        ]);

        $response->assertSessionHasErrors('log_date');
        $this->assertDatabaseMissing('habit_logs', ['habit_id' => $habit->id, 'log_date' => $tomorrow]);
    }

    public function test_user_cannot_log_before_habit_start_date(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'start_date' => now()->toDateString(),
        ]);

        $yesterday = now()->subDay()->toDateString();

        $response = $this->actingAs($user)->post("/habits/{$habit->id}/logs", [
            'log_date' => $yesterday,
            'actual_value' => 1,
        ]);

        $response->assertSessionHasErrors('log_date');
        $this->assertDatabaseMissing('habit_logs', ['habit_id' => $habit->id, 'log_date' => $yesterday]);
    }

    public function test_user_can_backdate_log_on_valid_past_date(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'start_date' => now()->subDays(10)->toDateString(),
        ]);

        $validPastDate = now()->subDays(3)->toDateString();

        $response = $this->actingAs($user)->post("/habits/{$habit->id}/logs", [
            'log_date' => $validPastDate,
            'actual_value' => 1,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('habit_logs', [
            'habit_id' => $habit->id,
            'log_date' => $validPastDate,
            'status' => 'completed',
        ]);
    }

    public function test_user_can_apply_streak_freeze_when_credits_available(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'start_date' => now()->subDays(5)->toDateString(),
        ]);

        $today = now()->toDateString();

        $response = $this->actingAs($user)->post("/habits/{$habit->id}/logs", [
            'log_date' => $today,
            'status' => 'freeze',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('habit_logs', [
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => $today,
            'status' => 'freeze',
        ]);
    }

    public function test_user_cannot_apply_streak_freeze_when_monthly_credits_exhausted(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'start_date' => now()->subDays(10)->toDateString(),
        ]);

        // Consume 2 freezes
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => now()->subDays(4)->toDateString(),
            'status' => 'freeze',
        ]);
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => now()->subDays(3)->toDateString(),
            'status' => 'freeze',
        ]);

        // Attempt 3rd freeze
        $response = $this->actingAs($user)->post("/habits/{$habit->id}/logs", [
            'log_date' => now()->toDateString(),
            'status' => 'freeze',
        ]);

        $response->assertSessionHasErrors('status');
        $this->assertDatabaseMissing('habit_logs', [
            'habit_id' => $habit->id,
            'log_date' => now()->toDateString(),
            'status' => 'freeze',
        ]);
    }

    public function test_user_can_delete_habit_log(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create(['user_id' => $user->id]);
        $today = now()->toDateString();

        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => $today,
        ]);

        $response = $this->actingAs($user)->delete("/habits/{$habit->id}/logs/{$today}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('habit_logs', [
            'habit_id' => $habit->id,
            'log_date' => $today,
        ]);
    }

    public function test_user_cannot_log_or_delete_other_user_habit(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $habitA = Habit::factory()->create(['user_id' => $userA->id]);
        $today = now()->toDateString();

        // User B tries to post log to Habit A
        $postRes = $this->actingAs($userB)->post("/habits/{$habitA->id}/logs", [
            'log_date' => $today,
            'actual_value' => 1,
        ]);
        $postRes->assertStatus(403);

        // User B tries to delete log of Habit A
        $deleteRes = $this->actingAs($userB)->delete("/habits/{$habitA->id}/logs/{$today}");
        $deleteRes->assertStatus(403);
    }
}
