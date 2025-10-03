<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'description' => $this->faker->sentence(4),
            'amount' => $this->faker->randomFloat(2, 10, 5000),
            'category_id' => Category::factory(),
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['debit', 'credit']),
            'transaction_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}