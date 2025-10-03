<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Transaction Details</h1>
                <p class="text-sm text-slate-500">View transaction information.</p>
            </div>
            <div class="flex items-center gap-3">
                <router-link
                    :to="`/transactions/${transaction.id}/edit`"
                    class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                >
                    Edit
                </router-link>
                <router-link
                    to="/transactions"
                    class="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200"
                >
                    Back to Transactions
                </router-link>
            </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="text-sm text-slate-500">Loading...</div>
        </div>

        <div v-else-if="transaction" class="rounded-lg bg-white p-6 shadow">
            <dl class="grid gap-4 sm:grid-cols-2">
                <div>
                    <dt class="text-sm font-medium text-slate-500">Description</dt>
                    <dd class="mt-1 text-sm text-slate-900">{{ transaction.description }}</dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-500">Amount</dt>
                    <dd class="mt-1 text-sm font-semibold text-slate-900">
                        <span :class="amountClass(transaction.type)">
                            {{ transaction.type === 'debit' ? '-' : '+' }}{{ formatCurrency(transaction.amount) }}
                        </span>
                    </dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-500">Type</dt>
                    <dd class="mt-1 text-sm text-slate-900">
                        <span :class="typeClass(transaction.type)">
                            {{ transaction.type === 'debit' ? 'Debit' : 'Credit' }}
                        </span>
                    </dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-500">Category</dt>
                    <dd class="mt-1 text-sm text-slate-900">{{ transaction.category?.name ?? 'Uncategorized' }}</dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-500">Transaction date</dt>
                    <dd class="mt-1 text-sm text-slate-900">{{ formatDateTime(transaction.transaction_date) }}</dd>
                </div>
                <div v-if="transaction.created_at">
                    <dt class="text-sm font-medium text-slate-500">Created</dt>
                    <dd class="mt-1 text-sm text-slate-900">{{ formatDateTime(transaction.created_at) }}</dd>
                </div>
                <div v-if="transaction.updated_at">
                    <dt class="text-sm font-medium text-slate-500">Last updated</dt>
                    <dd class="mt-1 text-sm text-slate-900">{{ formatDateTime(transaction.updated_at) }}</dd>
                </div>
            </dl>
        </div>

        <div v-else class="rounded-lg bg-white p-6 shadow">
            <p class="text-sm text-slate-500">Transaction not found.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const transaction = ref(null);
const loading = ref(true);

const formatCurrency = (value) => {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    }).format(Number(value ?? 0));
};

const formatDateTime = (value) => {
    if (!value) return '';
    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
};

const amountClass = (type) =>
    type === 'debit'
        ? 'text-rose-600'
        : 'text-emerald-600';

const typeClass = (type) =>
    type === 'debit'
        ? 'inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800'
        : 'inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800';

const loadTransaction = async () => {
    try {
        const { data } = await axios.get(`/api/transactions/${route.params.id}`);
        transaction.value = data.data ?? data;
    } catch (error) {
        console.error('Error loading transaction:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadTransaction();
});
</script>