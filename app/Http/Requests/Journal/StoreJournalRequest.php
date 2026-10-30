<?php

namespace App\Http\Requests\Journal;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJournalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $timezone = $this->user()?->timezone ?? config('app.timezone', 'UTC');
        $today = Carbon::now($timezone)->toDateString();

        return [
            'title' => ['nullable', 'string', 'max:255'],
            'entry_type' => ['required', 'in:freeform,template'],
            'template_name' => [
                'required_if:entry_type,template',
                'nullable',
                'string',
                Rule::exists('journal_templates', 'slug')->where('is_active', true),
            ],
            'content' => ['required', 'string'],
            'entry_date' => ['required', 'date_format:Y-m-d', "before_or_equal:{$today}"],
            'is_draft' => ['boolean'],
            'mood_score' => ['nullable', 'integer', 'between:1,5'],
            'emotions' => ['nullable', 'array', 'max:5'],
            'emotions.*' => ['string', 'max:50'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'entry_type.required' => 'Mode penulisan jurnal wajib ditentukan.',
            'entry_type.in' => 'Mode penulisan harus berupa freeform atau template.',
            'template_name.required_if' => 'Nama template wajib dipilih untuk mode template.',
            'template_name.exists' => 'Template yang dipilih tidak ditemukan atau sedang tidak aktif.',
            'content.required' => 'Konten jurnal tidak boleh kosong.',
            'entry_date.required' => 'Tanggal jurnal wajib diisi.',
            'entry_date.date_format' => 'Format tanggal harus Y-m-d.',
            'entry_date.before_or_equal' => 'Tanggal jurnal tidak boleh di masa depan.',
            'mood_score.between' => 'Skor mood harus antara 1 sampai 5.',
            'emotions.max' => 'Maksimal 5 emosi yang dapat dilampirkan.',
        ];
    }
}
