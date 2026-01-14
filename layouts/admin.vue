<template>
  <div class="min-h-screen bg-white dark:bg-[#191919] flex font-sans text-[#37352F] dark:text-[#D4D4D4]">
    <!-- Sidebar (Notion Style) -->
    <aside class="w-60 bg-[#F7F7F5] dark:bg-[#202020] border-r border-[#E1E1E1] dark:border-[#2F2F2F] fixed h-full z-10 flex flex-col transition-colors duration-300">
      
      <!-- Workspace Switcher / Brand -->
      <div class="h-12 flex items-center px-4 hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer mb-2 mx-2 mt-2 rounded">
        <div class="w-5 h-5 rounded flex items-center justify-center bg-[#E1E1E1] dark:bg-[#37352F] text-xs mr-2">
          R
        </div>
        <span class="font-medium text-sm truncate flex-1">RentBase Admin</span>
        <UIcon name="i-lucide-chevrons-up-down" class="w-4 h-4 text-[#91918E]" />
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 space-y-0.5 overflow-y-auto">
        
        <!-- Section: Workspace -->
        <div class="px-3 py-1 mt-4 mb-1 text-[11px] font-semibold text-[#91918E] uppercase tracking-wide">Workspace</div>
        
        <NuxtLink to="/admin" class="flex items-center gap-2.5 px-3 py-1.5 rounded text-[14px] text-[#5F5E5B] dark:text-[#9B9B9B] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#D4D4D4] transition-colors" active-class="!bg-[#EFEFEF] dark:!bg-[#37352F] !text-[#37352F] dark:!text-[#D4D4D4] font-medium">
          <UIcon name="i-lucide-layout-dashboard" class="w-4.5 h-4.5" />
          <span>Overview</span>
        </NuxtLink>

        <!-- Section: Databases -->
        <div class="px-3 py-1 mt-6 mb-1 text-[11px] font-semibold text-[#91918E] uppercase tracking-wide">Databases</div>
        
        <NuxtLink to="/admin/reviews" class="flex items-center gap-2.5 px-3 py-1.5 rounded text-[14px] text-[#5F5E5B] dark:text-[#9B9B9B] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#D4D4D4] transition-colors" active-class="!bg-[#EFEFEF] dark:!bg-[#37352F] !text-[#37352F] dark:!text-[#D4D4D4] font-medium">
          <UIcon name="i-lucide-message-square" class="w-4.5 h-4.5" />
          <span>Reviews</span>
        </NuxtLink>

        <NuxtLink to="/admin/contracts" class="flex items-center gap-2.5 px-3 py-1.5 rounded text-[14px] text-[#5F5E5B] dark:text-[#9B9B9B] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#D4D4D4] transition-colors" active-class="!bg-[#EFEFEF] dark:!bg-[#37352F] !text-[#37352F] dark:!text-[#D4D4D4] font-medium">
          <UIcon name="i-lucide-file-text" class="w-4.5 h-4.5" />
          <span>Contracts</span>
        </NuxtLink>
        
        <NuxtLink to="/admin/deposits" class="flex items-center gap-2.5 px-3 py-1.5 rounded text-[14px] text-[#5F5E5B] dark:text-[#9B9B9B] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#D4D4D4] transition-colors" active-class="!bg-[#EFEFEF] dark:!bg-[#37352F] !text-[#37352F] dark:!text-[#D4D4D4] font-medium">
          <UIcon name="i-lucide-camera" class="w-4.5 h-4.5" />
          <span>Condition Reports</span>
        </NuxtLink>

        <!-- Section: Agents -->
        <div class="px-3 py-1 mt-6 mb-1 text-[11px] font-semibold text-[#91918E] uppercase tracking-wide">Agents</div>
        
        <NuxtLink to="/admin/agents/claims" class="flex items-center gap-2.5 px-3 py-1.5 rounded text-[14px] text-[#5F5E5B] dark:text-[#9B9B9B] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#D4D4D4] transition-colors" active-class="!bg-[#EFEFEF] dark:!bg-[#37352F] !text-[#37352F] dark:!text-[#D4D4D4] font-medium">
          <UIcon name="i-lucide-user-check" class="w-4.5 h-4.5" />
          <span>Agent Claims</span>
        </NuxtLink>
      </nav>

      <!-- User / Logout -->
      <div class="p-2 border-t border-[#E1E1E1] dark:border-[#2F2F2F] mt-auto">
        <button @click="logout" class="flex items-center gap-2.5 px-3 py-1.5 w-full rounded text-[14px] text-[#5F5E5B] dark:text-[#9B9B9B] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#D4D4D4] transition-colors text-left group">
          <UIcon name="i-lucide-log-out" class="w-4.5 h-4.5 group-hover:text-red-500" />
          <span class="group-hover:text-red-600 dark:group-hover:text-red-400">Log out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 ml-60 min-h-screen">
      <!-- Notion-style Top Bar -->
      <header class="h-12 sticky top-0 bg-white dark:bg-[#191919] z-20 flex items-center px-4 justify-between">
        <!-- Breadcrumbs -->
        <div class="flex items-center gap-2 text-sm text-[#37352F] dark:text-[#D4D4D4]">
           <span class="opacity-60 hover:opacity-100 cursor-pointer hover:underline underline-offset-2">{{ pageTitle }}</span>
        </div>
        
        <div class="flex items-center gap-2">
           <ColorSchemeButton />
        </div>
      </header>

      <!-- Page Body -->
      <div class="px-12 py-8 max-w-5xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Overview'
  if (path.includes('/reviews')) return 'Reviews Database'
  if (path.includes('/contracts')) return 'Contracts Database'
  if (path.includes('/deposits')) return 'Condition Reports'
  if (path.includes('/agents/claims')) return 'Agent Claims'
  return 'Dashboard'
})

async function logout() {
  try {
    await $fetch('/api/admin/auth/logout', { method: 'POST' })
  } catch (e) {
    console.error('Logout error', e)
  } finally {
    router.push('/admin/login')
  }
}
</script>
