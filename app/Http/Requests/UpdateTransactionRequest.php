<?php

namespace App\Http\Requests;

use App\Models\Transaction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Transaction|null $transaction */
        $transaction = $this->route('transaction');

        return $transaction !== null && $this->user() !== null && $transaction->user_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0', 'max:1000000'],
            'category_id' => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('categories', 'id')->where(function ($query) {
                    $userId = $this->user()->id;

                    $query->where(function ($categoryQuery) use ($userId) {
                        $categoryQuery->whereNull('user_id')->orWhere('user_id', $userId);
                    });
                }),
            ],
            'type' => ['sometimes', 'required', Rule::in(['debit', 'credit'])],
            'transaction_date' => ['sometimes', 'required', 'date'],
            'user_id' => ['prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            'description.required' => __('validation.transaction.description.required'),
            'description.max' => __('validation.transaction.description.max'),
            'amount.required' => __('validation.transaction.amount.required'),
            'amount.numeric' => __('validation.transaction.amount.numeric'),
            'amount.min' => __('validation.transaction.amount.min'),
            'amount.max' => __('validation.transaction.amount.max'),
            'category_id.required' => __('validation.transaction.category.required'),
            'category_id.integer' => __('validation.transaction.category.integer'),
            'category_id.exists' => __('validation.transaction.category.exists'),
            'type.required' => __('validation.transaction.type.required'),
            'type.in' => __('validation.transaction.type.in'),
            'transaction_date.required' => __('validation.transaction.date.required'),
            'transaction_date.date' => __('validation.transaction.date.date'),
        ];
    }
}