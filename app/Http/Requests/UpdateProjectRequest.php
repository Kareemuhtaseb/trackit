<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Project|null $project */
        $project = $this->route('project');

        return $project !== null && $this->user() !== null && $project->user_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'client_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'hourly_rate' => ['sometimes', 'required', 'numeric', 'min:0', 'max:10000'],
            'status' => ['sometimes', 'required', Rule::in(['active', 'completed'])],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
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