import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/auth/LoginView.vue'),
        meta: { guestOnly: true, title: 'Sign in' },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/auth/RegisterView.vue'),
        meta: { guestOnly: true, title: 'Create account' },
    },
    {
        path: '/',
        component: () => import('../components/AppLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('../views/dashboard/DashboardView.vue'),
                meta: {
                    title: 'Dashboard',
                    subtitle: 'Overview of your financial activity',
                },
            },
            {
                path: 'incomes',
                name: 'incomes.index',
                component: () => import('../views/incomes/IncomesIndexView.vue'),
                meta: {
                    title: 'Incomes',
                    subtitle: 'Review and filter your income records',
                },
            },
            {
                path: 'incomes/new',
                name: 'incomes.create',
                component: () => import('../views/incomes/IncomesCreateView.vue'),
                meta: {
                    title: 'New income',
                    subtitle: 'Record a new income entry',
                },
            },
            {
                path: 'incomes/:id',
                name: 'incomes.show',
                component: () => import('../views/incomes/IncomesShowView.vue'),
                props: true,
                meta: {
                    title: 'Income details',
                },
            },
            {
                path: 'incomes/:id/edit',
                name: 'incomes.edit',
                component: () => import('../views/incomes/IncomesEditView.vue'),
                props: true,
                meta: {
                    title: 'Edit income',
                },
            },
            {
                path: 'transactions',
                name: 'transactions.index',
                component: () => import('../views/transactions/TransactionsIndexView.vue'),
                meta: {
                    title: 'Transactions',
                    subtitle: 'Monitor debits and credits',
                },
            },
            {
                path: 'transactions/new',
                name: 'transactions.create',
                component: () => import('../views/transactions/TransactionsCreateView.vue'),
                meta: {
                    title: 'New transaction',
                    subtitle: 'Log a new debit or credit',
                },
            },
            {
                path: 'transactions/:id',
                name: 'transactions.show',
                component: () => import('../views/transactions/TransactionsShowView.vue'),
                props: true,
                meta: {
                    title: 'Transaction details',
                },
            },
            {
                path: 'transactions/:id/edit',
                name: 'transactions.edit',
                component: () => import('../views/transactions/TransactionsEditView.vue'),
                props: true,
                meta: {
                    title: 'Edit transaction',
                },
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

let isUserFetched = false;

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (!isUserFetched) {
        await authStore.fetchUser();
        isUserFetched = true;
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next({ name: 'login', query: { redirect: to.fullPath } });
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
        return next({ name: 'dashboard' });
    }

    return next();
});

const defaultTitle = import.meta.env?.VITE_APP_NAME ?? 'Trackit';

router.afterEach((to) => {
    const title = to.meta.title ? `${to.meta.title} · ${defaultTitle}` : defaultTitle;
    document.title = title;
});

export default router;
