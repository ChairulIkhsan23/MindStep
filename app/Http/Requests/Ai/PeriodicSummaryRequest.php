<?php

namespace App\Http\Requests\Ai;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PeriodicSummaryRequest extends FormRequest
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
            'start_date' => ['required', 'date_format:Y-m-d'],
            'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'start_date.required' => 'Tanggal awal periode wajib diisi.',
            'start_date.date_format' => 'Format tanggal awal harus YYYY-MM-DD.',
            'end_date.required' => 'Tanggal akhir periode wajib diisi.',
            'end_date.date_format' => 'Format tanggal akhir harus YYYY-MM-DD.',
            'end_date.after_or_equal' => 'Tanggal akhir tidak boleh mendahului tanggal awal.',
        ];
    }
}
