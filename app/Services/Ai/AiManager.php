<?php

namespace App\Services\Ai;

use App\Services\Ai\Contracts\AiDriverInterface;
use App\Services\Ai\Drivers\ClaudeAiDriver;
use App\Services\Ai\Drivers\GeminiAiDriver;
use App\Services\Ai\Drivers\MockAiDriver;
use App\Services\Ai\Drivers\OpenAiDriver;
use InvalidArgumentException;

class AiManager
{
    /**
     * @var array<string, AiDriverInterface>
     */
    protected array $drivers = [];

    public function driver(?string $name = null): AiDriverInterface
    {
        $name = $name ?: config('ai.default', 'mock');

        if (! isset($this->drivers[$name])) {
            $this->drivers[$name] = $this->resolveDriver($name);
        }

        return $this->drivers[$name];
    }

    protected function resolveDriver(string $name): AiDriverInterface
    {
        $config = config("ai.providers.{$name}");

        return match ($name) {
            'mock' => new MockAiDriver,
            'gemini' => new GeminiAiDriver(
                apiKey: $config['api_key'] ?? null,
                model: $config['model'] ?? 'gemini-1.5-flash',
                baseUrl: $config['base_url'] ?? 'https://generativelanguage.googleapis.com/v1beta'
            ),
            'openai' => new OpenAiDriver(
                apiKey: $config['api_key'] ?? null,
                model: $config['model'] ?? 'gpt-4o-mini',
                baseUrl: $config['base_url'] ?? 'https://api.openai.com/v1'
            ),
            'claude' => new ClaudeAiDriver(
                apiKey: $config['api_key'] ?? null,
                model: $config['model'] ?? 'claude-3-5-haiku-20241022',
                baseUrl: $config['base_url'] ?? 'https://api.anthropic.com/v1'
            ),
            'router9' => new OpenAiDriver(
                apiKey: $config['api_key'] ?? null,
                model: $config['model'] ?? 'ag/gemini-3.8-flash',
                baseUrl: $config['base_url'] ?? 'http://localhost:20128/v1'
            ),
            default => throw new InvalidArgumentException("Driver AI [{$name}] tidak didukung."),
        };
    }
}
