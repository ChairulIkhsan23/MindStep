<?php

namespace App\Services\Ai\Drivers;

use App\Services\Ai\Contracts\AiDriverInterface;
use App\Services\Ai\PromptBuilder;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiAiDriver implements AiDriverInterface
{
    public function __construct(
        protected ?string $apiKey,
        protected string $model = 'gemini-3.8-flash',
        protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
    ) {}

    public function polish(string $content, ?string $context = null): string
    {
        $prompt = PromptBuilder::polish($content, $context);

        return $this->callGemini($prompt);
    }

    public function deepeningPrompts(string $content, ?string $context = null): array
    {
        $prompt = PromptBuilder::deepeningPrompts($content, $context);

        $rawResponse = $this->callGemini($prompt);
        $decoded = json_decode($this->stripCodeBlocks($rawResponse), true);

        if (is_array($decoded) && count($decoded) > 0) {
            return array_slice($decoded, 0, 3);
        }

        return [
            'Apa hal terpenting yang bisa kamu pelajari dari pengalaman ini?',
            'Bagaimana perasaan ini memengaruhi caramu memandang hari esok?',
        ];
    }

    public function periodicSummary(array $entries): string
    {
        $prompt = PromptBuilder::periodicSummary($entries);

        return $this->callGemini($prompt);
    }

    protected function callGemini(string $prompt): string
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('API Key Google Gemini belum dikonfigurasi di file .env.');
        }

        $url = "{$this->baseUrl}/models/{$this->model}:generateContent?key={$this->apiKey}";

        $response = Http::timeout(30)->post($url, [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                    ],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0.7,
            ],
        ]);

        if (! $response->successful()) {
            throw new RuntimeException("Gagal menghubungi Google Gemini API: {$response->body()}");
        }

        $data = $response->json();
        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (! $text) {
            throw new RuntimeException('Respons dari Google Gemini API kosong atau tidak sesuai.');
        }

        return trim($text);
    }

    protected function stripCodeBlocks(string $text): string
    {
        return preg_replace('/^```(?:json)?\s*|\s*```$/m', '', trim($text));
    }
}
