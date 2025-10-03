<?php

namespace App\Http\Requests;

use App\Models\Income;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIncomeRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Income|null $income */
        $income = $this->route('income');

        return $income !== null && $this->user() !== null && $income->user_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'source' => ['sometimes', 'required', 'string', 'max:255'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0', 'max:1000000'],
            'category_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('categories', 'id')->where(function ($query) {
                    $userId = $this->user()->id;

                    $query->where(function ($categoryQuery) use ($userId) {
                        $categoryQuery->whereNull('user_id')->orWhere('user_id', $userId);
                    })->where('type', 'income');
                }),
            ],
            'received_at' => ['sometimes', 'nullable', 'date'],
            'user_id' => ['prohibited'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('received_at') && $this->input('received_at') === '') {
            $this->merge(['received_at' => null]);
        }
    }

    public function messages(): array
    {
        return [
            'source.required' => __('validation.income.source.required'),
            'source.max' => __('validation.income.source.max'),
            'amount.required' => __('validation.income.amount.required'),
            'amount.numeric' => __('validation.income.amount.numeric'),
            'amount.min' => __('validation.income.amount.min'),
            'amount.max' => __('validation.income.amount.max'),
            'category_id.required' => __('validation.income.category.required'),
            'category_id.integer' => __('validation.income.category.integer'),
            'category_id.exists' => __('validation.income.category.exists'),
            'received_at.date' => __('validation.income.received_at.date'),
        ];
    }
}