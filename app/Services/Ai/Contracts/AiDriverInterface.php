<?php

namespace App\Services\Ai\Contracts;

interface AiDriverInterface
{
    /**
     * Polish raw draft points into coherent prose without altering facts.
     */
    public function polish(string $content, ?string $context = null): string;

    /**
     * Generate 2-3 deepening reflection questions based on current journal content.
     *
     * @return array<int, string>
     */
    public function deepeningPrompts(string $content, ?string $context = null): array;

    /**
     * Summarize recurrent emotional themes and mental patterns across journal entries.
     *
     * @param  array<int, array{date: string, title: string|null, content: string, mood_score: int|null}>  $entries
     */
    public function periodicSummary(array $entries): string;
}
