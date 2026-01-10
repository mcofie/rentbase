<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Blueprint Grid Background is in body, but we add a local overlay for depth -->
    <div class="fixed inset-0 pointer-events-none z-0 bg-stone-50/50 dark:bg-stone-950/50 backdrop-blur-[1px]"></div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Minimalist Navbar -->
      <nav class="sticky top-0 z-50 w-full border-b border-stone-200/50 dark:border-stone-800/50 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 bg-mint-500 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-mint-500/20">
              <UIcon name="i-lucide-box" class="text-white w-6 h-6" />
            </div>
            <span class="text-2xl font-display font-bold text-stone-900 dark:text-white tracking-tight">RentBase</span>
          </NuxtLink>

          <div class="flex items-center gap-8">
            <div class="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 transition-colors">
              <NuxtLink to="/contract" class="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">Legal</NuxtLink>
              <NuxtLink to="/deposit" class="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">Deposits</NuxtLink>
              <NuxtLink to="/retrieve" class="hover:text-mint-600 dark:hover:text-mint-400 transition-colors">Retrieve</NuxtLink>
            </div>
            
            <div class="flex items-center gap-4">
              <ColorSchemeButton />
              <template v-if="user">
                 <UserDropdown />
              </template>
              <template v-else>
                <NuxtLink 
                  to="/auth/login"
                  class="btn-pill bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:shadow-lg hover:shadow-mint-500/20 hover:-translate-y-0.5 text-sm"
                >
                  Sign In
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </nav>

      <main class="flex-grow flex flex-col items-center justify-center px-6 py-20 pb-40 relative">
        <!-- Technical Decorators -->
        <div class="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-stone-200/0 via-stone-200/50 to-stone-200/0 dark:from-stone-800/0 dark:via-stone-800/50 dark:to-stone-800/0 pointer-events-none dashed-line"></div>
        <div class="absolute top-0 right-1/4 h-full w-px bg-gradient-to-b from-stone-200/0 via-stone-200/50 to-stone-200/0 dark:from-stone-800/0 dark:via-stone-800/50 dark:to-stone-800/0 pointer-events-none dashed-line"></div>

        <!-- Hero Section -->
        <div class="text-center max-w-5xl mx-auto animate-fade-in relative z-20">
           <!-- Soft Glow Behind Hero -->
           <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mint-500/10 rounded-full blur-[120px] pointer-events-none"></div>

           <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 mb-8 animate-fade-in">
             <span class="flex h-2 w-2 rounded-full bg-mint-500"></span>
             <span class="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">The Renting Protocol</span>
           </div>

           <h1 class="text-6xl sm:text-8xl lg:text-9xl font-display font-medium text-stone-900 dark:text-white mb-8 tracking-tighter leading-[0.9] text-balance">
             Rent with <br class="hidden sm:block"/>
             <span class="text-gradient">Confidence.</span>
           </h1>
           <p class="text-stone-500 dark:text-stone-400 text-xl sm:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-16 text-balance">
             The essential protocol for verifying agents, drafting legal agreements, and securing your security deposit.
           </p>

           <!-- Primary Search Tool -->
           <div class="w-full max-w-lg mx-auto mb-24 relative z-30">
             <AgentSearchBar @write-review="handleWriteReview" @view-reviews="handleViewReviews" />
           </div>
        </div>

        <!-- Feature Cards Grid (Lens Bento Style) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full animate-fade-in delay-100 z-20">
           <NuxtLink to="/contract" class="card-lens group p-10 relative overflow-hidden">
              <div class="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                 <UIcon name="i-lucide-arrow-up-right" class="w-12 h-12 text-mint-500" />
              </div>
              
              <div class="w-16 h-16 bg-mint-50 dark:bg-mint-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-lucide-scroll-text" class="w-8 h-8 text-mint-600 dark:text-mint-400" />
              </div>
              
              <h3 class="text-3xl font-display font-bold text-stone-900 dark:text-white mb-2 tracking-tight group-hover:text-mint-600 dark:group-hover:text-mint-400 transition-colors">Pocket Lawyer</h3>
              <p class="text-stone-500 dark:text-stone-400 font-medium text-lg leading-relaxed max-w-xs">Generate effortless, legal tenancy agreements in seconds.</p>
           </NuxtLink>

           <NuxtLink to="/deposit" class="card-lens group p-10 relative overflow-hidden">
              <div class="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                 <UIcon name="i-lucide-arrow-up-right" class="w-12 h-12 text-mint-500" />
              </div>

              <div class="w-16 h-16 bg-mint-50 dark:bg-mint-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <UIcon name="i-lucide-shield-check" class="w-8 h-8 text-mint-600 dark:text-mint-400" />
              </div>

              <h3 class="text-3xl font-display font-bold text-stone-900 dark:text-white mb-2 tracking-tight group-hover:text-mint-600 dark:group-hover:text-mint-400 transition-colors">Deposit Shield</h3>
              <p class="text-stone-500 dark:text-stone-400 font-medium text-lg leading-relaxed max-w-xs">Secure proof for your deposit payments on the blockchain.</p>
           </NuxtLink>
        </div>
      </main>
      
      <!-- Minimalist Footer -->
      <footer class="py-12 border-t border-stone-200/50 dark:border-stone-800/50 bg-white/30 dark:bg-black/30 backdrop-blur-sm">
         <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
               <div class="w-8 h-8 bg-stone-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <UIcon name="i-lucide-box" class="text-white dark:text-stone-900 w-4 h-4" />
               </div>
               <span class="font-bold font-display text-stone-900 dark:text-white tracking-widest text-xs uppercase">RentBase Protocol</span>
            </div>
            <p class="text-xs text-stone-400 font-bold uppercase tracking-[0.2em]">© 2025 Protocol Labs Ghana.</p>
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
/* Scoped styles for unique decorations */
.dashed-line {
  background-image: linear-gradient(to bottom, currentColor 50%, transparent 50%);
  background-size: 1px 16px; /* spacing for the dash */
  opacity: 0.1;
}
</style>
