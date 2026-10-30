<?php

namespace Database\Factories;

use App\Models\JournalTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<JournalTemplate>
 */
class JournalTemplateFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'slug' => Str::slug($name),
            'name' => ucfirst($name),
            'description' => fake()->sentence(),
            'prompts' => [
                'Pertanyaan 1: '.fake()->sentence(),
                'Pertanyaan 2: '.fake()->sentence(),
            ],
            'is_active' => true,
            'order' => fake()->numberBetween(1, 10),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
        ]);
    }
}
