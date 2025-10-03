<template>
    <div class="space-y-6">
        <div>
            <h1 class="text-2xl font-semibold text-slate-900">Edit income</h1>
            <p class="text-sm text-slate-500">Update income entry information.</p>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="text-sm text-slate-500">Loading...</div>
        </div>

        <form v-else class="space-y-4 rounded-lg bg-white p-6 shadow" @submit.prevent="submit">
            <div>
                <label class="block text-sm font-medium text-slate-700">Source</label>
                <input
                    v-model="form.source"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
                <p v-if="errors.source" class="mt-1 text-sm text-rose-600">{{ errors.source[0] }}</p>
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
                <label class="block text-sm font-medium text-slate-700">Received at</label>
                <input
                    v-model="form.received_at"
                    type="datetime-local"
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
                <p v-if="errors.received_at" class="mt-1 text-sm text-rose-600">{{ errors.received_at[0] }}</p>
            </div>

            <div class="flex items-center gap-3">
                <button
                    type="submit"
                    class="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-300"
                    :disabled="saving"
                >
                    {{ saving ? 'Saving...' : 'Update income' }}
                </button>
                <router-link :to="`/incomes/${route.params.id}`" class="text-sm font-medium text-slate-600 hover:text-slate-800">
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
    source: '',
    amount: '',
    category_id: '',
    received_at: '',
});

const errors = reactive({});
const categories = ref([]);
const loading = ref(true);
const saving = ref(false);

const loadIncome = async () => {
    try {
        const { data } = await axios.get(`/api/incomes/${route.params.id}`);
        const income = data.data ?? data;
        
        form.source = income.source || '';
        form.amount = income.amount || '';
        form.category_id = income.category_id || '';
        form.received_at = income.received_at ? new Date(income.received_at).toISOString().slice(0, 16) : '';
    } catch (error) {
        console.error('Error loading income:', error);
    } finally {
        loading.value = false;
    }
};

const loadCategories = async () => {
    try {
        const { data } = await axios.get('/api/incomes', { params: { per_page: 1 } });
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
        if (!payload.received_at) {
            payload.received_at = null;
        }

        const { data } = await axios.put(`/api/incomes/${route.params.id}`, payload);
        router.push(`/incomes/${data.data?.id ?? data.id}`);
    } catch (error) {
        if (error.response?.status === 422) {
            Object.assign(errors, error.response.data.errors ?? {});
        }
    } finally {
        saving.value = false;
    }
};

onMounted(async () => {
    await Promise.all([loadIncome(), loadCategories()]);
});
</script>