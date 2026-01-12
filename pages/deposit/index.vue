<template>
  <div class="px-6 py-12 md:py-20 animate-fade-in">
    <div class="max-w-3xl mx-auto text-center">
       <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mx-auto mb-8">
          <span class="text-3xl">🛡️</span>
       </div>
       
       <h1 class="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-6 font-serif tracking-tight">
         Get your <br/>money back.
       </h1>
       
       <p class="text-stone-500 dark:text-stone-400 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed mb-10">
         Professional, timestamped condition reports that protect your security deposit from unfair deductions.
       </p>

       <div class="flex flex-col items-center gap-6 mb-20">
          <NuxtLink to="/deposit/new" class="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white text-lg font-medium rounded-lg hover:bg-emerald-600 hover:translate-y-[-2px] transition-all shadow-sm flex items-center justify-center gap-2">
            <span>Secure Deposit</span>
            <UIcon name="i-lucide-arrow-right" class="w-5 h-5" />
          </NuxtLink>
          <p class="text-sm font-medium text-stone-400">
            Standard Protocol Fee: <span class="text-stone-900 dark:text-white">GH₵ 25</span>
          </p>
       </div>

       <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div class="p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50">
            <div class="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-md flex items-center justify-center mb-4">
              <UIcon name="i-lucide-camera" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 class="font-bold text-stone-900 dark:text-white mb-2">Photo Logs</h3>
            <p class="text-stone-500 text-sm leading-relaxed">High-res, timestamped proof of every defect and appliance before you move in.</p>
          </div>
          <div class="p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50">
            <div class="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-md flex items-center justify-center mb-4">
              <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 class="font-bold text-stone-900 dark:text-white mb-2">Evidence</h3>
            <p class="text-stone-500 text-sm leading-relaxed">Tamper-proof PDF reports that serve as hard evidence in any dispute.</p>
          </div>
          <div class="p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50">
            <div class="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-md flex items-center justify-center mb-4">
              <UIcon name="i-lucide-briefcase" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 class="font-bold text-stone-900 dark:text-white mb-2">Legal Ready</h3>
            <p class="text-stone-500 text-sm leading-relaxed">Structured specifically for Rent Control standards to protect your rights.</p>
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
