<?php

namespace App\Services\Ai;

class PromptConfig
{
    /**
     * @param  array<string, mixed>  $parameters
     * @param  array<string>  $requiredVariables
     * @param  array<string>  $optionalVariables
     * @param  array<string, mixed>  $output
     * @param  array<string>  $constraints
     */
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        public readonly string $version,
        public readonly string $description,
        public readonly string $purpose,
        public readonly array $parameters,
        public readonly array $requiredVariables,
        public readonly array $optionalVariables,
        public readonly array $output,
        public readonly array $constraints,
        public readonly string $content
    ) {}

    public function getTemperature(float $default = 0.7): float
    {
        return isset($this->parameters['temperature'])
            ? (float) $this->parameters['temperature']
            : $default;
    }

    public function getMaxTokens(?int $default = null): ?int
    {
        return isset($this->parameters['max_tokens'])
            ? (int) $this->parameters['max_tokens']
            : $default;
    }
}
