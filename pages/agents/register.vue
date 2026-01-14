<template>
  <div class="min-h-screen bg-[#F7F7F5] dark:bg-stone-950 transition-colors duration-300">
    <div class="relative z-10 flex flex-col min-h-screen">
      <main class="flex-grow px-6 py-8 sm:py-12">
        <div class="max-w-xl mx-auto">
          <!-- Hero Section -->
          <div class="text-center mb-10 animate-fade-in">
            <div class="w-16 h-16 bg-[#0075DE] rounded-lg flex items-center justify-center mx-auto mb-6">
              <UIcon :name="currentStepIcon" class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold text-[#050505] dark:text-white mb-4 tracking-tight font-serif">
              {{ currentStepTitle }}
            </h1>
            <p class="text-[#666666] dark:text-stone-400 font-medium max-w-md mx-auto">
              {{ currentStepSubtitle }}
            </p>
          </div>

          <!-- Progress Steps -->
          <div class="flex items-center justify-center gap-2 mb-10">
            <div 
              v-for="s in 3" 
              :key="s"
              class="flex items-center"
            >
              <div 
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                  step >= s 
                    ? 'bg-[#0075DE] text-white' 
                    : 'bg-[#E1E1E1] dark:bg-stone-700 text-[#666666] dark:text-stone-400'
                ]"
              >
                <UIcon v-if="step > s" name="i-lucide-check" class="w-4 h-4" />
                <span v-else>{{ s }}</span>
              </div>
              <div 
                v-if="s < 3"
                :class="[
                  'w-12 h-0.5 mx-1',
                  step > s ? 'bg-[#0075DE]' : 'bg-[#E1E1E1] dark:bg-stone-700'
                ]"
              />
            </div>
          </div>

          <!-- Step 1: Enter Details -->
          <div v-if="step === 1" class="animate-fade-in">
            <!-- Benefits Cards -->
            <div class="grid gap-4 mb-10">
              <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-[#E1E1E1] dark:border-stone-800 flex items-start gap-4">
                <div class="w-10 h-10 bg-[#DBEDDB] dark:bg-emerald-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 class="font-medium text-[#050505] dark:text-white mb-1">Get Verified</h3>
                  <p class="text-sm text-[#666666] dark:text-stone-400">Display a verified badge that builds trust with potential clients.</p>
                </div>
              </div>

              <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-[#E1E1E1] dark:border-stone-800 flex items-start gap-4">
                <div class="w-10 h-10 bg-[#D3E5EF] dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-lucide-star" class="w-5 h-5 text-[#0075DE] dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="font-medium text-[#050505] dark:text-white mb-1">Build Your Reputation</h3>
                  <p class="text-sm text-[#666666] dark:text-stone-400">Collect reviews from satisfied clients. Your rating follows you.</p>
                </div>
              </div>

              <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-[#E1E1E1] dark:border-stone-800 flex items-start gap-4">
                <div class="w-10 h-10 bg-[#E8DEEE] dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UIcon name="i-lucide-users" class="w-5 h-5 text-purple-700 dark:text-purple-400" />
                </div>
                <div>
                  <h3 class="font-medium text-[#050505] dark:text-white mb-1">Connect with Renters</h3>
                  <p class="text-sm text-[#666666] dark:text-stone-400">Renters search for trusted agents on RentBase. Be discoverable.</p>
                </div>
              </div>
            </div>

            <!-- Registration Form -->
            <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-[#E1E1E1] dark:border-stone-800">
              <h2 class="text-xl font-bold text-[#050505] dark:text-white mb-6 tracking-tight font-serif">Your Details</h2>
              
              <form @submit.prevent="goToOtpStep" class="space-y-6">
                <!-- Phone Number -->
                <div>
                  <label class="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2 block">Your Phone Number</label>
                  <div class="flex gap-2">
                    <div class="flex items-center gap-2 px-4 py-3 bg-[#F7F7F5] dark:bg-stone-800 rounded-lg border border-[#E1E1E1] dark:border-stone-700">
                      <span class="text-lg">🇬🇭</span>
                      <span class="text-sm font-medium text-[#666666] dark:text-stone-400">+233</span>
                    </div>
                    <input
                      v-model="phoneNumber"
                      type="tel"
                      placeholder="24 123 4567"
                      required
                      class="flex-1 px-4 py-3 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-base font-medium text-[#050505] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all placeholder-[#999999]"
                    />
                  </div>
                </div>

                <!-- Full Name -->
                <div>
                  <label class="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2 block">Full Name</label>
                  <input
                    v-model="fullName"
                    type="text"
                    placeholder="e.g., Kofi Mensah"
                    required
                    class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-base font-medium text-[#050505] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all placeholder-[#999999]"
                  />
                </div>

                <!-- Agency/Company (Optional) -->
                <div>
                  <label class="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2 block">Agency Name (Optional)</label>
                  <input
                    v-model="agencyName"
                    type="text"
                    placeholder="e.g., ABC Real Estate"
                    class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-base font-medium text-[#050505] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all placeholder-[#999999]"
                  />
                </div>

                <!-- Location -->
                <div>
                  <label class="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2 block">Primary Location</label>
                  <select
                    v-model="location"
                    required
                    class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-base font-medium text-[#050505] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all"
                  >
                    <option value="">Select your area</option>
                    <option value="accra-central">Accra Central</option>
                    <option value="east-legon">East Legon</option>
                    <option value="airport-residential">Airport Residential</option>
                    <option value="cantonments">Cantonments</option>
                    <option value="osu">Osu</option>
                    <option value="la">La</option>
                    <option value="tema">Tema</option>
                    <option value="spintex">Spintex</option>
                    <option value="kasoa">Kasoa</option>
                    <option value="kumasi">Kumasi</option>
                    <option value="takoradi">Takoradi</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <!-- Error -->
                <UAlert
                  v-if="error"
                  color="error"
                  variant="soft"
                  :description="error"
                  icon="i-lucide-alert-circle"
                />

                <!-- Submit -->
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full py-3.5 bg-[#0075DE] text-white font-medium rounded-lg hover:bg-[#005BAB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span v-else>Continue to Verification</span>
                </button>
              </form>

              <p class="text-xs text-[#666666] text-center mt-6">
                By registering, you agree to our <a href="/company/terms" class="text-[#0075DE] hover:underline">Terms of Service</a>
              </p>
            </div>
          </div>

          <!-- Step 2: OTP Verification -->
          <div v-else-if="step === 2" class="animate-fade-in">
            <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-[#E1E1E1] dark:border-stone-800">
              <div class="text-center mb-8">
                <div class="w-16 h-16 bg-[#D3E5EF] dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UIcon name="i-lucide-smartphone" class="w-8 h-8 text-[#0075DE]" />
                </div>
                <p class="text-[#666666] dark:text-stone-400">
                  We've sent a 4-digit code to<br>
                  <span class="font-semibold text-[#050505] dark:text-white">+233 {{ formatPhone(phoneNumber) }}</span>
                </p>
              </div>

              <!-- OTP Input -->
              <div class="flex justify-center gap-3 mb-6">
                <input
                  v-for="(_, index) in 4"
                  :key="index"
                  :ref="el => otpInputRefs[index] = el"
                  type="text"
                  maxlength="1"
                  inputmode="numeric"
                  pattern="[0-9]"
                  class="w-14 h-14 text-center text-2xl font-bold bg-[#F7F7F5] dark:bg-stone-800 border-2 border-[#E1E1E1] dark:border-stone-700 rounded-xl focus:border-[#0075DE] focus:ring-2 focus:ring-[#0075DE]/20 transition-all text-[#050505] dark:text-white"
                  @input="handleOtpInput($event, index)"
                  @keydown="handleOtpKeydown($event, index)"
                  @paste="handleOtpPaste"
                />
              </div>

              <!-- Error -->
              <UAlert
                v-if="error"
                color="error"
                variant="soft"
                :description="error"
                icon="i-lucide-alert-circle"
                class="mb-6"
              />

              <!-- Verify Button -->
              <button
                @click="verifyOtp"
                :disabled="loading || otpCode.length !== 4"
                class="w-full py-3.5 bg-[#0075DE] text-white font-medium rounded-lg hover:bg-[#005BAB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-else>Verify & Submit</span>
              </button>

              <!-- Resend -->
              <div class="text-center">
                <button
                  v-if="canResend"
                  @click="resendOtp"
                  :disabled="loading"
                  class="text-sm text-[#0075DE] hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
                <p v-else class="text-sm text-[#666666]">
                  Resend code in {{ resendTimer }}s
                </p>
              </div>

              <!-- Back Button -->
              <button
                @click="step = 1"
                class="w-full mt-6 py-2 text-[#666666] hover:text-[#050505] dark:hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
                Back to details
              </button>
            </div>
          </div>

          <!-- Step 3: Success -->
          <div v-else-if="step === 3" class="animate-fade-in">
            <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-[#E1E1E1] dark:border-stone-800 text-center">
              <div class="w-20 h-20 bg-[#DBEDDB] dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UIcon name="i-lucide-check-circle" class="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <h2 class="text-2xl font-bold text-[#050505] dark:text-white mb-4 font-serif">Application Submitted!</h2>
              
              <p class="text-[#666666] dark:text-stone-400 mb-6">
                Your agent registration is now pending review. Our team will verify your details and notify you via SMS once approved.
              </p>

              <div class="bg-[#F7F7F5] dark:bg-stone-800 rounded-lg p-4 mb-8">
                <div class="grid grid-cols-2 gap-4 text-left text-sm">
                  <div>
                    <p class="text-[#999999] dark:text-stone-500 text-xs uppercase tracking-wider mb-1">Name</p>
                    <p class="font-medium text-[#050505] dark:text-white">{{ fullName }}</p>
                  </div>
                  <div>
                    <p class="text-[#999999] dark:text-stone-500 text-xs uppercase tracking-wider mb-1">Phone</p>
                    <p class="font-medium text-[#050505] dark:text-white">+233 {{ formatPhone(phoneNumber) }}</p>
                  </div>
                  <div>
                    <p class="text-[#999999] dark:text-stone-500 text-xs uppercase tracking-wider mb-1">Location</p>
                    <p class="font-medium text-[#050505] dark:text-white capitalize">{{ location.replace('-', ' ') }}</p>
                  </div>
                  <div v-if="agencyName">
                    <p class="text-[#999999] dark:text-stone-500 text-xs uppercase tracking-wider mb-1">Agency</p>
                    <p class="font-medium text-[#050505] dark:text-white">{{ agencyName }}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-center gap-2 text-[#E3B341] mb-8">
                <UIcon name="i-lucide-clock" class="w-5 h-5" />
                <span class="text-sm font-medium">Review typically takes 1-2 business days</span>
              </div>

              <NuxtLink 
                to="/"
                class="inline-flex items-center gap-2 px-6 py-3 bg-[#050505] dark:bg-white text-white dark:text-[#050505] font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                <UIcon name="i-lucide-home" class="w-4 h-4" />
                Back to Home
              </NuxtLink>
            </div>
          </div>

          <!-- Already have account -->
          <div v-if="step !== 3" class="text-center mt-8">
            <p class="text-[#666666] dark:text-stone-400 text-sm">
              Already registered? 
              <NuxtLink to="/auth/login" class="text-[#0075DE] font-medium hover:underline">Sign In</NuxtLink>
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

// Form state
const step = ref(1)
const phoneNumber = ref('')
const fullName = ref('')
const agencyName = ref('')
const location = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// OTP state
const otpInputRefs = ref<(HTMLInputElement | null)[]>([])
const otpDigits = ref(['', '', '', ''])
const canResend = ref(false)
const resendTimer = ref(60)
let resendInterval: ReturnType<typeof setInterval> | null = null

const otpCode = computed(() => otpDigits.value.join(''))

const currentStepIcon = computed(() => {
  switch (step.value) {
    case 1: return 'i-lucide-user-check'
    case 2: return 'i-lucide-shield-check'
    case 3: return 'i-lucide-party-popper'
    default: return 'i-lucide-user-check'
  }
})

const currentStepTitle = computed(() => {
  switch (step.value) {
    case 1: return 'Join RentBase as an Agent'
    case 2: return 'Verify Your Phone'
    case 3: return 'Application Submitted'
    default: return 'Join RentBase as an Agent'
  }
})

const currentStepSubtitle = computed(() => {
  switch (step.value) {
    case 1: return 'Build your reputation, get verified, and connect with renters who trust you.'
    case 2: return 'Enter the 4-digit code we sent to your phone.'
    case 3: return 'We\'ll review your application and get back to you soon.'
    default: return ''
  }
})

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length >= 9) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)}`
  }
  return cleaned
}

function getFullPhone(): string {
  const cleaned = phoneNumber.value.replace(/\D/g, '')
  if (cleaned.startsWith('0')) {
    return '+233' + cleaned.slice(1)
  }
  return '+233' + cleaned
}

async function goToOtpStep() {
  error.value = null
  
  // Validate inputs
  if (!phoneNumber.value || phoneNumber.value.replace(/\D/g, '').length < 9) {
    error.value = 'Please enter a valid phone number'
    return
  }
  
  if (!fullName.value || fullName.value.trim().length < 2) {
    error.value = 'Please enter your full name'
    return
  }
  
  if (!location.value) {
    error.value = 'Please select your primary location'
    return
  }

  loading.value = true
  
  try {
    // Send OTP
    await $fetch('/api/otp/generate', {
      method: 'POST',
      body: { phone: getFullPhone() }
    })
    
    // Move to OTP step
    step.value = 2
    startResendTimer()
    
    // Focus first OTP input
    nextTick(() => {
      otpInputRefs.value[0]?.focus()
    })
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Failed to send verification code'
  } finally {
    loading.value = false
  }
}

function startResendTimer() {
  canResend.value = false
  resendTimer.value = 60
  
  if (resendInterval) clearInterval(resendInterval)
  
  resendInterval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      canResend.value = true
      if (resendInterval) clearInterval(resendInterval)
    }
  }, 1000)
}

async function resendOtp() {
  error.value = null
  loading.value = true
  
  try {
    await $fetch('/api/otp/generate', {
      method: 'POST',
      body: { phone: getFullPhone() }
    })
    
    toast.add({ 
      title: 'Code sent', 
      description: 'A new verification code has been sent to your phone.',
      color: 'success' 
    })
    
    // Reset OTP inputs
    otpDigits.value = ['', '', '', '']
    startResendTimer()
    otpInputRefs.value[0]?.focus()
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Failed to resend code'
  } finally {
    loading.value = false
  }
}

function handleOtpInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '')
  
  if (value) {
    otpDigits.value[index] = value[0]
    input.value = value[0]
    
    // Move to next input
    if (index < 3) {
      otpInputRefs.value[index + 1]?.focus()
    }
  } else {
    otpDigits.value[index] = ''
  }
}

function handleOtpKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputRefs.value[index - 1]?.focus()
  }
}

function handleOtpPaste(event: ClipboardEvent) {
  event.preventDefault()
  const paste = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 4)
  
  if (paste) {
    paste.split('').forEach((digit, i) => {
      if (i < 4) {
        otpDigits.value[i] = digit
        if (otpInputRefs.value[i]) {
          otpInputRefs.value[i]!.value = digit
        }
      }
    })
    otpInputRefs.value[Math.min(paste.length, 3)]?.focus()
  }
}

async function verifyOtp() {
  error.value = null
  loading.value = true
  
  try {
    // Verify OTP
    await $fetch('/api/otp/verify', {
      method: 'POST',
      body: { 
        phone: getFullPhone(),
        code: otpCode.value
      }
    })
    
    // Submit claim
    await $fetch('/api/agents/submit-claim', {
      method: 'POST',
      body: {
        phone: getFullPhone(),
        fullName: fullName.value.trim(),
        agencyName: agencyName.value.trim() || null,
        location: location.value,
        otpVerified: true
      }
    })
    
    // Success!
    step.value = 3
    
    toast.add({
      title: 'Application submitted',
      description: 'Your agent registration is pending review.',
      color: 'success'
    })
  } catch (e: any) {
    error.value = e.data?.message || e.statusMessage || 'Verification failed. Please try again.'
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (resendInterval) clearInterval(resendInterval)
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
