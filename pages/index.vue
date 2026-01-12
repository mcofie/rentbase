<template>
  <div class="overflow-x-hidden">
    <!-- Hero Section -->
    <section class="relative pt-24 pb-20 sm:pt-32 sm:pb-24 px-6">
      <div class="max-w-4xl mx-auto text-center animate-fade-in">
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold text-stone-900 dark:text-white mb-8 tracking-tight leading-[1.1] font-serif">
          Rent with<br/>Confidence.
        </h1>
        <p class="text-xl sm:text-2xl text-stone-500 dark:text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed font-normal">
          The all-in-one workspace to verify agents, generate contracts, and secure deposits. Simple, fast, and legally binding.
        </p>
        
        <!-- Search Component -->
        <div class="max-w-xl mx-auto mb-16 relative z-10">
          <AgentSearchBar />
          <p class="text-xs text-stone-400 mt-4 font-medium">
             Try searching <span class="text-stone-900 dark:text-white font-mono">054 123 4567</span> or <span class="text-stone-900 dark:text-white cursor-pointer hover:underline" @click="$router.push('/agent')">verify an agent</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Value Props (Notion-style Grid) -->
    <section class="py-20 bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
      <div class="max-w-6xl mx-auto px-6">
        <div class="mb-12">
          <h2 class="text-3xl font-bold text-stone-900 dark:text-white mb-4 font-serif tracking-tight">Everything you need to rent</h2>
          <p class="text-lg text-stone-500">Powerful tools that work together seamlessly.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <!-- Card 1: Contracts -->
          <NuxtLink to="/contract" class="group block p-6 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors">
            <div class="w-10 h-10 rounded-md bg-[#D3E5EF] dark:bg-blue-900/40 flex items-center justify-center text-stone-800 dark:text-blue-200 mb-4">
              <UIcon name="i-lucide-file-text" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-bold text-stone-900 dark:text-white mb-2">Contracts</h3>
            <p class="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Generate bulletproof tenancy agreements in seconds. Customizable and legally binding.
            </p>
          </NuxtLink>

          <!-- Card 2: Deposits -->
          <NuxtLink to="/deposit" class="group block p-6 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors">
            <div class="w-10 h-10 rounded-md bg-[#E8DEEE] dark:bg-purple-900/40 flex items-center justify-center text-stone-800 dark:text-purple-200 mb-4">
               <UIcon name="i-lucide-camera" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-bold text-stone-900 dark:text-white mb-2">Condition Reports</h3>
            <p class="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Document property conditions with photos. Secure your deposit with impartial evidence.
            </p>
          </NuxtLink>

          <!-- Card 3: Agents -->
          <NuxtLink to="/agent" class="group block p-6 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors">
            <div class="w-10 h-10 rounded-md bg-[#FDECC8] dark:bg-amber-900/40 flex items-center justify-center text-stone-800 dark:text-amber-200 mb-4">
               <UIcon name="i-lucide-users" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-bold text-stone-900 dark:text-white mb-2">Agent Verification</h3>
            <p class="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
              Check agent reviews and history before you engage. Build trust with community data.
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Trust Section (Minimal) -->
    <section class="py-20 border-t border-stone-200 dark:border-stone-800">
      <div class="max-w-4xl mx-auto px-6 text-center">
         <p class="text-xs font-bold text-stone-400 uppercase tracking-widest mb-10">Trusted by modern renters and landlords</p>
         <div class="flex flex-wrap justify-center gap-12 sm:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-building" class="w-6 h-6" />
              <span class="font-bold text-xl">EstateHub</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-home" class="w-6 h-6" />
              <span class="font-bold text-xl">RentFlow</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-shield" class="w-6 h-6" />
              <span class="font-bold text-xl">SecureHome</span>
            </div>
         </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="py-24 bg-stone-50 dark:bg-stone-900/50">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-6 font-serif tracking-tight">Start renting simply.</h2>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
           <NuxtLink to="/contract" class="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-stone-900 dark:bg-white dark:text-stone-900 rounded-lg hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors shadow-sm">
             Create a Contract
           </NuxtLink>
           <NuxtLink to="/agent" class="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-stone-900 dark:text-white bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors">
             Verify an Agent
           </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

const showAuthModal = ref(false)

function handleAuthSuccess() {
  // Logic after auth
}

// Add animation classes
useHead({
  style: [
    {
      innerHTML: `
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `
    }
  ]
})
</script>
