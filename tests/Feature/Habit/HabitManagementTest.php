<?php

namespace Tests\Feature\Habit;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HabitManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get('/habits');
        $response->assertRedirect('/login');
    }

    public function test_user_can_view_habits_index(): void
    {
        $user = User::factory()->create();
        Habit::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/habits');

        $response->assertStatus(200);
    }

    public function test_user_can_create_habit_with_valid_data(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/habits', [
            'name' => 'Minum Air 2 Liter',
            'description' => 'Target hidrasi sehat harian',
            'measurement_type' => 'quantitative',
            'target_value' => 8,
            'unit' => 'gelas',
            'frequency_type' => 'daily',
            'start_date' => now()->toDateString(),
            'color' => '#0284c7',
            'icon' => 'glass-water',
        ]);

        $response->assertRedirect(route('habits.index'));
        $this->assertDatabaseHas('habits', [
            'user_id' => $user->id,
            'name' => 'Minum Air 2 Liter',
            'measurement_type' => 'quantitative',
            'target_value' => 8.0,
            'unit' => 'gelas',
        ]);
    }

    public function test_habit_creation_validates_required_fields(): void
    {
        $user = User::factory()->create();

        // specific_days requires scheduled_days
        $response = $this->actingAs($user)->post('/habits', [
            'name' => 'Olahraga Gym',
            'measurement_type' => 'boolean',
            'target_value' => 1,
            'frequency_type' => 'specific_days',
            'start_date' => now()->toDateString(),
        ]);

        $response->assertSessionHasErrors('scheduled_days');
    }

    public function test_user_can_update_own_habit(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create([
            'user_id' => $user->id,
            'name' => 'Nama Lama',
        ]);

        $response = $this->actingAs($user)->put("/habits/{$habit->id}", [
            'name' => 'Nama Baru Yang Lebih Baik',
            'measurement_type' => 'boolean',
            'target_value' => 1,
            'frequency_type' => 'daily',
            'start_date' => $habit->start_date->toDateString(),
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('habits', [
            'id' => $habit->id,
            'name' => 'Nama Baru Yang Lebih Baik',
        ]);
    }

    public function test_user_cannot_update_other_user_habit(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $habitA = Habit::factory()->create(['user_id' => $userA->id]);

        $response = $this->actingAs($userB)->put("/habits/{$habitA->id}", [
            'name' => 'Mencoba Bajak Habit',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_archive_and_unarchive_habit(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create(['user_id' => $user->id, 'is_archived' => false]);

        // Archive
        $archiveRes = $this->actingAs($user)->post("/habits/{$habit->id}/archive");
        $archiveRes->assertRedirect();
        $this->assertTrue($habit->fresh()->is_archived);

        // Unarchive
        $unarchiveRes = $this->actingAs($user)->post("/habits/{$habit->id}/unarchive");
        $unarchiveRes->assertRedirect();
        $this->assertFalse($habit->fresh()->is_archived);
    }

    public function test_user_can_delete_habit_and_cascade_logs(): void
    {
        $user = User::factory()->create();
        $habit = Habit::factory()->create(['user_id' => $user->id]);
        $log = HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)->delete("/habits/{$habit->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('habits', ['id' => $habit->id]);
        $this->assertDatabaseMissing('habit_logs', ['id' => $log->id]);
    }
}
