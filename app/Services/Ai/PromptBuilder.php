<?php

namespace App\Services\Ai;

use App\Services\Ai\Exceptions\InvalidPromptSchemaException;
use App\Services\Ai\Exceptions\MissingPromptVariableException;
use App\Services\Ai\Exceptions\PromptNotFoundException;
use App\Services\Ai\Exceptions\PromptParseException;
use Symfony\Component\Yaml\Exception\ParseException;
use Symfony\Component\Yaml\Yaml;

class PromptBuilder
{
    /**
     * @var array<string, PromptConfig>
     */
    protected static array $cache = [];

    public static function systemPersona(): string
    {
        $config = self::load('system_persona');

        return trim($config->content);
    }

    public static function polish(string $content, ?string $context = null): string
    {
        return self::render('polish_draft', [
            'content' => $content,
            'context' => $context,
        ]);
    }

    public static function deepeningPrompts(string $content, ?string $context = null): string
    {
        return self::render('deepening_prompts', [
            'content' => $content,
            'context' => $context,
        ]);
    }

    /**
     * @param  array<int, array{date: string, title: string|null, content: string, mood_score: int|null}>  $entries
     */
    public static function periodicSummary(array $entries): string
    {
        $formatted = '';
        foreach ($entries as $e) {
            $title = $e['title'] ?? '-';
            $mood = isset($e['mood_score']) ? " (Mood: {$e['mood_score']}/5)" : '';
            $formatted .= "Tanggal: {$e['date']}{$mood}\nJudul: {$title}\nKonten: {$e['content']}\n---\n";
        }

        return self::render('periodic_summary', [
            'entries' => trim($formatted),
        ]);
    }

    /**
     * Load, validate, and return the PromptConfig for an ID.
     */
    public static function load(string $promptId): PromptConfig
    {
        // 1. Path sanitization (strict alpha-dash, no path traversal)
        if (! preg_match('/^[a-zA-Z0-9_-]+$/', $promptId)) {
            throw new PromptNotFoundException("Invalid prompt identifier [{$promptId}].");
        }

        if (isset(self::$cache[$promptId])) {
            return self::$cache[$promptId];
        }

        $baseDir = realpath(base_path('prompts'));
        $filePath = base_path("prompts/{$promptId}.yaml");

        if (! file_exists($filePath)) {
            throw new PromptNotFoundException("Berkas prompt [prompts/{$promptId}.yaml] tidak ditemukan.");
        }

        // Verify resolved path stays strictly inside base directory
        $realFilePath = realpath($filePath);
        if ($realFilePath === false || ! str_starts_with($realFilePath, $baseDir)) {
            throw new PromptNotFoundException('Akses direktori prompt tidak diizinkan.');
        }

        try {
            $parsed = Yaml::parseFile($realFilePath);
        } catch (ParseException $e) {
            throw new PromptParseException("Gagal mem-parsing berkas YAML [{$promptId}.yaml]: ".$e->getMessage(), 0, $e);
        }

        if (! is_array($parsed)) {
            throw new InvalidPromptSchemaException("Format berkas prompt [{$promptId}.yaml] bukan array terstruktur.");
        }

        // 2. Schema validation
        self::validateSchema($promptId, $parsed);

        $config = new PromptConfig(
            id: (string) $parsed['id'],
            name: (string) ($parsed['name'] ?? $promptId),
            version: (string) ($parsed['version'] ?? '1.0.0'),
            description: (string) ($parsed['description'] ?? ''),
            purpose: (string) ($parsed['purpose'] ?? 'general'),
            parameters: (array) ($parsed['parameters'] ?? []),
            requiredVariables: (array) ($parsed['variables']['required'] ?? []),
            optionalVariables: (array) ($parsed['variables']['optional'] ?? []),
            output: (array) ($parsed['output'] ?? []),
            constraints: (array) ($parsed['constraints'] ?? []),
            content: (string) $parsed['content']
        );

        self::$cache[$promptId] = $config;

        return $config;
    }

    /**
     * Render prompt template with validated variable injection.
     *
     * @param  array<string, mixed>  $variables
     */
    public static function render(string $promptId, array $variables = []): string
    {
        $config = self::load($promptId);
        $template = $config->content;

        // 1. Verify required variables
        foreach ($config->requiredVariables as $reqVar) {
            if (! array_key_exists($reqVar, $variables) || $variables[$reqVar] === null || $variables[$reqVar] === '') {
                throw new MissingPromptVariableException("Variabel wajib [{$reqVar}] belum diisi untuk prompt [{$promptId}].");
            }
        }

        // 2. Safe variable substitution with unique delimiter {{ var_name }}
        $resolved = $template;
        foreach ($variables as $key => $val) {
            if (is_scalar($val)) {
                $resolved = str_replace("{{ {$key} }}", (string) $val, $resolved);
                $resolved = str_replace("{{{$key}}}", (string) $val, $resolved);
            }
        }

        // 3. Append optional context if provided and not embedded
        if (! empty($variables['context']) && ! str_contains($template, '{{ context }}') && ! str_contains($template, '{{context}}')) {
            $resolved .= "\n\nKonteks tambahan:\n".(string) $variables['context'];
        }

        return trim($resolved);
    }

    /**
     * Clear loaded cache (useful for testing and file modifications).
     */
    public static function clearCache(): void
    {
        self::$cache = [];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    protected static function validateSchema(string $promptId, array $data): void
    {
        if (empty($data['id'])) {
            throw new InvalidPromptSchemaException("Prompt [{$promptId}.yaml] wajib memiliki atribut 'id'.");
        }

        if (! array_key_exists('content', $data) || ! is_string($data['content']) || trim($data['content']) === '') {
            throw new InvalidPromptSchemaException("Prompt [{$promptId}.yaml] wajib memiliki atribut 'content' bertipe string non-kosong.");
        }

        if (isset($data['parameters']) && ! is_array($data['parameters'])) {
            throw new InvalidPromptSchemaException("Atribut 'parameters' pada prompt [{$promptId}.yaml] harus berupa array.");
        }
    }
}
