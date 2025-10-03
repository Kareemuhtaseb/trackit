<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Income;
use App\Models\User;
use Illuminate\Database\Seeder;

class IncomeSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::query()->get();
        $users = User::query()->get();

        if ($categories->isEmpty()) {
            $this->command?->warn('No categories available. Skipping income seeding.');

            return;
        }

        if ($users->isEmpty()) {
            $this->command?->warn('No users available. Skipping income seeding.');

            return;
        }

        Income::factory()
            ->count(10)
            ->state(fn () => [
                'category_id' => $categories->random()->id,
                'user_id' => $users->random()->id,
            ])
            ->create();
    }
}