<?php

namespace App\Http\Requests\Ai;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PolishDraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->ai_consent;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'min:5', 'max:10000'],
            'context' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'content.required' => 'Konten draf jurnal wajib diisi.',
            'content.min' => 'Konten draf minimal 5 karakter.',
            'content.max' => 'Konten draf maksimal 10.000 karakter.',
        ];
    }
}
