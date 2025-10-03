<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\TimeEntry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimeEntryTest extends TestCase
{
    use RefreshDatabase;

    public function test_time_entry_cost_accessor_calculates_amount(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $project = Project::factory()->for($user)->create([
            'hourly_rate' => 150.50,
        ]);

        $timeEntry = TimeEntry::factory()->for($project)->for($user)->create([
            'hours' => 3.5,
        ]);

        $this->assertEqualsWithDelta(526.75, $timeEntry->fresh()->cost, 0.01);
    }
}