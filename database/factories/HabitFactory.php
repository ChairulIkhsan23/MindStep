<?php

namespace Database\Factories;

use App\Models\Habit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Habit>
 */
class HabitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'measurement_type' => 'boolean',
            'target_value' => 1.0,
            'unit' => null,
            'frequency_type' => 'daily',
            'scheduled_days' => null,
            'weekly_target_days' => null,
            'start_date' => now()->toDateString(),
            'end_date' => null,
            'color' => '#4f46e5',
            'icon' => 'check',
            'is_archived' => false,
        ];
    }

    public function quantitative(): static
    {
        return $this->state(fn (array $attributes) => [
            'measurement_type' => 'quantitative',
            'target_value' => 8.0,
            'unit' => 'gelas',
        ]);
    }

    public function duration(): static
    {
        return $this->state(fn (array $attributes) => [
            'measurement_type' => 'duration',
            'target_value' => 30.0,
            'unit' => 'menit',
        ]);
    }

    public function specificDays(array $days = [1, 3, 5]): static
    {
        return $this->state(fn (array $attributes) => [
            'frequency_type' => 'specific_days',
            'scheduled_days' => $days,
        ]);
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_archived' => true,
        ]);
    }
}
