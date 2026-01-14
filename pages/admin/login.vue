<template>
  <!-- Loading state while checking auth -->
  <div v-if="checking" class="min-h-screen bg-[#F7F7F5] dark:bg-[#191919] flex items-center justify-center">
    <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-[#91918E]" />
  </div>

  <div v-else class="min-h-screen bg-[#F7F7F5] dark:bg-[#191919] flex items-center justify-center p-6 font-sans">
    <div class="w-full max-w-sm bg-white dark:bg-[#202020] p-8 rounded-xl shadow-sm border border-[#E1E1E1] dark:border-[#2F2F2F]">
      
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#F7F7F5] dark:bg-[#2C2C2C] mb-4">
          <span class="text-2xl">⚡</span>
        </div>
        <h1 class="text-2xl font-bold text-[#37352F] dark:text-[#D4D4D4] font-serif tracking-tight">RentBase Admin</h1>
        <p class="text-sm text-[#91918E] mt-1">Enter your credentials to access the workspace</p>
      </div>

      <!-- Step 1: Phone Number -->
      <form v-if="step === 'phone'" @submit.prevent="sendOTP" class="space-y-5">
        <div>
          <label class="text-[11px] font-semibold text-[#91918E] uppercase tracking-wide mb-1.5 block">
            Phone Number
          </label>
          <div class="flex items-stretch gap-2 group">
            <div class="flex items-center px-3 bg-[#F7F7F5] dark:bg-[#2C2C2C] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-sm font-medium text-[#5F5E5B] dark:text-[#9B9B9B]">
              +233
            </div>
            <input
              v-model="phone"
              type="tel"
              placeholder="55 123 4567"
              required
              maxlength="12"
              @input="formatPhone"
              class="flex-1 px-3 py-2.5 bg-white dark:bg-[#202020] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-[#37352F] dark:text-[#D4D4D4] font-medium focus:outline-none focus:ring-1 focus:ring-[#2EAADC] focus:border-[#2EAADC] transition-all text-sm placeholder-[#91918E]"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading || phone.replace(/\s/g, '').length < 9"
          class="w-full py-2.5 bg-[#2EAADC] hover:bg-[#2383E2] text-white rounded font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <span>Continue</span>
        </button>
      </form>

      <!-- Step 2: OTP Verification -->
      <form v-else-if="step === 'otp'" @submit.prevent="verifyOTP" class="space-y-6">
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-[11px] font-semibold text-[#91918E] uppercase tracking-wide block">
              Verification Code
            </label>
            <button 
              type="button"
              @click="step = 'phone'; error = null"
              class="text-xs text-[#2eaadc] hover:text-[#2383E2] transition-colors"
            >
              Change number
            </button>
          </div>
          
          <p class="text-xs text-[#91918E] mb-4">
            Enter the 6-digit code sent to <span class="font-medium text-[#37352F] dark:text-[#D4D4D4]">+233 {{ phone }}</span>
          </p>

          <!-- OTP Input -->
          <div class="flex gap-2 justify-center">
            <input
              v-for="(_, index) in 6"
              :key="index"
              ref="otpInputs"
              type="text"
              inputmode="numeric"
              maxlength="1"
              :value="otpDigits[index]"
              @input="handleOTPInput(index, $event)"
              @keydown="handleOTPKeydown(index, $event)"
              @paste="handleOTPPaste"
              class="w-10 h-12 text-center text-xl font-bold bg-white dark:bg-[#202020] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-[#37352F] dark:text-[#D4D4D4] focus:outline-none focus:ring-1 focus:ring-[#2EAADC] focus:border-[#2EAADC] transition-all"
            />
          </div>

          <!-- Resend -->
          <div class="text-center mt-4">
            <button
              v-if="resendTimer <= 0"
              type="button"
              @click="sendOTP"
              class="text-xs text-[#2EAADC] hover:text-[#2383E2] font-medium transition-colors"
            >
              Resend code
            </button>
            <p v-else class="text-xs text-[#91918E]">
              Resend in {{ resendTimer }}s
            </p>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading || otpDigits.some(d => !d)"
          class="w-full py-2.5 bg-[#2EAADC] hover:bg-[#2383E2] text-white rounded font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <span>Verify & Login</span>
        </button>
      </form>

      <!-- Error / Dev Info -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded text-center">
        <p class="text-xs text-red-600 dark:text-red-400 font-medium break-all">{{ error }}</p>
      </div>
      
      <!-- Footer Link -->
       <div class="mt-6 text-center">
         <NuxtLink to="/" class="text-xs text-[#91918E] hover:text-[#37352F] dark:hover:text-[#D4D4D4] transition-colors">
           Return to website
         </NuxtLink>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()

const step = ref<'phone' | 'otp'>('phone')
const phone = ref('')
const otpDigits = ref(['', '', '', '', '', ''])
const loading = ref(false)
const error = ref<string | null>(null)
const resendTimer = ref(0)

const otpInputs = ref<HTMLInputElement[]>([])

function formatPhone(e: Event) {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length > 9) {
    value = value.slice(0, 9)
  }
  
  let formatted = ''
  if (value.length > 0) formatted += value.slice(0, 2)
  if (value.length > 2) formatted += ' ' + value.slice(2, 5)
  if (value.length > 5) formatted += ' ' + value.slice(5, 9)
  
  phone.value = formatted
}

function handleOTPInput(index: number, e: Event) {
  const input = e.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '').slice(0, 1)
  
  otpDigits.value[index] = value
  
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

function handleOTPKeydown(index: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

function handleOTPPaste(e: ClipboardEvent) {
  e.preventDefault()
  const pasted = e.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) || ''
  
  for (let i = 0; i < 6; i++) {
    otpDigits.value[i] = pasted[i] || ''
  }
  
  const lastFilled = pasted.length - 1
  if (lastFilled >= 0 && lastFilled < 5) {
    otpInputs.value[lastFilled + 1]?.focus()
  }
}

function startResendTimer() {
  resendTimer.value = 60
  const interval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

async function sendOTP() {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch('/api/admin/auth/send-otp', {
      method: 'POST',
      body: { phone: phone.value.replace(/\s/g, '') }
    }) as { success: boolean; devOtp?: string; message?: string }
    
    step.value = 'otp'
    otpDigits.value = ['', '', '', '', '', '']
    startResendTimer()
    
    if (response.devOtp) {
      console.log('DEV OTP:', response.devOtp)
      const digits = response.devOtp.split('')
      for (let i = 0; i < 6; i++) {
        otpDigits.value[i] = digits[i] || ''
      }
      error.value = `Dev mode: ${response.devOtp}`
    }
    
    setTimeout(() => {
      otpInputs.value[0]?.focus()
    }, 100)
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to send code'
  } finally {
    loading.value = false
  }
}

async function verifyOTP() {
  loading.value = true
  error.value = null
  
  try {
    await $fetch('/api/admin/auth/verify-otp', {
      method: 'POST',
      body: {
        phone: phone.value.replace(/\s/g, ''),
        otp: otpDigits.value.join('')
      }
    })
    
    router.push('/admin')
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid code'
  } finally {
    loading.value = false
  }
}

const checking = ref(true)

onMounted(async () => {
  try {
    await $fetch('/api/admin/auth/me')
    router.push('/admin')
  } catch {
    // Not logged in, show form
    checking.value = false
  }
})
</script>
