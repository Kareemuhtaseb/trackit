<template>
    <div class="space-y-6">
        <div>
            <h1 class="text-2xl font-semibold text-slate-900">Edit transaction</h1>
            <p class="text-sm text-slate-500">Update transaction information.</p>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="text-sm text-slate-500">Loading...</div>
        </div>

        <form v-else class="space-y-4 rounded-lg bg-white p-6 shadow" @submit.prevent="submit">
            <div>
                <label class="block text-sm font-medium text-slate-700">Description</label>
                <input
                    v-model="form.description"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
                <p v-if="errors.description" class="mt-1 text-sm text-rose-600">{{ errors.description[0] }}</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700">Amount</label>
                <input
                    v-model="form.amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
                <p v-if="errors.amount" class="mt-1 text-sm text-rose-600">{{ errors.amount[0] }}</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700">Category</label>
                <select
                    v-model="form.category_id"
                    required
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                >
                    <option value="">Select category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </option>
                </select>
                <p v-if="errors.category_id" class="mt-1 text-sm text-rose-600">{{ errors.category_id[0] }}</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700">Type</label>
                <select
                    v-model="form.type"
                    required
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                >
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                </select>
                <p v-if="errors.type" class="mt-1 text-sm text-rose-600">{{ errors.type[0] }}</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-slate-700">Transaction date</label>
                <input
                    v-model="form.transaction_date"
                    type="datetime-local"
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
                <p v-if="errors.transaction_date" class="mt-1 text-sm text-rose-600">{{ errors.transaction_date[0] }}</p>
            </div>

            <div class="flex items-center gap-3">
                <button
                    type="submit"
                    class="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-300"
                    :disabled="saving"
                >
                    {{ saving ? 'Saving...' : 'Update transaction' }}
                </button>
                <router-link :to="`/transactions/${route.params.id}`" class="text-sm font-medium text-slate-600 hover:text-slate-800">
                    Cancel
                </router-link>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const form = reactive({
    description: '',
    amount: '',
    category_id: '',
    type: 'debit',
    transaction_date: '',
});

const errors = reactive({});
const categories = ref([]);
const loading = ref(true);
const saving = ref(false);

const loadTransaction = async () => {
    try {
        const { data } = await axios.get(`/api/transactions/${route.params.id}`);
        const transaction = data.data ?? data;
        
        form.description = transaction.description || '';
        form.amount = transaction.amount || '';
        form.category_id = transaction.category_id || '';
        form.type = transaction.type || 'debit';
        form.transaction_date = transaction.transaction_date ? new Date(transaction.transaction_date).toISOString().slice(0, 16) : '';
    } catch (error) {
        console.error('Error loading transaction:', error);
    } finally {
        loading.value = false;
    }
};

const loadCategories = async () => {
    try {
        const { data } = await axios.get('/api/transactions', { params: { per_page: 1 } });
        categories.value = data.categories?.data ?? data.categories ?? [];
    } catch (error) {
        console.error('Error loading categories:', error);
    }
};

const submit = async () => {
    saving.value = true;
    Object.keys(errors).forEach((key) => delete errors[key]);

    try {
        const payload = { ...form };
        if (!payload.transaction_date) {
            payload.transaction_date = null;
        }

        const { data } = await axios.put(`/api/transactions/${route.params.id}`, payload);
        router.push(`/transactions/${data.data?.id ?? data.id}`);
    } catch (error) {
        if (error.response?.status === 422) {
            Object.assign(errors, error.response.data.errors ?? {});
        }
    } finally {
        saving.value = false;
    }
};

onMounted(async () => {
    await Promise.all([loadTransaction(), loadCategories()]);
});
</script>