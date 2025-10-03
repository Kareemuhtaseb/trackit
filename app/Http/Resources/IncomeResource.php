<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Income
 */
class IncomeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'source' => $this->source,
            'amount' => $this->amount,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => new CategoryResource($this->category)),
            'received_at' => $this->received_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
