<?php

namespace App\Models;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'issue_date',
        'due_date',
        'total_amount',
        'status',
        'user_id',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'total_amount' => 'decimal:2',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function generatePdf(array $viewData = [])
    {
        $data = array_merge([
            'invoice' => $this->loadMissing(['project', 'user']),
            'project' => $this->project,
            'user' => $this->user,
        ], $viewData);

        return Pdf::loadView('invoices.pdf', $data);
    }
}
