<?php

namespace App\Services\Ai\Drivers;

use App\Services\Ai\Contracts\AiDriverInterface;
use App\Services\Ai\PromptBuilder;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class ClaudeAiDriver implements AiDriverInterface
{
    public function __construct(
        protected ?string $apiKey,
        protected string $model = 'claude-3-5-haiku-20241022',
        protected string $baseUrl = 'https://api.anthropic.com/v1'
    ) {}

    public function polish(string $content, ?string $context = null): string
    {
        $prompt = PromptBuilder::polish($content, $context);

        return $this->callClaude($prompt);
    }

    public function deepeningPrompts(string $content, ?string $context = null): array
    {
        $prompt = PromptBuilder::deepeningPrompts($content, $context);

        $raw = $this->callClaude($prompt);
        $decoded = json_decode($this->stripCodeBlocks($raw), true);

        if (is_array($decoded) && count($decoded) > 0) {
            return array_slice($decoded, 0, 3);
        }

        return [
            'Apa hal yang paling mengusik pikiranmu dari kejadian ini?',
            'Apa pelajaran yang ingin kamu bawa ke depan?',
        ];
    }

    public function periodicSummary(array $entries): string
    {
        $prompt = PromptBuilder::periodicSummary($entries);

        return $this->callClaude($prompt);
    }

    protected function callClaude(string $prompt): string
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('API Key Anthropic Claude belum dikonfigurasi di file .env.');
        }

        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])
            ->timeout(30)
            ->post("{$this->baseUrl}/messages", [
                'model' => $this->model,
                'max_tokens' => 1024,
                'system' => PromptBuilder::systemPersona(),
                'messages' => [
                    ['role' => 'user', 'content' => $prompt],
                ],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException("Gagal menghubungi Anthropic Claude API: {$response->body()}");
        }

        $data = $response->json();
        $text = $data['content'][0]['text'] ?? null;

        if (! $text) {
            throw new RuntimeException('Respons dari Claude API kosong.');
        }

        return trim($text);
    }

    protected function stripCodeBlocks(string $text): string
    {
        return preg_replace('/^```(?:json)?\s*|\s*```$/m', '', trim($text));
    }
}
