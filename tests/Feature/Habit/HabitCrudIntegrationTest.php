<?php

namespace Tests\Feature\Habit;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HabitCrudIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_full_habit_crud_and_logging_lifecycle(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 5, 20, 10, 0, 0));
        $user = User::factory()->create();

        // 1. CREATE: Buat habit baru bertipe quantitative
        $createResponse = $this->actingAs($user)->post(route('habits.store'), [
            'name' => 'Minum Air Mineral',
            'description' => 'Target minum harian untuk hidrasi',
            'measurement_type' => 'quantitative',
            'target_value' => 2000,
            'unit' => 'ml',
            'frequency_type' => 'daily',
            'start_date' => now()->toDateString(),
            'color' => '#0284c7',
            'icon' => 'check',
        ]);

        $createResponse->assertRedirect(route('habits.index'));
        $this->assertDatabaseHas('habits', [
            'user_id' => $user->id,
            'name' => 'Minum Air Mineral',
            'measurement_type' => 'quantitative',
            'target_value' => 2000,
            'unit' => 'ml',
            'color' => '#0284c7',
            'is_archived' => false,
        ]);

        $habit = Habit::where('user_id', $user->id)->firstOrFail();

        // 2. READ: Akses halaman /habits dan pastikan props Inertia terisi dengan benar
        $readResponse = $this->actingAs($user)->get(route('habits.index'));
        $readResponse->assertStatus(200);
        $readResponse->assertInertia(fn (Assert $page) => $page
            ->component('Habits/Index')
            ->has('habits', 1)
            ->where('habits.0.name', 'Minum Air Mineral')
            ->where('habits.0.target_value', 2000)
            ->where('freeze_credits_remaining', 2)
            ->where('showing_archived', false)
        );

        // 3. LOGGING: Catat progres sebagian (partial) dan selesai (completed)
        $today = now()->toDateString();

        // Step 1: partial log 1000 ml
        $logPartial = $this->actingAs($user)->post(route('habits.logs.store', $habit->id), [
            'log_date' => $today,
            'actual_value' => 1000,
            'status' => 'partial',
        ]);
        $logPartial->assertRedirect();
        $this->assertDatabaseHas('habit_logs', [
            'habit_id' => $habit->id,
            'log_date' => $today,
            'actual_value' => 1000,
            'status' => 'partial',
        ]);

        // Step 2: completed log 2000 ml
        $logComplete = $this->actingAs($user)->post(route('habits.logs.store', $habit->id), [
            'log_date' => $today,
            'actual_value' => 2000,
            'status' => 'completed',
        ]);
        $logComplete->assertRedirect();
        $this->assertDatabaseHas('habit_logs', [
            'habit_id' => $habit->id,
            'log_date' => $today,
            'actual_value' => 2000,
            'status' => 'completed',
        ]);

        // Step 3: hapus log untuk tanggal tersebut (toggle kembali ke 0)
        $deleteLog = $this->actingAs($user)->delete(route('habits.logs.destroy', [
            'habit' => $habit->id,
            'date' => $today,
        ]));
        $deleteLog->assertRedirect();
        $this->assertDatabaseMissing('habit_logs', [
            'habit_id' => $habit->id,
            'log_date' => $today,
        ]);

        // 4. UPDATE: Ubah habit (nama, target, warna)
        $updateResponse = $this->actingAs($user)->put(route('habits.update', $habit->id), [
            'name' => 'Minum Air Mineral 2.5L',
            'description' => 'Target hidrasi ditingkatkan',
            'measurement_type' => 'quantitative',
            'target_value' => 2500,
            'unit' => 'ml',
            'frequency_type' => 'daily',
            'start_date' => $habit->start_date->toDateString(),
            'color' => '#10b981',
            'icon' => 'check',
        ]);
        $updateResponse->assertRedirect(route('habits.index'));
        $this->assertDatabaseHas('habits', [
            'id' => $habit->id,
            'name' => 'Minum Air Mineral 2.5L',
            'target_value' => 2500,
            'color' => '#10b981',
        ]);

        // 5. ARCHIVE & UNARCHIVE: Arsipkan dan pulihkan
        $archiveRes = $this->actingAs($user)->post(route('habits.archive', $habit->id));
        $archiveRes->assertRedirect();
        $this->assertTrue($habit->fresh()->is_archived);

        // Pastikan tidak muncul pada query aktif default tapi muncul pada filter archived
        $readArchived = $this->actingAs($user)->get(route('habits.index', ['archived' => 1]));
        $readArchived->assertInertia(fn (Assert $page) => $page
            ->where('showing_archived', true)
            ->where('archived_count', 1)
            ->has('habits', 1)
        );

        // Pulihkan (unarchive)
        $unarchiveRes = $this->actingAs($user)->post(route('habits.unarchive', $habit->id));
        $unarchiveRes->assertRedirect();
        $this->assertFalse($habit->fresh()->is_archived);

        // 6. DELETE: Hapus habit permanen
        // Buat log dummy dulu untuk verifikasi cascade delete
        HabitLog::factory()->create([
            'habit_id' => $habit->id,
            'user_id' => $user->id,
            'log_date' => $today,
            'status' => 'completed',
        ]);

        $deleteResponse = $this->actingAs($user)->delete(route('habits.destroy', $habit->id));
        $deleteResponse->assertRedirect();

        $this->assertDatabaseMissing('habits', ['id' => $habit->id]);
        $this->assertDatabaseMissing('habit_logs', ['habit_id' => $habit->id]);

        Carbon::setTestNow();
    }

    public function test_boolean_habit_and_streak_freeze_crud_flow(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 5, 20, 10, 0, 0));
        $user = User::factory()->create();

        // 1. CREATE boolean habit
        $response = $this->actingAs($user)->post(route('habits.store'), [
            'name' => 'Meditasi Pagi',
            'description' => '10 menit hening fokus nafas',
            'measurement_type' => 'boolean',
            'target_value' => 1,
            'frequency_type' => 'daily',
            'start_date' => now()->toDateString(),
            'color' => '#d97706',
            'icon' => 'check',
        ]);
        $response->assertRedirect(route('habits.index'));

        $habit = Habit::where('user_id', $user->id)->firstOrFail();

        // 2. LOG: Centang tuntas
        $logRes = $this->actingAs($user)->post(route('habits.logs.store', $habit->id), [
            'log_date' => now()->toDateString(),
            'actual_value' => 1,
            'status' => 'completed',
        ]);
        $logRes->assertRedirect();
        $this->assertDatabaseHas('habit_logs', [
            'habit_id' => $habit->id,
            'status' => 'completed',
        ]);

        // 3. LOG: Hapus log (uncheck)
        $uncheckRes = $this->actingAs($user)->delete(route('habits.logs.destroy', [
            'habit' => $habit->id,
            'date' => now()->toDateString(),
        ]));
        $uncheckRes->assertRedirect();
        $this->assertDatabaseMissing('habit_logs', [
            'habit_id' => $habit->id,
        ]);

        // 4. FREEZE: Terapkan streak freeze
        $freezeRes = $this->actingAs($user)->post(route('habits.logs.store', $habit->id), [
            'log_date' => now()->toDateString(),
            'status' => 'freeze',
            'actual_value' => 0,
        ]);
        $freezeRes->assertRedirect();
        $this->assertDatabaseHas('habit_logs', [
            'habit_id' => $habit->id,
            'status' => 'freeze',
        ]);

        // Pastikan kuota freeze berkurang menjadi 1
        $readRes = $this->actingAs($user)->get(route('habits.index'));
        $readRes->assertInertia(fn (Assert $page) => $page
            ->where('freeze_credits_remaining', 1)
            ->where('habits.0.today_log.status', 'freeze')
        );

        Carbon::setTestNow();
    }
}
