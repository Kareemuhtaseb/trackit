<template>
    <div class="space-y-6">
        <header>
            <h1 class="text-2xl font-semibold text-slate-900">Profile</h1>
            <p class="text-sm text-slate-500">Manage your account settings and preferences.</p>
        </header>

        <!-- Update Profile Information -->
        <div class="rounded-lg bg-white p-6 shadow">
            <h2 class="text-lg font-semibold text-slate-800 mb-4">Profile Information</h2>
            
            <form class="space-y-4" @submit.prevent="updateProfile">
                <div>
                    <label class="block text-sm font-medium text-slate-700">Name</label>
                    <input
                        v-model="profileForm.name"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                    />
                    <p v-if="profileErrors.name" class="mt-1 text-sm text-rose-600">{{ profileErrors.name[0] }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700">Email</label>
                    <input
                        v-model="profileForm.email"
                        type="email"
                        required
                        class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                    />
                    <p v-if="profileErrors.email" class="mt-1 text-sm text-rose-600">{{ profileErrors.email[0] }}</p>
                </div>

                <div class="flex items-center gap-3">
                    <button
                        type="submit"
                        class="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-300"
                        :disabled="profileSaving"
                    >
                        {{ profileSaving ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Update Password -->
        <div class="rounded-lg bg-white p-6 shadow">
            <h2 class="text-lg font-semibold text-slate-800 mb-4">Update Password</h2>
            
            <form class="space-y-4" @submit.prevent="updatePassword">
                <div>
                    <label class="block text-sm font-medium text-slate-700">Current Password</label>
                    <input
                        v-model="passwordForm.current_password"
                        type="password"
                        required
                        class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                    />
                    <p v-if="passwordErrors.current_password" class="mt-1 text-sm text-rose-600">{{ passwordErrors.current_password[0] }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700">New Password</label>
                    <input
                        v-model="passwordForm.password"
                        type="password"
                        required
                        class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                    />
                    <p v-if="passwordErrors.password" class="mt-1 text-sm text-rose-600">{{ passwordErrors.password[0] }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input
                        v-model="passwordForm.password_confirmation"
                        type="password"
                        required
                        class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-200"
                    />
                    <p v-if="passwordErrors.password_confirmation" class="mt-1 text-sm text-rose-600">{{ passwordErrors.password_confirmation[0] }}</p>
                </div>

                <div class="flex items-center gap-3">
                    <button
                        type="submit"
                        class="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-300"
                        :disabled="passwordSaving"
                    >
                        {{ passwordSaving ? 'Updating...' : 'Update Password' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Delete Account -->
        <div class="rounded-lg bg-white p-6 shadow">
            <h2 class="text-lg font-semibold text-slate-800 mb-4">Delete Account</h2>
            <p class="text-sm text-slate-600 mb-4">
                Once your account is deleted, all of its resources and data will be permanently deleted. 
                Before deleting your account, please download any data or information that you wish to retain.
            </p>
            
            <button
                type="button"
                class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                :disabled="deleteSaving"
                @click="confirmDelete"
            >
                {{ deleteSaving ? 'Deleting...' : 'Delete Account' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import api from '../../utils/axios';

const router = useRouter();
const auth = useAuthStore();

const profileForm = reactive({
    name: '',
    email: '',
});

const passwordForm = reactive({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const profileErrors = reactive({});
const passwordErrors = reactive({});
const profileSaving = ref(false);
const passwordSaving = ref(false);
const deleteSaving = ref(false);

const loadProfile = () => {
    if (auth.user) {
        profileForm.name = auth.user.name || '';
        profileForm.email = auth.user.email || '';
    }
};

const updateProfile = async () => {
    profileSaving.value = true;
    Object.keys(profileErrors).forEach((key) => delete profileErrors[key]);

    try {
        const { data } = await api.put('/profile', profileForm);
        auth.user = data.data ?? data;
    } catch (error) {
        if (error.response?.status === 422) {
            Object.assign(profileErrors, error.response.data.errors ?? {});
        }
    } finally {
        profileSaving.value = false;
    }
};

const updatePassword = async () => {
    passwordSaving.value = true;
    Object.keys(passwordErrors).forEach((key) => delete passwordErrors[key]);

    try {
        await api.put('/password', passwordForm);
        passwordForm.current_password = '';
        passwordForm.password = '';
        passwordForm.password_confirmation = '';
    } catch (error) {
        if (error.response?.status === 422) {
            Object.assign(passwordErrors, error.response.data.errors ?? {});
        }
    } finally {
        passwordSaving.value = false;
    }
};

const confirmDelete = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        deleteSaving.value = true;
        
        try {
            await api.delete('/profile');
            await auth.logout();
            router.push('/login');
        } catch (error) {
            console.error('Error deleting account:', error);
        } finally {
            deleteSaving.value = false;
        }
    }
};

onMounted(() => {
    loadProfile();
});
</script>
