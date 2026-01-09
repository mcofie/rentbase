<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300 antialiased">
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Minimalist Navbar -->
      <nav class="max-w-5xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <span class="text-white text-xl">⚡</span>
          </div>
          <span class="text-2xl font-black text-stone-900 dark:text-white tracking-tighter">RentBase</span>
        </NuxtLink>

        <div class="flex items-center gap-6">
          <div class="hidden md:flex items-center gap-8 text-sm font-bold text-stone-500 uppercase tracking-widest">
            <NuxtLink to="/contract" class="hover:text-emerald-500 transition-colors">Legal</NuxtLink>
            <NuxtLink to="/deposit" class="hover:text-emerald-500 transition-colors">Deposits</NuxtLink>
          </div>
          <div class="h-6 w-px bg-stone-200 dark:bg-stone-800 hidden md:block"></div>
          <div class="flex items-center gap-4">
            <ColorSchemeButton />
            <template v-if="user">
               <UserDropdown />
            </template>
            <template v-else>
              <NuxtLink 
                to="/auth/login"
                class="px-8 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black rounded-full hover:scale-105 transition-all text-sm shadow-xl shadow-stone-900/10"
              >
                Sign In
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>

      <main class="flex-grow flex flex-col items-center justify-center px-6 py-20 pb-40">
        <!-- Straightforward Hero -->
        <div class="text-center max-w-4xl mx-auto animate-fade-in">
           <h1 class="text-5xl sm:text-7xl lg:text-8xl font-black text-stone-900 dark:text-white mb-8 tracking-tighter leading-[0.95] text-balance">
             Rent with <br class="hidden sm:block"/>
             <span class="text-emerald-500">Confidence.</span>
           </h1>
           <p class="text-stone-500 dark:text-stone-400 text-xl sm:text-2xl font-medium max-w-2xl mx-auto leading-relaxed mb-16 text-balance">
             The essential protocol for verifying agents, drafting legal agreement, and securing your security deposit.
           </p>

           <!-- Primary Search Tool -->
           <div class="w-full max-w-lg mx-auto mb-20">
             <AgentSearchBar @write-review="handleWriteReview" @view-reviews="handleViewReviews" />
           </div>
        </div>

        <!-- Feature Pills (Adeton-like) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full animate-fade-in delay-100">
           <NuxtLink to="/contract" class="group bg-white dark:bg-stone-900 p-8 rounded-[40px] border border-stone-100 dark:border-stone-800 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/5">
              <div class="flex items-center justify-between mb-4">
                <div class="w-14 h-14 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📜</div>
                <UIcon name="i-lucide-arrow-up-right" class="w-6 h-6 text-stone-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h3 class="text-2xl font-black text-stone-900 dark:text-white mb-2 uppercase tracking-tighter">Pocket Lawyer</h3>
              <p class="text-stone-500 dark:text-stone-400 font-medium leading-relaxed">Swift, legal tenancy agreements.</p>
           </NuxtLink>

           <NuxtLink to="/deposit" class="group bg-white dark:bg-stone-900 p-8 rounded-[40px] border border-stone-100 dark:border-stone-800 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/5">
              <div class="flex items-center justify-between mb-4">
                <div class="w-14 h-14 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🛡️</div>
                <UIcon name="i-lucide-arrow-up-right" class="w-6 h-6 text-stone-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h3 class="text-2xl font-black text-stone-900 dark:text-white mb-2 uppercase tracking-tighter">Deposit Shield</h3>
              <p class="text-stone-500 dark:text-stone-400 font-medium leading-relaxed">Secure proof for your deposit.</p>
           </NuxtLink>
        </div>
      </main>
      
      <!-- Minimalist Footer -->
      <footer class="py-12 border-t border-stone-200 dark:border-stone-800">
         <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-2 opacity-40">
               <div class="w-6 h-6 bg-stone-900 dark:bg-white rounded-lg"></div>
               <span class="font-bold text-stone-900 dark:text-white tracking-widest text-[10px] uppercase">RentBase Protocol</span>
            </div>
            <p class="text-[10px] text-stone-400 font-black uppercase tracking-[0.3em]">© 2025 Protocol Labs Ghana.</p>
         </div>
      </footer>
      
      <!-- Modals -->
      <AuthModal 
        v-model="showAuthModal" 
        @success="handleAuthSuccess"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { formatPhoneDisplay } from '~/utils/formatPhone'

const router = useRouter()
const { user, signOut } = useAuth()

const showAuthModal = ref(false)

function handleAuthSuccess() {
  // Optionally redirect to dashboard after login
}

function navigateToContract() {
  router.push('/contract')
}

function navigateToDeposit() {
  router.push('/deposit')
}

function handleWriteReview(phone: string) {
  router.push(`/agent/${phone}?review=true`)
}

function handleViewReviews(phone: string) {
  router.push(`/agent/${phone}`)
}
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.05); }
}
.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
</style>
