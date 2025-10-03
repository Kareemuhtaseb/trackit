<template>
    <div class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
        <h1 class="mb-6 text-2xl font-bold text-center text-primary-600">Create your account</h1>

        <form class="space-y-4" @submit.prevent="submit">
            <div>
                <label for="name" class="block text-sm font-medium text-slate-700">Name</label>
                <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    autocomplete="name"
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
                <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    autocomplete="email"
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    required
                    autocomplete="new-password"
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
            </div>

            <div>
                <label for="password_confirmation" class="block text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    required
                    autocomplete="new-password"
                    class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                />
            </div>

            <p v-if="auth.error" class="text-sm text-rose-600">{{ auth.error }}</p>

            <button
                type="submit"
                class="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-300"
                :disabled="auth.loading"
            >
                {{ auth.loading ? 'Creating account...' : 'Create account' }}
            </button>
        </form>

        <p class="mt-6 text-center text-sm text-slate-600">
            Already have an account?
            <router-link to="/login" class="font-semibold text-primary-600 hover:text-primary-700">
                Sign in
            </router-link>
        </p>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const submit = async () => {
    try {
        await auth.register(form);
        router.push('/');
    } catch (error) {
        // handled centrally
    }
};
</script>
