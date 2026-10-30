<?php

namespace Database\Factories;

use App\Models\Habit;
use App\Models\HabitLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HabitLog>
 */
class HabitLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'habit_id' => Habit::factory(),
            'user_id' => User::factory(),
            'log_date' => now()->toDateString(),
            'actual_value' => 1.0,
            'status' => 'completed',
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function partial(float $value = 0.5): static
    {
        return $this->state(fn (array $attributes) => [
            'actual_value' => $value,
            'status' => 'partial',
        ]);
    }

    public function notCompleted(): static
    {
        return $this->state(fn (array $attributes) => [
            'actual_value' => 0.0,
            'status' => 'not_completed',
        ]);
    }

    public function freeze(): static
    {
        return $this->state(fn (array $attributes) => [
            'actual_value' => 0.0,
            'status' => 'freeze',
        ]);
    }

    public function restDay(): static
    {
        return $this->state(fn (array $attributes) => [
            'actual_value' => 0.0,
            'status' => 'rest_day',
        ]);
    }
}
