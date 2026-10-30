<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Services\OtpVerificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationOtpController extends Controller
{
    public function __construct(
        protected OtpVerificationService $otpService
    ) {}

    /**
     * Display email OTP verification notice.
     */
    public function notice(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        // Auto-send OTP if not recently generated
        if ($this->otpService->canResendInSeconds($user) === 0) {
            $this->otpService->sendOtp($user);
        }

        return Inertia::render('Auth/VerifyEmailOtp', [
            'email' => $user->email,
            'status' => session('status'),
            'canResendInSeconds' => $this->otpService->canResendInSeconds($user),
        ]);
    }

    /**
     * Verify submitted OTP.
     */
    public function verify(VerifyOtpRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $this->otpService->verifyOtp($user, $request->validated('otp'));

        return redirect()->intended(route('dashboard', absolute: false))
            ->with('status', 'Email berhasil diverifikasi.');
    }

    /**
     * Resend verification OTP code.
     */
    public function resend(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $this->otpService->sendOtp($user);

        return back()->with('status', 'Kode verifikasi baru telah dikirim ke email Anda.');
    }
}
