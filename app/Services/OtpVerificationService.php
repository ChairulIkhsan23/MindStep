<?php

namespace App\Services;

use App\Models\EmailVerification;
use App\Models\User;
use App\Notifications\SendEmailOtpNotification;
use Illuminate\Validation\ValidationException;

class OtpVerificationService
{
    public const int EXPIRATION_MINUTES = 15;

    public const int COOLDOWN_SECONDS = 60;

    public const int MAX_ATTEMPTS = 5;

    /**
     * Send new OTP to user.
     *
     * @throws ValidationException
     */
    public function sendOtp(User $user, ?string $email = null): EmailVerification
    {
        $targetEmail = $email ?? $user->email;

        $cooldownRemaining = $this->canResendInSeconds($user, $targetEmail);
        if ($cooldownRemaining > 0) {
            throw ValidationException::withMessages([
                'otp' => "Harap tunggu {$cooldownRemaining} detik sebelum meminta kode baru.",
            ]);
        }

        // Generate 6-digit numeric OTP
        $otp = (string) random_int(100000, 999999);

        // Remove older pending verifications for this user & email
        EmailVerification::where('user_id', $user->id)
            ->where('email', $targetEmail)
            ->delete();

        $verification = EmailVerification::create([
            'user_id' => $user->id,
            'email' => $targetEmail,
            'otp_hash' => hash('sha256', $otp),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(self::EXPIRATION_MINUTES),
        ]);

        $user->notify(new SendEmailOtpNotification($otp));

        return $verification;
    }

    /**
     * Verify submitted OTP.
     *
     * @throws ValidationException
     */
    public function verifyOtp(User $user, string $code): bool
    {
        $record = EmailVerification::where('user_id', $user->id)
            ->where('email', $user->email)
            ->latest()
            ->first();

        if (! $record) {
            throw ValidationException::withMessages([
                'otp' => 'Kode verifikasi tidak ditemukan. Silakan minta kode baru.',
            ]);
        }

        if ($record->expires_at->isPast()) {
            $record->delete();
            throw ValidationException::withMessages([
                'otp' => 'Kode verifikasi telah kedaluwarsa. Silakan minta kode baru.',
            ]);
        }

        if ($record->attempts >= self::MAX_ATTEMPTS) {
            $record->delete();
            throw ValidationException::withMessages([
                'otp' => 'Terlalu banyak percobaan salah. Silakan minta kode verifikasi baru.',
            ]);
        }

        $inputHash = hash('sha256', trim($code));
        if (! hash_equals($record->otp_hash, $inputHash)) {
            $record->increment('attempts');
            $remaining = self::MAX_ATTEMPTS - $record->attempts;

            if ($remaining <= 0) {
                $record->delete();
                throw ValidationException::withMessages([
                    'otp' => 'Batas percobaan habis. Silakan minta kode verifikasi baru.',
                ]);
            }

            throw ValidationException::withMessages([
                'otp' => "Kode verifikasi salah. Sisa {$remaining} percobaan.",
            ]);
        }

        // Success: update user and purge verifications
        $user->email_verified_at = now();
        $user->save();

        EmailVerification::where('user_id', $user->id)->delete();

        return true;
    }

    /**
     * Check cooldown remaining in seconds.
     */
    public function canResendInSeconds(User $user, ?string $email = null): int
    {
        $targetEmail = $email ?? $user->email;

        $latest = EmailVerification::where('user_id', $user->id)
            ->where('email', $targetEmail)
            ->latest()
            ->first();

        if (! $latest) {
            return 0;
        }

        $elapsedSeconds = (int) $latest->created_at->diffInSeconds(now());
        $remaining = self::COOLDOWN_SECONDS - $elapsedSeconds;

        return max(0, $remaining);
    }
}
