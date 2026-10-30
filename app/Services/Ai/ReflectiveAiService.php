<?php

namespace App\Services\Ai;

use App\Models\Journal;
use App\Models\User;
use Carbon\Carbon;
use InvalidArgumentException;

class ReflectiveAiService
{
    public function __construct(
        protected AiManager $aiManager
    ) {}

    /**
     * @return array{result: string, disclaimer: string, provider: string}
     */
    public function polish(User $user, string $content, ?string $context = null): array
    {
        $sanitizedContent = $this->sanitizePii($content, $user);
        $providerName = config('ai.default', 'mock');
        $driver = $this->aiManager->driver($providerName);

        $result = $driver->polish($sanitizedContent, $context);

        return [
            'result' => $result,
            'disclaimer' => config('ai.disclaimer'),
            'provider' => $providerName,
        ];
    }

    /**
     * @return array{questions: array<int, string>, disclaimer: string, provider: string}
     */
    public function deepeningPrompts(User $user, string $content, ?string $context = null): array
    {
        $sanitizedContent = $this->sanitizePii($content, $user);
        $providerName = config('ai.default', 'mock');
        $driver = $this->aiManager->driver($providerName);

        $questions = $driver->deepeningPrompts($sanitizedContent, $context);

        return [
            'questions' => $questions,
            'disclaimer' => config('ai.disclaimer'),
            'provider' => $providerName,
        ];
    }

    /**
     * @return array{summary: string, entries_count: int, disclaimer: string, provider: string}
     */
    public function periodicSummary(User $user, string $startDate, string $endDate): array
    {
        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        if ($start->gt($end)) {
            throw new InvalidArgumentException('Tanggal mulai tidak boleh lebih besar dari tanggal selesai.');
        }

        $journals = Journal::where('user_id', $user->id)
            ->where('is_draft', false)
            ->whereBetween('entry_date', [$start->toDateString(), $end->toDateString()])
            ->orderBy('entry_date')
            ->get();

        if ($journals->isEmpty()) {
            throw new InvalidArgumentException('Tidak ada entri jurnal terpublikasi dalam rentang tanggal yang dipilih.');
        }

        $entries = $journals->map(fn (Journal $j) => [
            'date' => $j->entry_date?->toDateString() ?? '',
            'title' => $this->sanitizePii($j->title ?? '', $user),
            'content' => $this->sanitizePii($j->content, $user),
            'mood_score' => $j->mood_score,
        ])->all();

        $providerName = config('ai.default', 'mock');
        $driver = $this->aiManager->driver($providerName);

        $summary = $driver->periodicSummary($entries);

        return [
            'summary' => $summary,
            'entries_count' => count($entries),
            'disclaimer' => config('ai.disclaimer'),
            'provider' => $providerName,
        ];
    }

    /**
     * Strip Personally Identifiable Information (PII) before sending payload.
     */
    protected function sanitizePii(string $text, User $user): string
    {
        $replacements = [
            $user->email => '[EMAIL]',
        ];

        if (! empty($user->name)) {
            $replacements[$user->name] = '[PENGGUNA]';
        }

        return str_ireplace(array_keys($replacements), array_values($replacements), $text);
    }
}
