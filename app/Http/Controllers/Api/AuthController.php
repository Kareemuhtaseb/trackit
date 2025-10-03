<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\DashboardResource;
use App\Http\Resources\UserResource;
use App\Models\Income;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        event(new Registered($user));

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $request->authenticate();
        
        $user = $request->user();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    public function user(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function dashboard(Request $request): DashboardResource
    {
        $user = $request->user();

        $totalIncome = Income::query()
            ->where('user_id', $user->id)
            ->whereMonth('received_at', now()->month)
            ->whereYear('received_at', now()->year)
            ->sum('amount');

        $totalExpenses = Transaction::query()
            ->where('user_id', $user->id)
            ->where('type', 'debit')
            ->whereMonth('transaction_date', now()->month)
            ->whereYear('transaction_date', now()->year)
            ->sum('amount');

        $recentTransactions = Transaction::query()
            ->with('category')
            ->where('user_id', $user->id)
            ->orderByDesc('transaction_date')
            ->take(5)
            ->get();

        return new DashboardResource([
            'total_income' => $totalIncome,
            'total_expenses' => $totalExpenses,
            'recent_transactions' => $recentTransactions,
        ]);
    }
}
