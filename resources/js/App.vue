<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <AdminLayout>
      <router-view />
    </AdminLayout>
  </div>
</template>

<script setup>
import AdminLayout from './components/layout/AdminLayout.vue'
import { useSidebarProvider } from './composables/useSidebar'

// Initialize sidebar provider
useSidebarProvider()
</script>