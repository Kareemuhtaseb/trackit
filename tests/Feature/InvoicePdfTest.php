<?php

namespace Tests\Feature;

use App\Models\Invoice;
use App\Models\Project;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DompdfWrapper;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class InvoicePdfTest extends TestCase
{
    use RefreshDatabase;

    public function test_invoice_generate_pdf_returns_pdf_instance(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $project = Project::factory()->for($user)->create([
            'name' => 'Website Revamp',
            'client_name' => 'Acme Inc.',
            'hourly_rate' => 120,
        ]);

        $invoice = Invoice::create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addWeek()->toDateString(),
            'total_amount' => 2400,
            'status' => 'sent',
        ]);

        $pdfMock = Mockery::mock(DompdfWrapper::class);

        Pdf::shouldReceive('loadView')
            ->once()
            ->with('invoices.pdf', Mockery::on(function ($data) use ($invoice) {
                return $data['invoice']->is($invoice)
                    && $data['project']->is($invoice->project)
                    && $data['user']->is($invoice->user);
            }))
            ->andReturn($pdfMock);

        $this->assertSame($pdfMock, $invoice->generatePdf());
    }
}