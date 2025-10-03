<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'total_income' => $this->resource['total_income'],
            'total_expenses' => $this->resource['total_expenses'],
            'recent_transactions' => TransactionResource::collection(
                collect($this->resource['recent_transactions'])
            ),
        ];
    }
}
