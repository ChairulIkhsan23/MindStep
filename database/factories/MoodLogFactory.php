<?php

namespace Database\Factories;

use App\Models\MoodLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MoodLog>
 */
class MoodLogFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'journal_id' => null,
            'log_date' => fake()->date(),
            'mood_score' => fake()->numberBetween(1, 5),
            'emotions' => fake()->randomElements(MoodLog::AVAILABLE_EMOTIONS, 2),
            'note' => fake()->sentence(),
        ];
    }

    public function veryBad(): static
    {
        return $this->state(fn () => [
            'mood_score' => 1,
            'emotions' => ['Kewalahan', 'Sedih'],
        ]);
    }

    public function bad(): static
    {
        return $this->state(fn () => [
            'mood_score' => 2,
            'emotions' => ['Cemas', 'Lelah'],
        ]);
    }

    public function neutral(): static
    {
        return $this->state(fn () => [
            'mood_score' => 3,
            'emotions' => ['Biasa', 'Bosan'],
        ]);
    }

    public function good(): static
    {
        return $this->state(fn () => [
            'mood_score' => 4,
            'emotions' => ['Tenang', 'Fokus'],
        ]);
    }

    public function great(): static
    {
        return $this->state(fn () => [
            'mood_score' => 5,
            'emotions' => ['Senang', 'Bersyukur'],
        ]);
    }
}
