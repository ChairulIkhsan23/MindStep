<?php

namespace Tests\Feature\Auth;

use App\Models\EmailVerification;
use App\Models\User;
use App\Notifications\SendEmailOtpNotification;
use App\Services\OtpVerificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class EmailVerificationOtpTest extends TestCase
{
    use RefreshDatabase;

    public function test_unverified_user_accessing_dashboard_is_redirected_to_verify_email(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect('/verify-email');
    }

    public function test_verify_email_screen_can_be_rendered_and_triggers_otp_notification(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->get('/verify-email');

        $response->assertStatus(200);
        Notification::assertSentTo($user, SendEmailOtpNotification::class);

        $this->assertDatabaseHas('email_verifications', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }

    public function test_user_can_verify_email_using_valid_otp(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();

        /** @var OtpVerificationService $otpService */
        $otpService = app(OtpVerificationService::class);
        $verification = $otpService->sendOtp($user);

        // Get the sent OTP from notification
        $sentOtp = null;
        Notification::assertSentTo($user, SendEmailOtpNotification::class, function ($notification) use (&$sentOtp) {
            $sentOtp = $notification->otp;

            return true;
        });

        $this->assertNotNull($sentOtp);

        $response = $this->actingAs($user)->post('/verify-email/otp', [
            'otp' => $sentOtp,
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        $this->assertDatabaseMissing('email_verifications', [
            'id' => $verification->id,
        ]);
    }

    public function test_invalid_otp_fails_and_increments_attempts(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();

        /** @var OtpVerificationService $otpService */
        $otpService = app(OtpVerificationService::class);
        $verification = $otpService->sendOtp($user);

        $response = $this->actingAs($user)->post('/verify-email/otp', [
            'otp' => '000000',
        ]);

        $response->assertSessionHasErrors('otp');
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
        $this->assertEquals(1, $verification->fresh()->attempts);
    }

    public function test_expired_otp_is_rejected(): void
    {
        $user = User::factory()->unverified()->create();

        EmailVerification::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'otp_hash' => hash('sha256', '123456'),
            'attempts' => 0,
            'expires_at' => now()->subMinute(),
        ]);

        $response = $this->actingAs($user)->post('/verify-email/otp', [
            'otp' => '123456',
        ]);

        $response->assertSessionHasErrors('otp');
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_otp_resend_is_throttled_during_cooldown(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();

        /** @var OtpVerificationService $otpService */
        $otpService = app(OtpVerificationService::class);
        $otpService->sendOtp($user);

        // Attempt immediate resend (cooldown is 60s)
        $response = $this->actingAs($user)->post('/verify-email/resend');

        $response->assertSessionHasErrors('otp');
    }
}
