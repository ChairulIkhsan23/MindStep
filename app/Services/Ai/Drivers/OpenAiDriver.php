<?php

namespace App\Services\Ai\Drivers;

use App\Services\Ai\Contracts\AiDriverInterface;
use App\Services\Ai\PromptBuilder;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiDriver implements AiDriverInterface
{
    public function __construct(
        protected ?string $apiKey,
        protected string $model = 'gpt-4o-mini',
        protected string $baseUrl = 'https://api.openai.com/v1'
    ) {}

    public function polish(string $content, ?string $context = null): string
    {
        $prompt = PromptBuilder::polish($content, $context);

        return $this->callOpenAi($prompt);
    }

    public function deepeningPrompts(string $content, ?string $context = null): array
    {
        $prompt = PromptBuilder::deepeningPrompts($content, $context);

        $raw = $this->callOpenAi($prompt);
        $decoded = json_decode($this->stripCodeBlocks($raw), true);

        if (is_array($decoded) && count($decoded) > 0) {
            return array_slice($decoded, 0, 3);
        }

        return [
            'Apa makna terbesar dari peristiwa ini untuk ketenangan pikiranmu?',
            'Apa langkah kecil yang dapat kamu lakukan untuk merasa lebih baik?',
        ];
    }

    public function periodicSummary(array $entries): string
    {
        $prompt = PromptBuilder::periodicSummary($entries);

        return $this->callOpenAi($prompt);
    }

    protected function callOpenAi(string $prompt): string
    {
        if (empty($this->apiKey)) {
            throw new RuntimeException('API Key OpenAI belum dikonfigurasi di file .env.');
        }

        $response = Http::withToken($this->apiKey)
            ->timeout(60)
            ->post("{$this->baseUrl}/chat/completions", [
                'model' => $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => PromptBuilder::systemPersona()],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'temperature' => 0.7,
                'stream' => false,
            ]);

        if (! $response->successful()) {
            throw new RuntimeException("Gagal menghubungi OpenAI/9router API: {$response->body()}");
        }

        $body = $response->body();
        $data = $response->json();
        $text = $data['choices'][0]['message']['content'] ?? null;

        // If provider streamed SSE chunks despite stream:false, parse them
        if (! $text && str_starts_with(trim($body), 'data:')) {
            $accumulated = '';
            $lines = explode("\n", $body);
            foreach ($lines as $line) {
                $line = trim($line);
                if (str_starts_with($line, 'data:')) {
                    $jsonStr = trim(substr($line, 5));
                    if ($jsonStr === '[DONE]') {
                        continue;
                    }
                    $chunk = json_decode($jsonStr, true);
                    $delta = $chunk['choices'][0]['delta']['content'] ?? '';
                    $accumulated .= $delta;
                }
            }
            $text = trim($accumulated);
        }

        if (! $text) {
            throw new RuntimeException('Respons dari AI API kosong.');
        }

        return trim($text);
    }

    protected function stripCodeBlocks(string $text): string
    {
        return preg_replace('/^```(?:json)?\s*|\s*```$/m', '', trim($text));
    }
}
