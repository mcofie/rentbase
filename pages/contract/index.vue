<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Minimalist Navbar -->
      <nav class="max-w-5xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <span class="text-white text-xl">⚡</span>
          </div>
          <span class="text-2xl font-black text-stone-900 dark:text-white tracking-tighter">RentBase</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <ColorSchemeButton />
          <UserDropdown v-if="user" />
          <NuxtLink v-else to="/auth/login" class="text-sm font-black text-stone-900 dark:text-white uppercase tracking-widest hover:text-emerald-500 transition-colors">Sign In</NuxtLink>
        </div>
      </nav>

      <main class="flex-grow flex flex-col items-center justify-center px-6 py-20">
        <div class="max-w-3xl w-full text-center animate-fade-in">
           <p class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-8">Pocket Lawyer Protocol</p>
           
           <h1 class="text-5xl sm:text-7xl font-black text-stone-900 dark:text-white mb-8 tracking-tighter leading-[0.95] text-balance">
             Contracts on <br/>
             <span class="text-stone-400">Auto-pilot.</span>
           </h1>
           
           <p class="text-stone-500 dark:text-stone-400 text-xl font-medium max-w-xl mx-auto leading-relaxed mb-12 text-balance">
             Swift, legally-binding tenancy agreements generated in minutes. No lawyers, no delays, no shocks.
           </p>

           <div class="flex flex-col items-center gap-6 mb-20">
              <NuxtLink to="/contract/new" class="w-full sm:w-auto px-12 py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xl font-black rounded-full hover:scale-105 transition-transform shadow-2xl shadow-stone-900/10">
                Create Agreement
              </NuxtLink>
              <div class="flex items-center gap-2">
                 <span class="text-[10px] font-black text-stone-300 uppercase tracking-widest">Protocol Fee:</span>
                 <span class="text-[10px] font-black text-stone-900 dark:text-white uppercase tracking-widest">GH₵ 40</span>
              </div>
           </div>

           <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t border-stone-200 dark:border-stone-800 pt-20">
              <div class="space-y-4">
                <p class="text-2xl">📝</p>
                <h3 class="text-sm font-black text-stone-900 dark:text-white uppercase tracking-widest">Expert Terms</h3>
                <p class="text-stone-500 dark:text-stone-400 text-xs font-medium leading-relaxed">Localized legal standards for Ghana.</p>
              </div>
              <div class="space-y-4">
                <p class="text-2xl">⚡</p>
                <h3 class="text-sm font-black text-stone-900 dark:text-white uppercase tracking-widest">Instant Mint</h3>
                <p class="text-stone-500 dark:text-stone-400 text-xs font-medium leading-relaxed">Ready to sign and share immediately.</p>
              </div>
              <div class="space-y-4">
                <p class="text-2xl">🛡️</p>
                <h3 class="text-sm font-black text-stone-900 dark:text-white uppercase tracking-widest">Immutable</h3>
                <p class="text-stone-500 dark:text-stone-400 text-xs font-medium leading-relaxed">Tamper-proof digital records.</p>
              </div>
           </div>
        </div>
      </main>

      <footer class="py-12 border-t border-stone-200 dark:border-stone-800 mt-auto">
         <div class="max-w-5xl mx-auto px-6 flex items-center justify-between opacity-40">
            <span class="font-bold text-stone-900 dark:text-white tracking-widest text-[10px] uppercase">RentBase</span>
            <p class="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em]">© 2025</p>
         </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
