<template>
  <div class="px-6 py-12 md:py-20 animate-fade-in">
    <div class="max-w-3xl mx-auto text-center">
       <div class="w-16 h-16 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center mx-auto mb-8">
          <span class="text-3xl">📝</span>
       </div>
       
       <h1 class="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-6 font-serif tracking-tight">
         Tenancy Agreements,<br/>Simplified.
       </h1>
       
       <p class="text-stone-500 dark:text-stone-400 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed mb-10">
         Generate legally-binding contracts in minutes. No lawyers, no delays, just simple terms.
       </p>

       <div class="flex flex-col items-center gap-6 mb-20">
          <NuxtLink to="/contract/new" class="w-full sm:w-auto px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-lg font-medium rounded-lg hover:translate-y-[-2px] transition-transform shadow-sm flex items-center justify-center gap-2">
            <span>Create Agreement</span>
            <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
          </NuxtLink>
          <p class="text-sm font-medium text-stone-400">
            Standard Protocol Fee: <span class="text-stone-900 dark:text-white">GH₵ 40</span>
          </p>
       </div>

       <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div class="p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50">
            <div class="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-md flex items-center justify-center mb-4">
              <UIcon name="i-lucide-scale" class="w-5 h-5 text-stone-900 dark:text-white" />
            </div>
            <h3 class="font-bold text-stone-900 dark:text-white mb-2">Expert Terms</h3>
            <p class="text-stone-500 text-sm leading-relaxed">Localized legal standards designed specifically for Ghanaian tenancy laws.</p>
          </div>
          <div class="p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50">
            <div class="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-md flex items-center justify-center mb-4">
              <UIcon name="i-lucide-zap" class="w-5 h-5 text-stone-900 dark:text-white" />
            </div>
            <h3 class="font-bold text-stone-900 dark:text-white mb-2">Instant</h3>
            <p class="text-stone-500 text-sm leading-relaxed">Generate, sign, and share your agreement in less than 5 minutes.</p>
          </div>
          <div class="p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50">
            <div class="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-md flex items-center justify-center mb-4">
              <UIcon name="i-lucide-lock" class="w-5 h-5 text-stone-900 dark:text-white" />
            </div>
            <h3 class="font-bold text-stone-900 dark:text-white mb-2">Secure</h3>
            <p class="text-stone-500 text-sm leading-relaxed">Digital signatures and tamper-proof PDF records for your peace of mind.</p>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta if needed
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
