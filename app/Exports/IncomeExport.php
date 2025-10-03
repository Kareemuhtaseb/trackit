<?php

namespace App\Exports;

use App\Models\Income;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;

class IncomeExport implements FromQuery, WithHeadings, WithMapping, WithStrictNullComparison, ShouldQueue
{
    use Exportable;

    public function __construct(
        protected int $userId,
        protected array $filters = []
    ) {
    }

    public function query(): Builder
    {
        $query = Income::query()
            ->with('category')
            ->where('user_id', $this->userId);

        if ($search = data_get($this->filters, 'search')) {
            $query->where('source', 'like', '%' . $search . '%');
        }

        if ($categoryId = data_get($this->filters, 'category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($type = data_get($this->filters, 'type')) {
            $query->whereHas('category', function ($categoryQuery) use ($type) {
                $categoryQuery->where('type', $type);
            });
        }

        if ($dateFrom = data_get($this->filters, 'date_from')) {
            $query->whereDate('received_at', '>=', $dateFrom);
        }

        if ($dateTo = data_get($this->filters, 'date_to')) {
            $query->whereDate('received_at', '<=', $dateTo);
        }

        return $query->orderByDesc('received_at')->orderByDesc('created_at');
    }

    public function headings(): array
    {
        $headerKeys = config('exports.income.headers', []);

        return Collection::make($headerKeys)
            ->map(fn (string $key) => __($key))
            ->all();
    }

    /**
     * @param  \App\Models\Income  $income
     */
    public function map($income): array
    {
        $receivedAt = optional($income->received_at)->format(config('exports.date_format'));

        return [
            $income->source,
            $income->amount,
            optional($income->category)->name,
            $receivedAt,
            optional($income->created_at)->format(config('exports.datetime_format')),
        ];
    }
}