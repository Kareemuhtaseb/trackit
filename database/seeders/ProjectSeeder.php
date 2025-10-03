<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command?->warn('No users available. Skipping project seeding.');

            return;
        }

        Project::factory()
            ->count(10)
            ->state(fn () => [
                'user_id' => $users->random()->id,
            ])
            ->create();
    }
}