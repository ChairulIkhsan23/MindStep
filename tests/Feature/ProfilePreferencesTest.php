<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ProfilePreferencesTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_profile_preferences(): void
    {
        $user = User::factory()->create([
            'timezone' => 'UTC',
            'theme' => 'system',
            'ai_consent' => false,
        ]);

        $response = $this->actingAs($user)->patch('/profile', [
            'name' => 'Updated Name',
            'email' => $user->email,
            'timezone' => 'Asia/Jakarta',
            'theme' => 'dark',
            'ai_consent' => true,
        ]);

        $response->assertRedirect('/profile');

        $user->refresh();
        $this->assertEquals('Updated Name', $user->name);
        $this->assertEquals('Asia/Jakarta', $user->timezone);
        $this->assertEquals('dark', $user->theme);
        $this->assertTrue($user->ai_consent);
    }

    public function test_email_change_unverifies_user(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($user)->patch('/profile', [
            'name' => $user->name,
            'email' => 'newemail@example.com',
            'timezone' => 'UTC',
            'theme' => 'light',
            'ai_consent' => false,
        ]);

        $response->assertRedirect('/profile');
        $this->assertNull($user->fresh()->email_verified_at);
        $this->assertEquals('newemail@example.com', $user->fresh()->email);
    }

    public function test_user_can_destroy_other_browser_sessions(): void
    {
        $user = User::factory()->create();

        // Create sessions in DB
        DB::table('sessions')->insert([
            [
                'id' => 'other-session-id',
                'user_id' => $user->id,
                'ip_address' => '192.168.1.1',
                'user_agent' => 'Other Browser',
                'payload' => 'payload2',
                'last_activity' => time(),
            ],
        ]);

        $response = $this->actingAs($user)->delete('/profile/sessions', [
            'password' => 'password',
        ]);

        $response->assertRedirect('/profile');

        $this->assertDatabaseMissing('sessions', [
            'id' => 'other-session-id',
        ]);
    }

    public function test_destroy_other_sessions_requires_valid_current_password(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->delete('/profile/sessions', [
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('password');
    }
}
