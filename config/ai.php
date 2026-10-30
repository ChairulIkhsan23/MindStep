<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default AI Provider
    |--------------------------------------------------------------------------
    |
    | Supported providers: "mock", "gemini", "openai", "claude", "router9"
    |
    */
    'default' => env('AI_PROVIDER', 'mock'),

    /*
    |--------------------------------------------------------------------------
    | Non-Clinical Safety Disclaimer
    |--------------------------------------------------------------------------
    |
    | Permanent legal disclaimer included in every AI response.
    |
    */
    'disclaimer' => 'Mindstep AI adalah alat refleksi diri, bukan pengganti saran, diagnosis, atau penanganan psikologis/medis profesional.',

    /*
    |--------------------------------------------------------------------------
    | AI Providers Configuration
    |--------------------------------------------------------------------------
    */
    'providers' => [
        'mock' => [
            'model' => 'mock-reflective-v1',
        ],

        'gemini' => [
            'api_key' => env('GEMINI_API_KEY'),
            'model' => env('GEMINI_MODEL', 'gemini-3.8-flash'),
            'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
        ],

        'openai' => [
            'api_key' => env('OPENAI_API_KEY'),
            'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
            'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),
        ],

        'claude' => [
            'api_key' => env('ANTHROPIC_API_KEY'),
            'model' => env('ANTHROPIC_MODEL', 'claude-3-5-haiku-20241022'),
            'base_url' => env('ANTHROPIC_BASE_URL', 'https://api.anthropic.com/v1'),
        ],

        'router9' => [
            'api_key' => env('ROUTER9_API_KEY', env('OPENAI_API_KEY')),
            'model' => env('ROUTER9_MODEL', 'ag/gemini-3.8-flash'),
            'base_url' => env('ROUTER9_BASE_URL', 'http://localhost:20128/v1'),
        ],
    ],
];
