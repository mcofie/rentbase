<template>
  <div class="min-h-screen bg-notion-gray dark:bg-stone-950 transition-colors duration-300 flex flex-col items-center justify-center p-6 text-balance">
    <!-- Center Logo -->
    <NuxtLink to="/" class="mb-12 flex items-center gap-2 group">
      <div class="w-12 h-12 bg-[#0075DE] rounded-xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
        <span class="text-white text-2xl">⚡</span>
      </div>
    </NuxtLink>

    <div class="w-full max-w-sm">
      <div class="text-center mb-10 animate-fade-in">
        <h1 class="text-4xl font-bold text-notion-text dark:text-white mb-4 tracking-tight font-serif">Welcome back.</h1>
        <p class="text-notion-text-secondary dark:text-stone-400 font-medium">Enter your line to secure your session.</p>
      </div>

      <div class="bg-white dark:bg-stone-900 border border-notion-border dark:border-stone-800 rounded-xl shadow-sm animate-fade-in delay-100 overflow-hidden">
        <div class="p-8">
          <form @submit.prevent="step === 'phone' ? handleRequestOtp() : handleVerifyOtp()" class="space-y-6">
            <!-- Step 1: Phone -->
            <div v-if="step === 'phone'" class="space-y-6">
              <div class="space-y-3">
                <label class="text-[10px] font-bold text-notion-text-secondary uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <div class="flex gap-2">
                  <div class="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-notion-gray dark:bg-stone-800 rounded-lg border border-notion-border dark:border-stone-700">
                    <span class="text-lg">🇬🇭</span>
                    <span class="text-sm font-bold text-notion-text-secondary">+233</span>
                  </div>
                  <input 
                    v-model="phone"
                    type="tel"
                    placeholder="24 XXX XXXX"
                    class="flex-1 min-w-0 px-4 py-4 bg-white dark:bg-stone-950/50 border-notion-border dark:border-stone-800 rounded-lg text-lg font-medium text-notion-text dark:text-white focus:ring-2 focus:ring-notion-blue/20 focus:border-notion-blue transition-all placeholder-stone-300"
                    autofocus
                  />
                </div>
              </div>

              <button 
                type="submit"
                :disabled="loading || phone.length < 9"
                class="w-full py-4 bg-notion-text dark:bg-white text-white dark:text-stone-900 text-lg font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-sm"
              >
                <UIcon v-if="loading" name="i-lucide-loader-2" class="animate-spin" />
                <span>Send Code</span>
              </button>
            </div>

            <!-- Step 2: OTP -->
            <div v-else class="space-y-6 animate-fade-in">
              <div class="space-y-3">
                <div class="flex items-center justify-between px-1">
                  <label class="text-[10px] font-bold text-notion-text-secondary uppercase tracking-[0.2em]">6-Digit Code</label>
                  <button @click="step = 'phone'" class="text-[10px] font-bold text-notion-blue uppercase tracking-widest hover:underline px-0 py-0">Change Number</button>
                </div>
                <input 
                  v-model="otp"
                  type="text"
                  maxlength="6"
                  placeholder="000000"
                  class="w-full px-6 py-4 bg-notion-gray dark:bg-stone-950/50 border-notion-border dark:border-stone-800 rounded-lg text-2xl font-bold text-notion-text dark:text-white text-center tracking-[0.5em] focus:ring-2 focus:ring-notion-blue/20 focus:border-notion-blue transition-all placeholder-stone-300"
                  autofocus
                />
              </div>

              <button 
                type="submit"
                :disabled="loading || otp.length < 6"
                class="w-full py-4 bg-notion-blue text-white text-lg font-bold rounded-lg hover:bg-notion-blue-hover active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-lg shadow-notion-blue/20"
              >
                <UIcon v-if="loading" name="i-lucide-loader-2" class="animate-spin" />
                <span>Verify & Sign In</span>
              </button>
              
              <p class="text-center text-[10px] font-bold text-notion-text-secondary uppercase tracking-widest pt-2">
                Didn't receive it? <button @click="handleRequestOtp" class="text-notion-blue hover:underline">Resend</button>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <p class="text-center text-[10px] font-bold text-notion-text-secondary uppercase tracking-[0.2em] mt-12 opacity-50">
        RentBase Protocol • Secure Layer
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { verifyOTP, sendOTP, resendOTP, profile, signOut } = useAuth()
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
    toast.add({ title: 'Code sent!', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Request failed', description: err.message, color: 'error' })
  } finally {
    loading.value = false
  }
}

async function handleVerifyOtp() {
  loading.value = true
  try {
    const success = await verifyOTP(otp.value)
    if (!success) throw new Error('Verification failed')
    
    // Dynamic Redirection based on Role
    if (profile.value?.role === 'admin') {
      toast.add({ title: 'Welcome Admin', color: 'success' })
      router.push('/admin')
    } else {
      toast.add({ title: 'Welcome back!', color: 'success' })
      const redirect = route.query.redirect as string || '/dashboard'
      router.push(redirect)
    }
  } catch (err: any) {
    toast.add({ title: 'Login Failed', description: err.message, color: 'error' })
    // Reset if it's an auth error
    if (err.message.includes('restricted') || err.message.includes('Invalid')) {
      step.value = 'phone'
      otp.value = ''
    }
  } finally {
    loading.value = false
  }
}

async function handleResendOtp() {
  await resendOTP()
  toast.add({ title: 'Resent code', color: 'success' })
}

definePageMeta({
  layout: false
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-100 { animation-delay: 0.1s; }
</style>
