<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'client_name' => $this->faker->company(),
            'hourly_rate' => $this->faker->randomFloat(2, 25, 150),
            'status' => $this->faker->randomElement(['active', 'completed']),
            'notes' => $this->faker->optional()->paragraph(),
            'user_id' => User::factory(),
        ];
    }
}