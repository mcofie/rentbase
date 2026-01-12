<template>
  <div class="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-fade-in relative z-10">
    <div class="text-center mb-16">
       <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-8">
          <span class="text-3xl">🔍</span>
       </div>
       
       <h1 class="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-6 font-serif tracking-tight">
         Trust, but verify.
       </h1>
       
       <p class="text-stone-500 dark:text-stone-400 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed mb-10">
         Avoid rental scams. Check an agent's trust score, verified identity, and past reviews before you pay any viewing fee.
       </p>

       <!-- Search Box -->
       <div class="max-w-md mx-auto relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <UIcon name="i-lucide-search" class="h-5 w-5 text-stone-400" />
          </div>
          <input
            v-model="searchQuery"
            type="tel"
            placeholder="Enter agent's phone number (054...)"
            class="block w-full pl-11 pr-4 py-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-lg focus:ring-2 focus:ring-stone-900 dark:focus:ring-white focus:border-transparent shadow-sm transition-all"
            @keyup.enter="handleSearch"
          />
          <button 
            @click="handleSearch"
            class="absolute inset-y-2 right-2 px-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-medium rounded-md text-sm hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors"
          >
            Verify
          </button>
       </div>
       <p class="text-xs text-stone-400 mt-3">
         Try searching <button class="underline decoration-dotted" @click="searchQuery = '0540000000'; handleSearch()">0540000000</button>
       </p>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-20">
       <div class="p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50">
         <div class="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-md flex items-center justify-center mb-4">
           <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
         </div>
         <h3 class="font-bold text-stone-900 dark:text-white mb-2">Verified Identity</h3>
         <p class="text-stone-500 text-sm leading-relaxed">We verify official Ghana Cards to ensure you're dealing with a real person, not a ghost.</p>
       </div>
       <div class="p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50">
         <div class="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-md flex items-center justify-center mb-4">
           <UIcon name="i-lucide-bar-chart-3" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
         </div>
         <h3 class="font-bold text-stone-900 dark:text-white mb-2">Trust Score</h3>
         <p class="text-stone-500 text-sm leading-relaxed">Agents earn points for every successful deal and lose points for reported scams.</p>
       </div>
       <div class="p-6 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50">
         <div class="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-md flex items-center justify-center mb-4">
           <UIcon name="i-lucide-message-square" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
         </div>
         <h3 class="font-bold text-stone-900 dark:text-white mb-2">Real Reviews</h3>
         <p class="text-stone-500 text-sm leading-relaxed">Read uncensored feedback from previous tenants who have interacted with this agent.</p>
       </div>
    </div>

    <!-- Agent CTA -->
    <div class="bg-stone-900 dark:bg-white rounded-lg p-8 md:p-12 text-center relative overflow-hidden">
      <div class="relative z-10">
        <h2 class="text-2xl md:text-3xl font-bold text-white dark:text-stone-900 mb-4 font-serif">Are you an Agent?</h2>
        <p class="text-stone-300 dark:text-stone-600 mb-8 max-w-lg mx-auto">
          Build your professional reputation. Claim your profile today to start collecting verified reviews and close more deals.
        </p>
        <NuxtLink 
          to="/auth/register?type=agent"
          class="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-medium rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          Claim Your Profile
        </NuxtLink>
      </div>
      
      <!-- Decorative pattern -->
      <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  if (!searchQuery.value) return
  
  // Basic cleaning of phone number input
  const cleanPhone = searchQuery.value.replace(/\D/g, '')
  
  if (cleanPhone.length < 9) {
    // Ideally show a toast here, but simple alert for now or just return
    return
  }
  
  router.push(`/agent/${cleanPhone}`)
}
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
