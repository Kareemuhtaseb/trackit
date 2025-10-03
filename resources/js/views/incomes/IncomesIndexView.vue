<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Incomes</h1>
                <p class="text-sm text-slate-500">Track and manage your income entries.</p>
            </div>
            <div class="flex items-center gap-3">
                <button
                    type="button"
                    class="rounded-md border border-primary-200 px-3 py-2 text-sm font-medium text-primary-600 transition hover:bg-primary-50"
                    @click="exportData('xlsx')"
                >
                    Export
                </button>
                <router-link
                    class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                    to="/incomes/new"
                >
                    New income
                </router-link>
            </div>
        </div>

        <form class="grid gap-4 rounded-lg bg-white p-4 shadow sm:grid-cols-2 md:grid-cols-4" @submit.prevent="applyFilters">
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-500">Search</label>
                <input
                    v-model="filters.search"
                    type="text"
                    placeholder="Search source..."
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
            </div>
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
                <select
                    v-model="filters.category_id"
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                >
                    <option value="">All</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-500">From</label>
                <input
                    v-model="filters.date_from"
                    type="date"
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
            </div>
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-500">To</label>
                <input
                    v-model="filters.date_to"
                    type="date"
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
            </div>
            <div>
                <label class="block text-xs font-semibold uppercase tracking-wide text-slate-500">Per page</label>
                <select
                    v-model="filters.per_page"
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                >
                    <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }}</option>
                </select>
            </div>
            <div class="flex items-end gap-3">
                <button
                    type="submit"
                    class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                >
                    Apply
                </button>
                <button
                    type="button"
                    class="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200"
                    @click="resetFilters"
                >
                    Reset
                </button>
            </div>
        </form>

        <div class="overflow-hidden rounded-lg bg-white shadow">
            <table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                        <th class="px-4 py-3 text-left">Source</th>
                        <th class="px-4 py-3 text-left">Category</th>
                        <th class="px-4 py-3 text-left">Received at</th>
                        <th class="px-4 py-3 text-right">Amount</th>
                        <th class="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-sm">
                    <tr v-for="income in incomes" :key="income.id" class="hover:bg-slate-50">
                        <td class="px-4 py-3 font-medium text-slate-900">{{ income.source }}</td>
                        <td class="px-4 py-3 text-slate-600">{{ income.category?.name ?? 'Uncategorized' }}</td>
                        <td class="px-4 py-3 text-slate-600">{{ formatDateTime(income.received_at) }}</td>
                        <td class="px-4 py-3 text-right font-semibold text-slate-900">
                            {{ formatCurrency(income.amount) }}
                        </td>
                        <td class="px-4 py-3 text-right">
                            <router-link :to="`/incomes/${income.id}`" class="text-sm font-medium text-primary-600 hover:text-primary-700">
                                View
                            </router-link>
                        </td>
                    </tr>
                    <tr v-if="!incomes.length">
                        <td colspan="5" class="px-4 py-6 text-center text-sm text-slate-500">
                            No incomes recorded yet. Create your first entry.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="pagination.total > pagination.per_page" class="flex items-center justify-between text-sm text-slate-600">
            <p>Showing {{ pagination.from }}-{{ pagination.to }} of {{ pagination.total }}</p>
            <div class="flex gap-2">
                <button
                    type="button"
                    class="rounded-md border border-slate-300 px-3 py-2 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="!pagination.links.prev"
                    @click="goTo(pagination.links.prev)"
                >
                    Previous
                </button>
                <button
                    type="button"
                    class="rounded-md border border-slate-300 px-3 py-2 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="!pagination.links.next"
                    @click="goTo(pagination.links.next)"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import api from '../../utils/axios';

const incomes = ref([]);
const categories = ref([]);
const perPageOptions = [10, 15, 25, 50, 100];

const filters = reactive({
    search: '',
    category_id: '',
    date_from: '',
    date_to: '',
    per_page: 15,
});

const pagination = reactive({
    total: 0,
    per_page: 15,
    from: 0,
    to: 0,
    links: {
        next: null,
        prev: null,
    },
});

const fetchIncomes = async (url = '/incomes') => {
    const { data } = await api.get(url, {
        params: {
            ...filters,
        },
    });

    const response = data.data ? data : { data, meta: {} };

    incomes.value = response.data.map((item) => ({
        ...item,
    }));

    categories.value = response.categories?.data ?? response.categories ?? [];

    Object.assign(filters, response.filters ?? {});

    const meta = response.meta ?? {};
    const links = response.links ?? {};

    pagination.total = meta.total ?? incomes.value.length;
    pagination.per_page = meta.per_page ?? filters.per_page;
    pagination.from = meta.from ?? (incomes.value.length ? 1 : 0);
    pagination.to = meta.to ?? incomes.value.length;
    pagination.links.next = links.next ?? meta.next_page_url ?? null;
    pagination.links.prev = links.prev ?? meta.prev_page_url ?? null;
};

const applyFilters = () => {
    fetchIncomes();
};

const resetFilters = () => {
    filters.search = '';
    filters.category_id = '';
    filters.date_from = '';
    filters.date_to = '';
    filters.per_page = 15;
    fetchIncomes();
};

const goTo = (url) => {
    if (url) {
        fetchIncomes(url.replace(window.location.origin, ''));
    }
};

const exportData = (format) => {
    const params = new URLSearchParams({ ...filters, format });
    window.location.href = `/api/incomes/export?${params.toString()}`;
};

const formatCurrency = (value) =>
    new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    }).format(Number(value ?? 0));

const formatDateTime = (value) => {
    if (!value) return '';
    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(value));
};

onMounted(() => {
    fetchIncomes();
});
</script>
