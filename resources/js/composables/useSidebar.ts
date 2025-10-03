import { ref, provide, inject } from 'vue'

const SIDEBAR_KEY = Symbol('sidebar')

export function useSidebarProvider() {
  const isExpanded = ref(false)
  const isMobileOpen = ref(false)
  const isHovered = ref(false)
  const openSubmenu = ref(null)

  const toggleSidebar = () => {
    isExpanded.value = !isExpanded.value
  }

  const toggleMobileSidebar = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  const closeMobileSidebar = () => {
    isMobileOpen.value = false
  }

  const sidebarState = {
    isExpanded,
    isMobileOpen,
    isHovered,
    openSubmenu,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
  }

  provide(SIDEBAR_KEY, sidebarState)

  return sidebarState
}

export function useSidebar() {
  const sidebar = inject(SIDEBAR_KEY)
  if (!sidebar) {
    throw new Error('useSidebar must be used within a component that provides sidebar context')
  }
  return sidebar
}