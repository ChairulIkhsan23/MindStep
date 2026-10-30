<?php

namespace App\Http\Requests\Mood;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMoodLogRequest extends FormRequest
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
            'mood_score' => ['sometimes', 'required', 'integer', 'between:1,5'],
            'log_date' => ['sometimes', 'required', 'date_format:Y-m-d', "before_or_equal:{$today}"],
            'emotions' => ['nullable', 'array', 'max:5'],
            'emotions.*' => ['string', 'max:50'],
            'note' => ['nullable', 'string', 'max:500'],
            'journal_id' => [
                'nullable',
                Rule::exists('journals', 'id')->where(function ($query) {
                    $query->where('user_id', $this->user()?->id);
                }),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'mood_score.required' => 'Skor mood wajib dipilih.',
            'mood_score.between' => 'Skor mood harus antara 1 sampai 5.',
            'log_date.required' => 'Tanggal pencatatan wajib diisi.',
            'log_date.date_format' => 'Format tanggal harus Y-m-d.',
            'log_date.before_or_equal' => 'Tanggal tidak boleh di masa depan.',
            'emotions.max' => 'Maksimal 5 emosi yang dapat dipilih.',
            'note.max' => 'Catatan maksimal 500 karakter.',
            'journal_id.exists' => 'Jurnal tidak valid atau bukan milik Anda.',
        ];
    }
}
