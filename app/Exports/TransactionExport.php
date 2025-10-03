<?php

namespace App\Exports;

use App\Models\Transaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;

class TransactionExport implements FromQuery, WithHeadings, WithMapping, WithStrictNullComparison, ShouldQueue
{
    use Exportable;

    public function __construct(
        protected int $userId,
        protected array $filters = []
    ) {
    }

    public function query(): Builder
    {
        $query = Transaction::query()
            ->with('category')
            ->where('user_id', $this->userId);

        if ($search = data_get($this->filters, 'search')) {
            $query->where('description', 'like', '%' . $search . '%');
        }

        if ($categoryId = data_get($this->filters, 'category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($type = data_get($this->filters, 'type')) {
            $query->where('type', $type);
        }

        if ($dateFrom = data_get($this->filters, 'date_from')) {
            $query->whereDate('transaction_date', '>=', $dateFrom);
        }

        if ($dateTo = data_get($this->filters, 'date_to')) {
            $query->whereDate('transaction_date', '<=', $dateTo);
        }

        return $query->orderByDesc('transaction_date')->orderByDesc('created_at');
    }

    public function headings(): array
    {
        $headerKeys = config('exports.transaction.headers', []);

        return Collection::make($headerKeys)
            ->map(fn (string $key) => __($key))
            ->all();
    }

    /**
     * @param  \App\Models\Transaction  $transaction
     */
    public function map($transaction): array
    {
        return [
            $transaction->description,
            $transaction->amount,
            $transaction->type,
            optional($transaction->category)->name,
            optional($transaction->transaction_date)->format(config('exports.datetime_format')),
            optional($transaction->created_at)->format(config('exports.datetime_format')),
        ];
    }
}