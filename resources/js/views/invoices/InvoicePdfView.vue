<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold text-slate-900">Invoice #{{ invoiceNumber }}</h1>
                <p class="text-sm text-slate-500">Invoice details and PDF generation.</p>
            </div>
            <div class="flex items-center gap-3">
                <button
                    @click="generatePdf"
                    class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
                    :disabled="loading"
                >
                    {{ loading ? 'Generating...' : 'Generate PDF' }}
                </button>
                <router-link
                    to="/"
                    class="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200"
                >
                    Back to Dashboard
                </router-link>
            </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="text-sm text-slate-500">Loading...</div>
        </div>

        <div v-else-if="invoice" class="rounded-lg bg-white p-6 shadow">
            <div class="grid gap-6 md:grid-cols-2">
                <!-- Invoice Header -->
                <div>
                    <h2 class="text-lg font-semibold text-slate-800 mb-4">Invoice Details</h2>
                    <dl class="space-y-2">
                        <div>
                            <dt class="text-sm font-medium text-slate-500">Invoice Number</dt>
                            <dd class="text-sm text-slate-900">#{{ invoiceNumber }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-slate-500">Status</dt>
                            <dd class="text-sm">
                                <span :class="statusClass(invoice.status)">
                                    {{ invoice.status }}
                                </span>
                            </dd>
                        </div>
                        <div v-if="invoice.issue_date">
                            <dt class="text-sm font-medium text-slate-500">Issue Date</dt>
                            <dd class="text-sm text-slate-900">{{ formatDate(invoice.issue_date) }}</dd>
                        </div>
                        <div v-if="invoice.due_date">
                            <dt class="text-sm font-medium text-slate-500">Due Date</dt>
                            <dd class="text-sm text-slate-900">{{ formatDate(invoice.due_date) }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-slate-500">Total Amount</dt>
                            <dd class="text-lg font-semibold text-slate-900">{{ formatCurrency(invoice.total_amount) }}</dd>
                        </div>
                    </dl>
                </div>

                <!-- Project Details -->
                <div v-if="project">
                    <h2 class="text-lg font-semibold text-slate-800 mb-4">Project Information</h2>
                    <dl class="space-y-2">
                        <div>
                            <dt class="text-sm font-medium text-slate-500">Project Name</dt>
                            <dd class="text-sm text-slate-900">{{ project.name }}</dd>
                        </div>
                        <div v-if="project.client_name">
                            <dt class="text-sm font-medium text-slate-500">Client</dt>
                            <dd class="text-sm text-slate-900">{{ project.client_name }}</dd>
                        </div>
                        <div v-if="project.hourly_rate">
                            <dt class="text-sm font-medium text-slate-500">Hourly Rate</dt>
                            <dd class="text-sm text-slate-900">{{ formatCurrency(project.hourly_rate) }}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            <!-- Time Entries Summary -->
            <div v-if="timeEntries && timeEntries.length" class="mt-6">
                <h3 class="text-lg font-semibold text-slate-800 mb-4">Time Entries</h3>
                <div class="overflow-hidden rounded-lg border border-slate-200">
                    <table class="min-w-full divide-y divide-slate-200">
                        <thead class="bg-slate-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hours</th>
                                <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200">
                            <tr v-for="entry in timeEntries" :key="entry.id">
                                <td class="px-4 py-3 text-sm text-slate-900">{{ formatDate(entry.date) }}</td>
                                <td class="px-4 py-3 text-sm text-slate-900">{{ entry.description }}</td>
                                <td class="px-4 py-3 text-sm text-slate-900">{{ entry.hours }}</td>
                                <td class="px-4 py-3 text-right text-sm text-slate-900">{{ formatCurrency(entry.amount) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div v-else class="rounded-lg bg-white p-6 shadow">
            <p class="text-sm text-slate-500">Invoice not found.</p>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const invoice = ref(null);
const project = ref(null);
const timeEntries = ref([]);
const loading = ref(true);

const invoiceNumber = computed(() => {
    if (!invoice.value?.id) return '';
    return String(invoice.value.id).padStart(5, '0');
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

const statusClass = (status) => {
    const baseClasses = 'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium';
    switch (status?.toLowerCase()) {
        case 'paid':
            return `${baseClasses} bg-green-100 text-green-800`;
        case 'pending':
            return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'overdue':
            return `${baseClasses} bg-red-100 text-red-800`;
        default:
            return `${baseClasses} bg-gray-100 text-gray-800`;
    }
};

const loadInvoice = async () => {
    try {
        const { data } = await axios.get(`/api/invoices/${route.params.id}`);
        invoice.value = data.data ?? data;
        project.value = data.project ?? null;
        timeEntries.value = data.time_entries ?? [];
    } catch (error) {
        console.error('Error loading invoice:', error);
    } finally {
        loading.value = false;
    }
};

const generatePdf = async () => {
    try {
        loading.value = true;
        const response = await axios.get(`/api/invoices/${route.params.id}/pdf`, {
            responseType: 'blob',
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${invoiceNumber.value}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadInvoice();
});
</script>
