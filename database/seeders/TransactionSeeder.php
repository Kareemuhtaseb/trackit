<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::query()->get();
        $users = User::query()->get();

        if ($categories->isEmpty()) {
            $this->command?->warn('No categories available. Skipping transaction seeding.');

            return;
        }

        if ($users->isEmpty()) {
            $this->command?->warn('No users available. Skipping transaction seeding.');

            return;
        }

        Transaction::factory()
            ->count(20)
            ->state(fn () => [
                'category_id' => $categories->random()->id,
                'user_id' => $users->random()->id,
            ])
            ->create();
    }
}