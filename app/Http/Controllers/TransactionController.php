<?php

namespace App\Http\Controllers;

use App\Exports\TransactionExport;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelFormat;

class TransactionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'owns.resource']);
    }

    public function index(Request $request)
    {
        $query = $this->buildTransactionQuery($request);

        $perPage = (int) $request->input('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $transactions = $query
            ->orderByDesc('transaction_date')
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return view('transactions.index', [
            'transactions' => $transactions,
            'categories' => $this->availableCategories($request->user()),
            'filters' => $request->only(['search', 'category_id', 'type', 'date_from', 'date_to', 'per_page']),
        ]);
    }

    public function export(Request $request)
    {
        $format = strtolower((string) $request->input('format', 'xlsx'));
        $excelFormat = $format === 'csv' ? ExcelFormat::CSV : ExcelFormat::XLSX;
        $extension = $format === 'csv' ? 'csv' : 'xlsx';

        $fileName = Str::slug(__('exports.transaction.filename')) . '-' . now()->format('Ymd_His') . '.' . $extension;

        $filters = $request->only(['search', 'category_id', 'type', 'date_from', 'date_to']);

        return Excel::download(
            new TransactionExport($request->user()->id, $filters),
            $fileName,
            $excelFormat
        );
    }

    public function create(Request $request)
    {
        return view('transactions.create', [
            'categories' => $this->availableCategories($request->user()),
            'types' => ['debit', 'credit'],
        ]);
    }

    public function store(StoreTransactionRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $transaction = Transaction::create($data);

        return redirect()
            ->route('transactions.show', $transaction)
            ->with('status', __('Transaction created successfully.'));
    }

    public function show(Request $request, Transaction $transaction)
    {
        $this->authorizeTransaction($transaction, $request->user());

        return view('transactions.show', [
            'transaction' => $transaction->load('category'),
        ]);
    }

    public function edit(Request $request, Transaction $transaction)
    {
        $this->authorizeTransaction($transaction, $request->user());

        return view('transactions.edit', [
            'transaction' => $transaction,
            'categories' => $this->availableCategories($request->user()),
            'types' => ['debit', 'credit'],
        ]);
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $this->authorizeTransaction($transaction, $request->user());

        $transaction->update($request->validated());

        return redirect()
            ->route('transactions.show', $transaction)
            ->with('status', __('Transaction updated successfully.'));
    }

    public function destroy(Request $request, Transaction $transaction)
    {
        $this->authorizeTransaction($transaction, $request->user());

        $transaction->delete();

        return redirect()
            ->route('transactions.index')
            ->with('status', __('Transaction deleted successfully.'));
    }

    private function buildTransactionQuery(Request $request): Builder
    {
        $user = $request->user();

        $query = Transaction::query()
            ->with('category')
            ->where('user_id', $user->id);

        if ($search = $request->input('search')) {
            $query->where('description', 'like', '%' . $search . '%');
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('transaction_date', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('transaction_date', '<=', $dateTo);
        }

        return $query;
    }

    private function availableCategories($user, ?string $type = null)
    {
        $query = Category::query()
            ->where(function ($innerQuery) use ($user) {
                $innerQuery->whereNull('user_id')->orWhere('user_id', $user->id);
            });

        if ($type) {
            $query->where('type', $type);
        }

        return $query->orderBy('name')->get();
    }

    private function authorizeTransaction(Transaction $transaction, $user): void
    {
        abort_if($transaction->user_id !== $user?->id, 403);
    }
}