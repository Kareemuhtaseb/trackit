<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\TimeEntry;
use App\Models\User;
use Illuminate\Database\Seeder;

class TimeEntrySeeder extends Seeder
{
    public function run(): void
    {
        $projects = Project::all();
        $users = User::all();

        if ($projects->isEmpty()) {
            $this->command?->warn('No projects available. Skipping time entry seeding.');

            return;
        }

        if ($users->isEmpty()) {
            $this->command?->warn('No users available. Skipping time entry seeding.');

            return;
        }

        TimeEntry::factory()
            ->count(20)
            ->state(fn () => [
                'project_id' => $projects->random()->id,
                'user_id' => $users->random()->id,
                'date' => fake()->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            ])
            ->create();
    }
}