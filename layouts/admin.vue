<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 flex font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 fixed h-full z-10 flex flex-col">
      <div class="p-8 border-b border-stone-100 dark:border-stone-800">
        <h1 class="font-black text-xl tracking-tighter uppercase text-stone-900 dark:text-white">RentBase <span class="text-emerald-500">Admin</span></h1>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <NuxtLink to="/admin" class="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-500 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors" active-class="bg-stone-100 dark:bg-stone-800 !text-stone-900 dark:!text-white">
          <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5" />
          <span>Overview</span>
        </NuxtLink>

        <div class="pt-4 pb-2 px-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Moderation</div>
        
        <NuxtLink to="/admin/reviews" class="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-500 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors" active-class="bg-stone-100 dark:bg-stone-800 !text-stone-900 dark:!text-white">
          <UIcon name="i-lucide-message-square-warning" class="w-5 h-5" />
          <span>Reviews</span>
        </NuxtLink>

        <div class="pt-4 pb-2 px-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Generated Assets</div>

        <NuxtLink to="/admin/contracts" class="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-500 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors" active-class="bg-stone-100 dark:bg-stone-800 !text-stone-900 dark:!text-white">
          <UIcon name="i-lucide-file-text" class="w-5 h-5" />
          <span>Contracts</span>
        </NuxtLink>
        
        <NuxtLink to="/admin/deposits" class="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-500 font-bold hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-white transition-colors" active-class="bg-stone-100 dark:bg-stone-800 !text-stone-900 dark:!text-white">
          <UIcon name="i-lucide-camera" class="w-5 h-5" />
          <span>Deposit Reports</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-stone-100 dark:border-stone-800">
        <button @click="logout" class="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          <UIcon name="i-lucide-log-out" class="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 ml-64 p-8 lg:p-12">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const router = useRouter()

async function logout() {
  await client.auth.signOut()
  router.push('/login')
}
</script>
