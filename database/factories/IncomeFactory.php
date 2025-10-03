<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Income;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Income>
 */
class IncomeFactory extends Factory
{
    protected $model = Income::class;

    public function definition(): array
    {
        return [
            'source' => $this->faker->sentence(3),
            'amount' => $this->faker->randomFloat(2, 50, 10000),
            'category_id' => Category::factory(),
            'user_id' => User::factory(),
            'received_at' => $this->faker->optional()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}