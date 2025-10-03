<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Income;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IncomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_income_with_valid_data(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $category = Category::factory()->create([
            'type' => 'income',
            'user_id' => $user->id,
        ]);

        $payload = [
            'source' => 'Freelance Work',
            'amount' => 1500.75,
            'category_id' => $category->id,
            'received_at' => now()->toDateString(),
        ];

        $response = $this->actingAs($user)
            ->post(route('incomes.store'), $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('incomes', [
            'source' => 'Freelance Work',
            'amount' => 1500.75,
            'category_id' => $category->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_income_creation_with_invalid_data_fails(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $category = Category::factory()->create([
            'type' => 'income',
            'user_id' => $user->id,
        ]);

        $payload = [
            'source' => '',
            'amount' => -50,
            'category_id' => $category->id,
        ];

        $response = $this->actingAs($user)
            ->post(route('incomes.store'), $payload);

        $response->assertSessionHasErrors(['source', 'amount']);
        $this->assertDatabaseCount('incomes', 0);
    }
}