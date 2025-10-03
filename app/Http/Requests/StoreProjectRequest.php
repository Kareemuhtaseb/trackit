<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'hourly_rate' => ['required', 'numeric', 'min:0', 'max:10000'],
            'status' => ['required', Rule::in(['active', 'completed'])],
            'notes' => ['nullable', 'string', 'max:2000'],
            'user_id' => ['prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => __('validation.project.name.required'),
            'name.max' => __('validation.project.name.max'),
            'client_name.max' => __('validation.project.client_name.max'),
            'hourly_rate.required' => __('validation.project.hourly_rate.required'),
            'hourly_rate.numeric' => __('validation.project.hourly_rate.numeric'),
            'hourly_rate.min' => __('validation.project.hourly_rate.min'),
            'hourly_rate.max' => __('validation.project.hourly_rate.max'),
            'status.required' => __('validation.project.status.required'),
            'status.in' => __('validation.project.status.in'),
            'notes.max' => __('validation.project.notes.max'),
        ];
    }
}