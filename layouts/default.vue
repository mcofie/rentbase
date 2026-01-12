<template>
  <div class="min-h-screen bg-white dark:bg-stone-950 transition-colors duration-300 font-sans text-stone-900 dark:text-stone-100 selection:bg-stone-200 selection:text-black">
    
    <!-- Navigation (Notion Style: Simple, Solid) -->
    <header class="sticky top-0 z-50 w-full bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-white border border-stone-200 dark:border-stone-700">
             <span class="text-xl">⚡</span>
          </div>
          <span class="text-lg font-bold tracking-tight group-hover:underline decoration-stone-400 underline-offset-4">RentBase</span>
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-2 text-[14px] font-medium text-stone-600 dark:text-stone-400">
          <NuxtLink to="/contract" class="hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 px-3 py-2 rounded-md transition-all">Contract</NuxtLink>
          <NuxtLink to="/deposit" class="hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 px-3 py-2 rounded-md transition-all">Deposit</NuxtLink>
          <NuxtLink to="/retrieve" class="hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 px-3 py-2 rounded-md transition-all">Retrieve</NuxtLink>
          <NuxtLink to="/agent" class="hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 px-3 py-2 rounded-md transition-all">Verify</NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <ColorSchemeButton />
          
          <template v-if="user">
             <UserDropdown />
          </template>
          <template v-else>
            <NuxtLink 
              to="/auth/login"
              class="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#0075DE] hover:bg-[#005BAB] rounded-lg transition-colors"
            >
              Log in
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer (Minimal) -->
    <footer class="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 py-16 mt-auto">
      <div class="max-w-6xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div class="col-span-2 md:col-span-1">
             <div class="flex items-center gap-2 mb-4">
               <span class="font-bold text-lg">RentBase</span>
             </div>
             <p class="text-stone-500 text-sm leading-relaxed">
               Simple, fast, and secure rental tools for modern living.
             </p>
          </div>
          
          <div>
            <h4 class="font-bold text-stone-900 dark:text-white mb-4 text-sm">Product</h4>
            <ul class="space-y-3 text-sm text-stone-500">
              <li><NuxtLink to="/contract" class="hover:text-stone-900 dark:hover:text-white transition-colors">Contracts</NuxtLink></li>
              <li><NuxtLink to="/deposit" class="hover:text-stone-900 dark:hover:text-white transition-colors">Deposits</NuxtLink></li>
              <li><NuxtLink to="/agent" class="hover:text-stone-900 dark:hover:text-white transition-colors">Verify Agents</NuxtLink></li>
            </ul>
          </div>

          <div>
             <h4 class="font-bold text-stone-900 dark:text-white mb-4 text-sm">Resources</h4>
             <ul class="space-y-3 text-sm text-stone-500">
               <li><a href="#" class="hover:text-stone-900 dark:hover:text-white transition-colors">Guide</a></li>
               <li><a href="#" class="hover:text-stone-900 dark:hover:text-white transition-colors">Templates</a></li>
               <li><a href="#" class="hover:text-stone-900 dark:hover:text-white transition-colors">Support</a></li>
             </ul>
          </div>
          
          <div>
             <h4 class="font-bold text-stone-900 dark:text-white mb-4 text-sm">Company</h4>
             <ul class="space-y-3 text-sm text-stone-500">
               <li><a href="#" class="hover:text-stone-900 dark:hover:text-white transition-colors">Privacy</a></li>
               <li><a href="#" class="hover:text-stone-900 dark:hover:text-white transition-colors">Terms</a></li>
             </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <p class="text-xs text-stone-400">© 2025 RentBase.</p>
          <div class="flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
             <UIcon name="i-simple-icons-bsky" class="w-4 h-4" />
             <UIcon name="i-simple-icons-github" class="w-4 h-4" />
          </div>
        </div>
      </div>
    </footer>

    <!-- PWA Install Prompt -->
    <InstallPWAPrompt />
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
</script>

<style scoped>
/* Scoped layout styles if needed */
</style>
