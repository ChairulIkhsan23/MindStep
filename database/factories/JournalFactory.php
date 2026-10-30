<?php

namespace Database\Factories;

use App\Models\Journal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Journal>
 */
class JournalFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'entry_type' => 'freeform',
            'template_name' => null,
            'content' => fake()->paragraphs(3, true),
            'entry_date' => fake()->date(),
            'is_draft' => false,
            'mood_score' => fake()->numberBetween(1, 5),
            'ai_summary' => null,
        ];
    }
}
