<?php

namespace App\Http\Requests\Habit;

use App\Models\Habit;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LogHabitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var Habit|null $habit */
        $habit = $this->route('habit');

        return $habit ? ($this->user()?->can('update', $habit) ?? false) : false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Habit $habit */
        $habit = $this->route('habit');
        $userTimezone = $this->user()?->timezone ?? 'UTC';
        $todayInUserTz = Carbon::now($userTimezone)->toDateString();

        return [
            'log_date' => [
                'required',
                'date',
                'date_format:Y-m-d',
                'after_or_equal:'.$habit->start_date->toDateString(),
                'before_or_equal:'.$todayInUserTz,
            ],
            'actual_value' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'status' => ['nullable', 'string', 'in:not_completed,partial,completed,rest_day,freeze'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
