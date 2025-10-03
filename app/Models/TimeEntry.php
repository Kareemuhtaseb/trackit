<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'date',
        'hours',
        'description',
        'user_id',
    ];

    protected $casts = [
        'date' => 'date',
        'hours' => 'decimal:2',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getCostAttribute(): ?float
    {
        $project = $this->project;

        if (! $project || $this->hours === null) {
            return null;
        }

        return round((float) $this->hours * (float) $project->hourly_rate, 2);
    }
}