<?php

namespace App\Http\Controllers\Api;

use App\Exports\IncomeExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIncomeRequest;
use App\Http\Requests\UpdateIncomeRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\IncomeResource;
use App\Models\Category;
use App\Models\Income;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelFormat;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        $query = $this->buildIncomeQuery($request);

        $perPage = (int) $request->input('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        $incomes = $query
            ->orderByDesc('received_at')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return IncomeResource::collection($incomes)->additional([
            'filters' => $request->only(['search', 'category_id', 'type', 'date_from', 'date_to', 'per_page']),
            'categories' => CategoryResource::collection($this->availableCategories($request->user(), 'income')),
        ]);
    }

    public function store(StoreIncomeRequest $request): IncomeResource
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $income = Income::create($data);

        return new IncomeResource($income->load('category'));
    }

    public function show(Request $request, Income $income): IncomeResource
    {
        $this->authorizeIncome($income, $request->user());

        return new IncomeResource($income->load('category'));
    }

    public function update(UpdateIncomeRequest $request, Income $income): IncomeResource
    {
        $this->authorizeIncome($income, $request->user());

        $income->update($request->validated());

        return new IncomeResource($income->load('category'));
    }

    public function destroy(Request $request, Income $income): JsonResponse
    {
        $this->authorizeIncome($income, $request->user());

        $income->delete();

        return response()->noContent();
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
