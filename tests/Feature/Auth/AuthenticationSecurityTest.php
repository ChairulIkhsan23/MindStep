<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\SendEmailOtpNotification;
use App\Services\OtpVerificationService;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AuthenticationSecurityTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------
    // REGISTRATION SECURITY & BOUNDARY TESTS
    // -------------------------------------------------------------

    public function test_registration_rejects_duplicate_email_case_insensitively(): void
    {
        User::factory()->create(['email' => 'member@example.com']);

        $response = $this->post('/register', [
            'name' => 'Duplicate User',
            'email' => 'MEMBER@EXAMPLE.COM',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertEquals(1, User::where('email', 'member@example.com')->count());
    }

    public function test_registration_rejects_invalid_timezone(): void
    {
        $response = $this->post('/register', [
            'name' => 'Timezone User',
            'email' => 'tz@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'timezone' => 'Invalid/Timezone_Name',
        ]);

        $response->assertSessionHasErrors('timezone');
        $this->assertDatabaseMissing('users', ['email' => 'tz@example.com']);
    }

    public function test_registration_prevents_mass_assignment_of_verified_status(): void
    {
        $response = $this->post('/register', [
            'name' => 'Hacker User',
            'email' => 'hacker@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'email_verified_at' => now()->toDateTimeString(),
            'id' => 9999,
        ]);

        $response->assertRedirect(route('login', absolute: false));
        $this->assertGuest();
        $user = User::where('email', 'hacker@example.com')->first();
        $this->assertNotNull($user);
        $this->assertNull($user->email_verified_at);
        $this->assertNotEquals(9999, $user->id);
    }

    // -------------------------------------------------------------
    // LOGIN SECURITY & RATE LIMITING
    // -------------------------------------------------------------

    public function test_login_supports_case_insensitive_email(): void
    {
        $user = User::factory()->create([
            'email' => 'person@example.com',
            'password' => Hash::make('Secret123!'),
        ]);

        $response = $this->post('/login', [
            'email' => 'PERSON@EXAMPLE.COM',
            'password' => 'Secret123!',
        ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticatedAs($user);
    }

    public function test_login_rate_limiting_locks_out_after_five_failed_attempts(): void
    {
        Event::fake([Lockout::class]);

        $user = User::factory()->create(['email' => 'target@example.com']);

        for ($i = 0; $i < 5; $i++) {
            $response = $this->post('/login', [
                'email' => 'target@example.com',
                'password' => 'wrong-pass-'.$i,
            ]);
            $response->assertSessionHasErrors('email');
            $this->assertGuest();
        }

        // 6th attempt must trigger Lockout and be throttled
        $sixthResponse = $this->post('/login', [
            'email' => 'target@example.com',
            'password' => 'wrong-pass-6',
        ]);

        $sixthResponse->assertSessionHasErrors('email');
        Event::assertDispatched(Lockout::class);
    }

    public function test_session_id_regenerates_upon_successful_login(): void
    {
        $user = User::factory()->create([
            'email' => 'session@example.com',
            'password' => Hash::make('ValidPassword123!'),
        ]);

        $this->get('/login');
        $initialSessionId = session()->getId();

        $response = $this->post('/login', [
            'email' => 'session@example.com',
            'password' => 'ValidPassword123!',
        ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticatedAs($user);
        $this->assertNotEquals($initialSessionId, session()->getId());
    }

    // -------------------------------------------------------------
    // PROTECTED ROUTES & LOGOUT LIFECYCLE
    // -------------------------------------------------------------

    public function test_unauthenticated_guests_cannot_access_protected_endpoints(): void
    {
        $endpoints = [
            ['GET', '/dashboard'],
            ['GET', '/profile'],
            ['PATCH', '/profile'],
            ['DELETE', '/profile'],
            ['DELETE', '/profile/sessions'],
            ['GET', '/verify-email'],
            ['POST', '/verify-email/otp'],
            ['POST', '/verify-email/resend'],
        ];

        foreach ($endpoints as [$method, $uri]) {
            $response = $this->call($method, $uri);
            $response->assertRedirect('/login');
        }
    }

    public function test_logout_completely_revokes_access(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');
        $response->assertRedirect('/');
        $this->assertGuest();

        // Following request to protected route is rejected
        $protected = $this->get('/dashboard');
        $protected->assertRedirect('/login');
    }

    // -------------------------------------------------------------
    // PASSWORD RESET INTEGRITY
    // -------------------------------------------------------------

    public function test_password_reset_token_cannot_be_reused(): void
    {
        Notification::fake();

        $user = User::factory()->create(['email' => 'resetme@example.com']);

        $this->post('/forgot-password', ['email' => 'resetme@example.com']);

        $token = null;
        Notification::assertSentTo($user, ResetPassword::class, function ($n) use (&$token) {
            $token = $n->token;

            return true;
        });

        // 1st reset: success
        $res1 = $this->post('/reset-password', [
            'token' => $token,
            'email' => 'resetme@example.com',
            'password' => 'BrandNewPassword123!',
            'password_confirmation' => 'BrandNewPassword123!',
        ]);
        $res1->assertRedirect(route('login'));

        // 2nd reset with same token: rejected
        $res2 = $this->post('/reset-password', [
            'token' => $token,
            'email' => 'resetme@example.com',
            'password' => 'AnotherPassword123!',
            'password_confirmation' => 'AnotherPassword123!',
        ]);
        $res2->assertSessionHasErrors('email');

        // Old password fails, new password works
        $this->assertFalse(Hash::check('password', $user->fresh()->password));
        $this->assertTrue(Hash::check('BrandNewPassword123!', $user->fresh()->password));
    }

    // -------------------------------------------------------------
    // EMAIL VERIFICATION OTP DEFENSE & USER ISOLATION
    // -------------------------------------------------------------

    public function test_user_a_cannot_verify_using_user_b_otp(): void
    {
        Notification::fake();

        $userA = User::factory()->unverified()->create(['email' => 'userA@example.com']);
        $userB = User::factory()->unverified()->create(['email' => 'userB@example.com']);

        /** @var OtpVerificationService $otpService */
        $otpService = app(OtpVerificationService::class);
        $otpService->sendOtp($userB);

        $otpForB = null;
        Notification::assertSentTo($userB, SendEmailOtpNotification::class, function ($n) use (&$otpForB) {
            $otpForB = $n->otp;

            return true;
        });

        // User A tries to verify with User B's OTP code
        $response = $this->actingAs($userA)->post('/verify-email/otp', [
            'otp' => $otpForB,
        ]);

        $response->assertSessionHasErrors('otp');
        $this->assertFalse($userA->fresh()->hasVerifiedEmail());
        $this->assertFalse($userB->fresh()->hasVerifiedEmail());
    }

    public function test_otp_is_destroyed_after_five_failed_attempts(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();

        /** @var OtpVerificationService $otpService */
        $otpService = app(OtpVerificationService::class);
        $verification = $otpService->sendOtp($user);

        // Send 5 incorrect codes
        for ($i = 0; $i < 5; $i++) {
            $this->actingAs($user)->post('/verify-email/otp', ['otp' => '999999']);
        }

        // Record should be burned
        $this->assertDatabaseMissing('email_verifications', ['id' => $verification->id]);
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    // -------------------------------------------------------------
    // MULTI-TENANT ISOLATION: SESSIONS & PROFILE
    // -------------------------------------------------------------

    public function test_user_a_destroy_sessions_does_not_affect_user_b_sessions(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        DB::table('sessions')->insert([
            [
                'id' => 'session-user-a-1',
                'user_id' => $userA->id,
                'ip_address' => '1.1.1.1',
                'user_agent' => 'Browser A',
                'payload' => 'p1',
                'last_activity' => time(),
            ],
            [
                'id' => 'session-user-b-1',
                'user_id' => $userB->id,
                'ip_address' => '2.2.2.2',
                'user_agent' => 'Browser B',
                'payload' => 'p2',
                'last_activity' => time(),
            ],
        ]);

        $response = $this->actingAs($userA)->delete('/profile/sessions', [
            'password' => 'password',
        ]);

        $response->assertRedirect('/profile');

        // User A session deleted
        $this->assertDatabaseMissing('sessions', ['id' => 'session-user-a-1']);
        // User B session remains intact
        $this->assertDatabaseHas('sessions', ['id' => 'session-user-b-1']);
    }

    public function test_profile_update_ignores_unfillable_parameters(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $originalVerifiedAt = $user->email_verified_at;

        $response = $this->actingAs($user)->patch('/profile', [
            'name' => 'Legit Name',
            'email' => $user->email,
            'id' => 7777,
            'is_admin' => true,
        ]);

        $response->assertRedirect('/profile');
        $user->refresh();

        $this->assertEquals('Legit Name', $user->name);
        $this->assertNotEquals(7777, $user->id);
        $this->assertEquals($originalVerifiedAt->timestamp, $user->email_verified_at->timestamp);
    }
}
