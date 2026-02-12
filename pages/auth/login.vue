<template>
  <div class="min-h-screen bg-white dark:bg-stone-950 transition-colors duration-500 flex flex-col items-center justify-center p-6 text-balance overflow-hidden relative">
    <!-- Sophisticated Background Elements -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-notion-blue/5 dark:bg-notion-blue/10 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full"></div>
    </div>

    <!-- Center Logo -->
    <NuxtLink to="/" class="mb-12 flex flex-col items-center gap-4 group relative z-10">
      <div class="w-14 h-14 bg-notion-text dark:bg-white rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-2xl shadow-notion-text/10">
        <span class="text-white dark:text-notion-text text-3xl font-bold">⚡</span>
      </div>
      <span class="text-xl font-black text-notion-text dark:text-white tracking-widest uppercase opacity-20 group-hover:opacity-100 transition-opacity">Protocol</span>
    </NuxtLink>

    <div class="w-full max-w-sm relative z-10">
      <div class="text-center mb-10 animate-fade-in">
        <h1 class="text-5xl font-black text-notion-text dark:text-white mb-4 tracking-tighter font-serif">Welcome back.</h1>
        <p class="text-notion-text-secondary dark:text-stone-400 font-medium text-lg leading-snug px-4">Enter your line to secure your session and access the protocol.</p>
      </div>

      <div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl border border-notion-border/50 dark:border-stone-800/50 rounded-3xl shadow-2xl shadow-notion-text/5 animate-fade-in delay-100 overflow-hidden">
        <div class="p-8">
          <form @submit.prevent="step === 'phone' ? handleRequestOtp() : handleVerifyOtp()" class="space-y-8">
            <!-- Step 1: Phone -->
            <div v-if="step === 'phone'" class="space-y-8">
              <div class="space-y-4">
                <label class="text-[10px] font-black text-notion-text-secondary dark:text-stone-500 uppercase tracking-[0.4em] ml-1">Phone Number</label>
                <div class="flex flex-col gap-3">
                  <div class="flex gap-2">
                    <div class="flex-shrink-0 flex items-center gap-2 px-4 py-4 bg-notion-gray/50 dark:bg-stone-800/50 rounded-2xl border border-notion-border/30 dark:border-stone-700/30">
                      <span class="text-lg">🇬🇭</span>
                      <span class="text-xs font-black text-notion-text-secondary dark:text-stone-400">+233</span>
                    </div>
                    <input 
                      v-model="phone"
                      type="tel"
                      placeholder="24 XXX XXXX"
                      class="flex-1 min-w-0 px-5 py-5 bg-white/50 dark:bg-stone-950/50 border border-notion-border/30 dark:border-stone-800 rounded-2xl text-xl font-bold text-notion-text dark:text-white focus:ring-4 focus:ring-notion-blue/10 focus:border-notion-blue transition-all placeholder-stone-300 dark:placeholder-stone-700"
                      autofocus
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                :disabled="loading || phone.length < 9"
                class="group w-full relative py-5 bg-notion-text dark:bg-white text-white dark:text-notion-text text-lg font-black rounded-2xl overflow-hidden active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-notion-text/10"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-notion-blue to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative z-10 flex items-center justify-center gap-3">
                  <UIcon v-if="loading" name="i-lucide-loader-2" class="animate-spin w-5 h-5" />
                  <span class="tracking-tight uppercase text-sm">Initialize Protocol</span>
                </div>
              </button>
            </div>

            <!-- Step 2: OTP -->
            <div v-else class="space-y-8 animate-fade-in">
              <div class="space-y-4">
                <div class="flex items-center justify-between px-1">
                  <label class="text-[10px] font-black text-notion-text-secondary dark:text-stone-500 uppercase tracking-[0.4em]">Auth Code</label>
                  <button @click="step = 'phone'" class="text-[10px] font-black text-notion-blue uppercase tracking-widest hover:underline px-0 py-0">Reset</button>
                </div>
                <input 
                  v-model="otp"
                  type="text"
                  maxlength="6"
                  placeholder="000000"
                  class="w-full px-6 py-5 bg-notion-gray/30 dark:bg-stone-950/30 border border-notion-border/50 dark:border-stone-800 rounded-2xl text-4xl font-black text-notion-text dark:text-white text-center tracking-[0.3em] focus:ring-4 focus:ring-notion-blue/10 focus:border-notion-blue transition-all placeholder-stone-200 dark:placeholder-stone-800"
                  autofocus
                />
              </div>

              <button 
                type="submit"
                :disabled="loading || otp.length < 6"
                class="group w-full relative py-5 bg-notion-blue text-white text-lg font-black rounded-2xl overflow-hidden active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-notion-blue/20"
              >
                <div class="relative z-10 flex items-center justify-center gap-3">
                  <UIcon v-if="loading" name="i-lucide-loader-2" class="animate-spin w-5 h-5" />
                  <span class="tracking-tight uppercase text-sm">Verify & Access</span>
                </div>
              </button>
              
              <p class="text-center text-[10px] font-black text-notion-text-secondary dark:text-stone-500 uppercase tracking-widest pt-2">
                Missing signal? <button @click="handleRequestOtp" class="text-notion-blue hover:underline">Resend code</button>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <div class="flex items-center justify-center gap-4 mt-12 opacity-30">
        <div class="h-px w-8 bg-notion-text dark:bg-white"></div>
        <p class="text-[10px] font-black text-notion-text dark:text-white uppercase tracking-[0.5em]">
          Secure Access Layer
        </p>
        <div class="h-px w-8 bg-notion-text dark:bg-white"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { verifyOTP, sendOTP, resendOTP, profile, signOut, fetchProfile } = useAuth()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const step = ref<'phone' | 'otp'>('phone')
