<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInvoiceRequest extends FormRequest
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
            'issue_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'total_amount' => ['required', 'numeric', 'min:0', 'max:10000000'],
            'status' => ['required', Rule::in(['draft', 'sent', 'paid'])],
            'user_id' => ['prohibited'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('due_date') && $this->input('due_date') === '') {
            $this->merge(['due_date' => null]);
        }
    }

    public function messages(): array
    {
        return [
            'project_id.required' => __('validation.invoice.project.required'),
            'project_id.integer' => __('validation.invoice.project.integer'),
            'project_id.exists' => __('validation.invoice.project.exists'),
            'issue_date.required' => __('validation.invoice.issue_date.required'),
            'issue_date.date' => __('validation.invoice.issue_date.date'),
            'due_date.date' => __('validation.invoice.due_date.date'),
            'due_date.after_or_equal' => __('validation.invoice.due_date.after_or_equal'),
            'total_amount.required' => __('validation.invoice.total_amount.required'),
            'total_amount.numeric' => __('validation.invoice.total_amount.numeric'),
            'total_amount.min' => __('validation.invoice.total_amount.min'),
            'total_amount.max' => __('validation.invoice.total_amount.max'),
            'status.required' => __('validation.invoice.status.required'),
            'status.in' => __('validation.invoice.status.in'),
        ];
    }
}