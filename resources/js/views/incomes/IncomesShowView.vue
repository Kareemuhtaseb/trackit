<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Income Details</h1>
                <p class="text-sm text-slate-500">View income entry information.</p>
            </div>
            <div class="flex items-center gap-3">
                <router-link
                    :to="`/incomes/${income.id}/edit`"
                    class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                >
                    Edit
                </router-link>
                <router-link
                    to="/incomes"
                    class="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200"
                >
                    Back to Incomes
                </router-link>
            </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="text-sm text-slate-500">Loading...</div>
        </div>

        <div v-else-if="income" class="rounded-lg bg-white p-6 shadow">
            <dl class="grid gap-4 sm:grid-cols-2">
                <div>
                    <dt class="text-sm font-medium text-slate-500">Source</dt>
                    <dd class="mt-1 text-sm text-slate-900">{{ income.source }}</dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-500">Amount</dt>
                    <dd class="mt-1 text-sm font-semibold text-slate-900">{{ formatCurrency(income.amount) }}</dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-500">Category</dt>
                    <dd class="mt-1 text-sm text-slate-900">{{ income.category?.name ?? 'Uncategorized' }}</dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-slate-500">Received at</dt>
                    <dd class="mt-1 text-sm text-slate-900">{{ formatDateTime(income.received_at) }}</dd>
                </div>
                <div v-if="income.created_at">
                    <dt class="text-sm font-medium text-slate-500">Created</dt>
                    <dd class="mt-1 text-sm text-slate-900">{{ formatDateTime(income.created_at) }}</dd>
                </div>
                <div v-if="income.updated_at">
                    <dt class="text-sm font-medium text-slate-500">Last updated</dt>
                    <dd class="mt-1 text-sm text-slate-900">{{ formatDateTime(income.updated_at) }}</dd>
                </div>
            </dl>
        </div>

        <div v-else class="rounded-lg bg-white p-6 shadow">
            <p class="text-sm text-slate-500">Income not found.</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const income = ref(null);
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

const loadIncome = async () => {
    try {
        const { data } = await axios.get(`/api/incomes/${route.params.id}`);
        income.value = data.data ?? data;
    } catch (error) {
        console.error('Error loading income:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadIncome();
});
</script>