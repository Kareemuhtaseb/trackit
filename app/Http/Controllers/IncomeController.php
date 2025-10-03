<?php

namespace App\Http\Controllers;

use App\Exports\IncomeExport;
use App\Http\Requests\StoreIncomeRequest;
use App\Http\Requests\UpdateIncomeRequest;
use App\Models\Category;
use App\Models\Income;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelFormat;

class IncomeController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'owns.resource']);
    }

    public function index(Request $request)
    {
        $query = $this->buildIncomeQuery($request);

        $perPage = (int) $request->input('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $incomes = $query
            ->orderByDesc('received_at')
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        return view('incomes.index', [
            'incomes' => $incomes,
            'categories' => $this->availableCategories($request->user(), 'income'),
            'filters' => $request->only(['search', 'category_id', 'type', 'date_from', 'date_to', 'per_page']),
        ]);
    }

    public function export(Request $request)
    {
        $format = strtolower((string) $request->input('format', 'xlsx'));
        $excelFormat = $format === 'csv' ? ExcelFormat::CSV : ExcelFormat::XLSX;
        $extension = $format === 'csv' ? 'csv' : 'xlsx';

        $fileName = Str::slug(__('exports.income.filename')) . '-' . now()->format('Ymd_His') . '.' . $extension;

        $filters = $request->only(['search', 'category_id', 'type', 'date_from', 'date_to']);

        return Excel::download(
            new IncomeExport($request->user()->id, $filters),
            $fileName,
            $excelFormat
        );
    }

    public function create(Request $request)
    {
        return view('incomes.create', [
            'categories' => $this->availableCategories($request->user(), 'income'),
        ]);
    }

    public function store(StoreIncomeRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $income = Income::create($data);

        return redirect()
            ->route('incomes.show', $income)
            ->with('status', __('Income created successfully.'));
    }

    public function show(Request $request, Income $income)
    {
        $this->authorizeIncome($income, $request->user());

        return view('incomes.show', [
            'income' => $income->load('category'),
        ]);
    }

    public function edit(Request $request, Income $income)
    {
        $this->authorizeIncome($income, $request->user());

        return view('incomes.edit', [
            'income' => $income,
            'categories' => $this->availableCategories($request->user(), 'income'),
        ]);
    }

    public function update(UpdateIncomeRequest $request, Income $income)
    {
        $this->authorizeIncome($income, $request->user());

        $income->update($request->validated());

        return redirect()
            ->route('incomes.show', $income)
            ->with('status', __('Income updated successfully.'));
    }

    public function destroy(Request $request, Income $income)
    {
        $this->authorizeIncome($income, $request->user());

        $income->delete();

        return redirect()
            ->route('incomes.index')
            ->with('status', __('Income deleted successfully.'));
    }

    private function buildIncomeQuery(Request $request): Builder
    {
        $user = $request->user();

        $query = Income::query()
            ->with('category')
            ->where('user_id', $user->id);

        if ($search = $request->input('search')) {
            $query->where('source', 'like', '%' . $search . '%');
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($type = $request->input('type')) {
            $query->whereHas('category', function ($categoryQuery) use ($type) {
                $categoryQuery->where('type', $type);
            });
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('received_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('received_at', '<=', $dateTo);
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

    private function authorizeIncome(Income $income, $user): void
    {
        abort_if($income->user_id !== $user?->id, 403);
    }
}