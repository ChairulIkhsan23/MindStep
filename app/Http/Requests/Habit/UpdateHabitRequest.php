<?php

namespace App\Http\Requests\Habit;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHabitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('habit')) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'measurement_type' => ['sometimes', 'required', 'string', 'in:boolean,quantitative,duration'],
            'target_value' => ['sometimes', 'required', 'numeric', 'min:0.01', 'max:999999.99'],
            'unit' => ['nullable', 'string', 'max:50'],
            'frequency_type' => ['sometimes', 'required', 'string', 'in:daily,specific_days,weekly_target'],
            'scheduled_days' => ['nullable', 'array'],
            'scheduled_days.*' => ['integer', 'between:1,7'],
            'weekly_target_days' => ['nullable', 'integer', 'between:1,7'],
            'start_date' => ['sometimes', 'required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'color' => ['nullable', 'string', 'regex:/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/'],
            'icon' => ['nullable', 'string', 'max:50'],
        ];
    }
}
