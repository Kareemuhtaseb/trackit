<template>
    <div class="space-y-6">
        <!-- Page Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p class="text-gray-600 dark:text-gray-400">Overview of your financial activity</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Total Income"
                :value="summary.total_income"
                :icon="IncomeIcon"
                color="green"
                :change="12.5"
            />
            
            <StatsCard
                title="Total Expenses"
                :value="summary.total_expenses"
                :icon="ExpenseIcon"
                color="red"
                :change="-5.2"
            />
            
            <StatsCard
                title="Net Balance"
                :value="netBalance"
                :icon="BalanceIcon"
                :color="netBalance >= 0 ? 'blue' : 'red'"
                :change="netBalance >= 0 ? 8.3 : -12.1"
            />
            
            <StatsCard
                title="Transactions"
                :value="recentTransactions.length"
                :icon="TransactionIcon"
                color="purple"
                :change="15.7"
            />
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Income vs Expenses Chart -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <LineChart
                    title="Income vs Expenses"
                    subtitle="Monthly comparison"
                    :data="incomeExpenseData"
                    :height="300"
                />
            </div>
            
            <!-- Category Distribution -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <PieChart
                    title="Expense Categories"
                    subtitle="This month's spending breakdown"
                    :data="categoryData"
                    :height="300"
                />
            </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                    <router-link 
                        to="/transactions" 
                        class="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        View all
                    </router-link>
                </div>
            </div>

            <div class="p-6">
                <div v-if="recentTransactions.length" class="space-y-4">
                    <div 
                        v-for="transaction in recentTransactions" 
                        :key="transaction.id" 
                        class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                        <div class="flex items-center space-x-4">
                            <div class="flex-shrink-0">
                                <div 
                                    class="w-10 h-10 rounded-full flex items-center justify-center"
                                    :class="transaction.type === 'debit' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'"
                                >
                                    <svg 
                                        class="w-5 h-5" 
                                        :class="transaction.type === 'debit' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            v-if="transaction.type === 'debit'"
                                            stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            stroke-width="2" 
                                            d="M20 12H4m16 0l-4-4m4 4l-4 4"
                                        ></path>
                                        <path 
                                            v-else
                                            stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            stroke-width="2" 
                                            d="M4 12h16m-16 0l4-4m-4 4l4 4"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ transaction.description }}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                    {{ transaction.category?.name ?? 'Uncategorized' }} · {{ formatDate(transaction.transaction_date) }}
                                </p>
                            </div>
                        </div>
                        <span 
                            class="text-sm font-semibold"
                            :class="amountClass(transaction.type)"
                        >
                            {{ transaction.type === 'debit' ? '-' : '+' }}{{ formatCurrency(transaction.amount) }}
                        </span>
                    </div>
                </div>

                <div v-else class="text-center py-8">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions</h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new transaction.</p>
                    <div class="mt-6">
                        <router-link 
                            to="/transactions/create"
                            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            New Transaction
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import api from '../../utils/axios';
import { StatsCard } from '../../components/ui';
import { LineChart, PieChart } from '../../components/charts';

const summary = reactive({
    total_income: 0,
    total_expenses: 0,
});

const recentTransactions = reactive([]);

// Chart data
const incomeExpenseData = reactive({
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [
    {
      name: 'Income',
      data: [4000, 4500, 4200, 4800, 4600, 5000],
      color: '#10B981'
    },
    {
      name: 'Expenses',
      data: [3000, 3200, 2800, 3500, 3300, 3800],
      color: '#EF4444'
    }
  ]
});

const categoryData = reactive({
  labels: ['Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 'Bills & Utilities', 'Others'],
  series: [25, 20, 15, 18, 12, 10],
  colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
});

// Icon components for stats cards
const IncomeIcon = {
  template: `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
    </svg>
  `
};

const ExpenseIcon = {
  template: `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
    </svg>
  `
};

const BalanceIcon = {
  template: `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>
  `
};

const TransactionIcon = {
  template: `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
    </svg>
  `
};

const netBalance = computed(() => {
    return summary.total_income - summary.total_expenses;
});

const netBalanceClass = computed(() => {
    return netBalance.value >= 0 
        ? 'text-green-600 dark:text-green-400' 
        : 'text-red-600 dark:text-red-400';
});

const formatCurrency = (value) => {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    }).format(Number(value ?? 0));
};

const formatDate = (value) => {
    if (!value) return '';
    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(value));
};

const amountClass = (type) =>
    type === 'debit'
        ? 'text-red-600 dark:text-red-400'
        : 'text-green-600 dark:text-green-400';

onMounted(async () => {
    const { data } = await api.get('/dashboard');
    summary.total_income = data.data?.total_income ?? data.total_income ?? 0;
    summary.total_expenses = data.data?.total_expenses ?? data.total_expenses ?? 0;

    const items = data.data?.recent_transactions?.data ?? data.recent_transactions ?? [];
    recentTransactions.splice(0, recentTransactions.length, ...items);
});
</script>
