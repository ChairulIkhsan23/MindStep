<?php

namespace App\Http\Requests\Habit;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreHabitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'measurement_type' => ['required', 'string', 'in:boolean,quantitative,duration'],
            'target_value' => ['required', 'numeric', 'min:0.01', 'max:999999.99'],
            'unit' => ['nullable', 'string', 'max:50', 'required_if:measurement_type,quantitative,duration'],
            'frequency_type' => ['required', 'string', 'in:daily,specific_days,weekly_target'],
            'scheduled_days' => ['nullable', 'array', 'required_if:frequency_type,specific_days'],
            'scheduled_days.*' => ['integer', 'between:1,7'],
            'weekly_target_days' => ['nullable', 'integer', 'between:1,7', 'required_if:frequency_type,weekly_target'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'color' => ['nullable', 'string', 'regex:/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/'],
            'icon' => ['nullable', 'string', 'max:50'],
        ];
    }
}