const phone = ref('')
const otp = ref('')
const loading = ref(false)

async function handleRequestOtp() {
  loading.value = true
  try {
    const success = await sendOTP(phone.value)
    if (!success) throw new Error('Failed to send OTP')
    
    step.value = 'otp'
    toast.add({ title: 'Authorization code sent', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Protocol failure', description: err.message, color: 'error' })
  } finally {
    loading.value = false
  }
}

async function handleVerifyOtp() {
  loading.value = true
  try {
    const success = await verifyOTP(otp.value)
    if (!success) throw new Error('Verification failed')
    
    // Refresh profile state explicitly
    await fetchProfile()
    
    // Dynamic Redirection based on Role
    if (profile.value?.role === 'admin') {
      toast.add({ title: 'Admin Authorized', color: 'success' })
      router.push('/admin')
    } else {
      toast.add({ title: 'Access Granted', color: 'success' })
      const redirect = route.query.redirect as string || '/dashboard'
      router.push(redirect)
    }
  } catch (err: any) {
    toast.add({ title: 'Access Denied', description: err.message, color: 'error' })
    // Reset if it's an auth error
    if (err.message.includes('restricted') || err.message.includes('Invalid')) {
      step.value = 'phone'
      otp.value = ''
    }
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
onMounted(async () => {
    // Wait for profile to load (it might already be loading in fetchProfile)
    if (profile.value) {
        if (profile.value.role === 'admin') {
            router.push('/admin')
        } else {
            router.push('/dashboard')
        }
    }
})

// Also watch profile for changes (e.g. if it loads after mount)
watch(profile, (newProfile) => {
    if (newProfile && step.value === 'phone') { // Only redirect if we haven't started OTP process
        if (newProfile.role === 'admin') {
            router.push('/admin')
        } else {
            router.push('/dashboard')
        }
    }
})

async function handleResendOtp() {
  await resendOTP()
  toast.add({ title: 'New authorization code sent', color: 'success' })
}

definePageMeta({
  layout: false
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-100 { animation-delay: 0.1s; }
</style>
