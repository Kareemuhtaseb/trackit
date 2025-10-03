<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\TimeEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function show(Request $request, Invoice $invoice): JsonResponse
    {
        $this->authorize('view', $invoice);

        $invoice->load(['project', 'timeEntries']);

        return response()->json([
            'data' => $invoice,
            'project' => $invoice->project,
            'time_entries' => $invoice->timeEntries,
        ]);
    }

    public function generatePdf(Request $request, Invoice $invoice): JsonResponse
    {
        $this->authorize('view', $invoice);

        $invoice->load(['project', 'timeEntries']);

        $pdf = Pdf::loadView('invoices.pdf', [
            'invoice' => $invoice,
            'project' => $invoice->project,
            'timeEntries' => $invoice->timeEntries,
            'user' => $request->user(),
        ]);

        $filename = 'invoice-' . str_pad($invoice->id, 5, '0', STR_PAD_LEFT) . '.pdf';
        
        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
