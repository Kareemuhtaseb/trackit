<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTimeEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'project_id' => [
                'required',
                'integer',
                Rule::exists('projects', 'id')->where(function ($query) {
                    $query->where('user_id', $this->user()->id);
                }),
            ],
            'date' => ['required', 'date'],
            'hours' => ['required', 'numeric', 'min:0.25', 'max:24'],
            'description' => ['nullable', 'string', 'max:1000'],
            'user_id' => ['prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            'project_id.required' => __('validation.time_entry.project.required'),
            'project_id.integer' => __('validation.time_entry.project.integer'),
            'project_id.exists' => __('validation.time_entry.project.exists'),
            'date.required' => __('validation.time_entry.date.required'),
            'date.date' => __('validation.time_entry.date.date'),
            'hours.required' => __('validation.time_entry.hours.required'),
            'hours.numeric' => __('validation.time_entry.hours.numeric'),
            'hours.min' => __('validation.time_entry.hours.min'),
            'hours.max' => __('validation.time_entry.hours.max'),
            'description.max' => __('validation.time_entry.description.max'),
        ];
    }
}