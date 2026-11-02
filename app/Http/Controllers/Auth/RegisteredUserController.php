<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'timezone' => ['nullable', 'string', 'timezone:all'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'timezone' => $request->input('timezone', 'UTC'),
            'theme' => 'system',
            'ai_consent' => false,
        ]);

        event(new Registered($user));

        // Create initial default habit
        $user->habits()->create([
            'name' => 'Minum Air Putih Cukup',
            'description' => 'Target hidrasi sehat harian untuk konsistensi tubuh segar.',
            'measurement_type' => 'quantitative',
            'target_value' => 2000,
            'unit' => 'ml',
            'frequency_type' => 'daily',
            'start_date' => now($user->timezone ?? 'UTC')->toDateString(),
            'color' => '#0284c7',
            'icon' => 'check',
        ]);

        return redirect()->route('login')
            ->with('status', 'Registrasi berhasil. Silakan masuk dengan akun Anda.');
    }
}
