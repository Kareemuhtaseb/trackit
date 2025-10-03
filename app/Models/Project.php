<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'client_name',
        'hourly_rate',
        'status',
        'notes',
        'user_id',
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
    ];

    public function timeEntries()
    {
        return $this->hasMany(TimeEntry::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}