<?php

namespace App\Http\Middleware;

use App\Services\StreakCalculationService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct(
        protected StreakCalculationService $streakService
    ) {}

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $userStreak = null;
        if ($user) {
            $userStreak = $this->streakService->calculateForUser($user);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'streak' => $userStreak,
            ],
        ];
    }
}
