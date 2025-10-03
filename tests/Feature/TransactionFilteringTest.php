<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionFilteringTest extends TestCase
{
    use RefreshDatabase;

    public function test_transactions_can_be_filtered_by_category_type_and_date(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $matchingCategory = Category::factory()->create([
            'type' => 'expense',
            'user_id' => $user->id,
        ]);

        $otherCategory = Category::factory()->create([
            'type' => 'expense',
            'user_id' => $user->id,
        ]);

        $matchingTransaction = Transaction::factory()
            ->for($matchingCategory)
            ->for($user)
            ->create([
                'type' => 'debit',
                'transaction_date' => now()->subHours(2),
            ]);

        Transaction::factory()
            ->for($otherCategory)
            ->for($user)
            ->create([
                'type' => 'credit',
                'transaction_date' => now()->subDays(5),
            ]);

        $response = $this->actingAs($user)->get(route('transactions.index', [
            'category_id' => $matchingCategory->id,
            'type' => 'debit',
            'date_from' => now()->subDay()->toDateString(),
            'date_to' => now()->addDay()->toDateString(),
        ]));

        $response->assertOk();

        $transactions = $response->viewData('transactions');

        $this->assertEquals(1, $transactions->total());
        $this->assertTrue($transactions->first()->is($matchingTransaction));
    }
}