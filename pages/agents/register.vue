<template>
  <div class="min-h-screen bg-[#F7F7F5] dark:bg-stone-950 transition-colors duration-300">
    <div class="relative z-10 flex flex-col min-h-screen">
      <main class="flex-grow px-6 py-8 sm:py-12">
        <div class="max-w-xl mx-auto">
          <!-- Hero Section -->
          <div class="text-center mb-8 sm:mb-12 animate-fade-in">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-notion-blue rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-notion-blue/20">
              <UIcon :name="currentStepIcon" class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 class="text-2xl sm:text-4xl font-bold text-notion-text dark:text-white mb-3 tracking-tight font-serif px-2">
              {{ currentStepTitle }}
            </h1>
            <p class="text-sm sm:text-base text-notion-text-secondary dark:text-stone-400 font-medium max-w-md mx-auto px-4">
              {{ currentStepSubtitle }}
            </p>
          </div>

          <!-- Progress Steps -->
          <div class="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-12">
            <div 
              v-for="s in 3" 
              :key="s"
              class="flex items-center"
            >
              <div 
                :class="[
                  'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all',
                  step >= s 
                    ? 'bg-notion-blue text-white shadow-sm' 
                    : 'bg-notion-gray dark:bg-stone-700 text-notion-text-secondary dark:text-stone-400 ring-1 ring-notion-border'
                ]"
              >
                <UIcon v-if="step > s" name="i-lucide-check" class="w-3.5 h-3.5 sm:w-4 h-4" />
                <span v-else>{{ s }}</span>
              </div>
              <div 
                v-if="s < 3"
                :class="[
                  'w-8 sm:w-12 h-px sm:h-0.5 mx-0.5 sm:mx-1',
                  step > s ? 'bg-notion-blue' : 'bg-notion-border dark:bg-stone-700'
                ]"
              />
            </div>
          </div>

          <!-- Step 1: Enter Details -->
          <div v-if="step === 1" class="animate-fade-in px-4 sm:px-0">
            <!-- Benefits Cards -->
            <div class="grid gap-3 sm:gap-4 mb-10">
              <div class="bg-white dark:bg-stone-900 rounded-xl p-5 sm:p-6 border border-notion-border dark:border-stone-800 flex items-start gap-4 hover:border-notion-success/30 transition-colors group">
                <div class="w-10 h-10 bg-notion-green/30 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 class="font-bold text-notion-text dark:text-white mb-0.5 text-sm sm:text-base font-serif">Get Verified</h3>
                  <p class="text-xs sm:text-sm text-notion-text-secondary dark:text-stone-400 leading-relaxed">Display a verified badge that builds trust with potential clients.</p>
                </div>
              </div>

              <div class="bg-white dark:bg-stone-900 rounded-xl p-5 sm:p-6 border border-notion-border dark:border-stone-800 flex items-start gap-4 hover:border-notion-blue/30 transition-colors group">
                <div class="w-10 h-10 bg-notion-pastel-blue dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-star" class="w-5 h-5 text-notion-blue dark:text-blue-400" />
                </div>
                <div>
                  <h3 class="font-bold text-notion-text dark:text-white mb-0.5 text-sm sm:text-base font-serif">Build Your Reputation</h3>
                  <p class="text-xs sm:text-sm text-notion-text-secondary dark:text-stone-400 leading-relaxed">Collect reviews from satisfied clients. Your rating stays with you.</p>
                </div>
              </div>

              <div class="bg-white dark:bg-stone-900 rounded-xl p-5 sm:p-6 border border-notion-border dark:border-stone-800 flex items-start gap-4 hover:border-notion-purple/30 transition-colors group">
                <div class="w-10 h-10 bg-notion-purple/30 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <UIcon name="i-lucide-users" class="w-5 h-5 text-purple-700 dark:text-purple-400" />
                </div>
                <div>
                  <h3 class="font-bold text-notion-text dark:text-white mb-0.5 text-sm sm:text-base font-serif">Connect with Renters</h3>
                  <p class="text-xs sm:text-sm text-notion-text-secondary dark:text-stone-400 leading-relaxed">Be discoverable to renters searching for trusted agents on RentBase.</p>
                </div>
              </div>
            </div>

            <!-- Registration Form -->
            <div class="bg-white dark:bg-stone-900 rounded-xl p-6 sm:p-10 border border-notion-border dark:border-stone-800 shadow-sm">
              <h2 class="text-2xl font-bold text-notion-text dark:text-white mb-8 tracking-tight font-serif">Your Details</h2>
              
              <form @submit.prevent="goToOtpStep" class="space-y-6">
                <!-- Phone Number -->
                <div>
                  <label class="text-[10px] font-bold text-notion-text-secondary uppercase tracking-widest mb-3 block ml-1">Your Phone Number</label>
                  <div class="flex gap-2 min-w-0">
                    <div class="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-notion-gray dark:bg-stone-800 rounded-lg border border-notion-border dark:border-stone-700">
                      <span class="text-lg">🇬🇭</span>
                      <span class="text-sm font-bold text-notion-text-secondary">+233</span>
                    </div>
                    <input
                      v-model="phoneNumber"
                      type="tel"
                      placeholder="24 123 4567"
                      required
                      class="flex-1 min-w-0 px-4 py-3 bg-white dark:bg-stone-800 border border-notion-border dark:border-stone-700 rounded-lg text-base font-medium text-notion-text dark:text-white focus:ring-2 focus:ring-notion-blue/20 focus:border-notion-blue transition-all placeholder-stone-300"
                    />
                  </div>
                </div>

                <!-- Full Name -->
                <div>
                  <label class="text-[10px] font-bold text-notion-text-secondary uppercase tracking-widest mb-3 block ml-1">Full Name</label>
                  <input
                    v-model="fullName"
                    type="text"
                    placeholder="e.g., Kofi Mensah"
                    required
                    class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-notion-border dark:border-stone-700 rounded-lg text-base font-medium text-notion-text dark:text-white focus:ring-2 focus:ring-notion-blue/20 focus:border-notion-blue transition-all placeholder-stone-300"
                  />
                </div>

                <!-- Agency/Company (Optional) -->
                <div>
                  <label class="text-[10px] font-bold text-notion-text-secondary uppercase tracking-widest mb-3 block ml-1">Agency Name (Optional)</label>
                  <input
                    v-model="agencyName"
                    type="text"
                    placeholder="e.g., ABC Real Estate"
                    class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-notion-border dark:border-stone-700 rounded-lg text-base font-medium text-notion-text dark:text-white focus:ring-2 focus:ring-notion-blue/20 focus:border-notion-blue transition-all placeholder-stone-300"
                  />
                </div>

                <!-- Location -->
                <div>
                  <label class="text-[10px] font-bold text-notion-text-secondary uppercase tracking-widest mb-3 block ml-1">Primary Location</label>
                  <select
                    v-model="location"
                    required
                    class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-notion-border dark:border-stone-700 rounded-lg text-base font-medium text-notion-text dark:text-white focus:ring-2 focus:ring-notion-blue/20 focus:border-notion-blue transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-[size:1.5em_1.5em] bg-no-repeat pr-10"
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
                  class="w-full py-4 bg-notion-blue text-white font-bold rounded-lg hover:bg-notion-blue-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-notion-blue/20"
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
          <div v-else-if="step === 2" class="animate-fade-in px-4 sm:px-0">
            <div class="bg-white dark:bg-stone-900 rounded-xl p-6 sm:p-10 border border-notion-border dark:border-stone-800 shadow-sm">
              <div class="text-center mb-10">
                <div class="w-16 h-16 bg-notion-pastel-blue dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UIcon name="i-lucide-smartphone" class="w-8 h-8 text-notion-blue" />
                </div>
                <p class="text-sm sm:text-base text-notion-text-secondary dark:text-stone-400 leading-relaxed">
                  We've sent a 4-digit code to<br>
                  <span class="font-bold text-notion-text dark:text-white text-lg">+233 {{ formatPhone(phoneNumber) }}</span>
                </p>
              </div>

              <!-- OTP Input -->
              <div class="flex justify-center gap-2 sm:gap-4 mb-8">
                <input
                  v-for="(_, index) in 4"
                  :key="index"
                  :ref="(el: any) => otpInputRefs[index] = el"
                  type="text"
                  maxlength="1"
                  inputmode="numeric"
                  pattern="[0-9]"
                  class="w-12 h-14 sm:w-16 sm:h-20 text-center text-2xl sm:text-4xl font-black bg-notion-gray dark:bg-stone-800 border-2 border-notion-border dark:border-stone-700 rounded-xl focus:border-notion-blue focus:ring-4 focus:ring-notion-blue/10 transition-all text-notion-text dark:text-white"
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
                class="w-full py-4 bg-notion-blue text-white font-bold rounded-lg hover:bg-notion-blue-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4 shadow-lg shadow-notion-blue/20"
              >
                <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-else>Verify & Submit</span>
              </button>

              <!-- Resend -->
              <div class="text-center pt-2">
                <button
                  v-if="canResend"
                  @click="resendOtp"
                  :disabled="loading"
                  class="text-xs font-bold text-notion-blue hover:underline disabled:opacity-50 uppercase tracking-widest"
                >
                  Resend Code
                </button>
                <p v-else class="text-xs font-bold text-notion-text-secondary uppercase tracking-widest">
                  Resend code in {{ resendTimer }}s
                </p>
              </div>

              <!-- Back Button -->
              <button
                @click="step = 1"
                class="w-full mt-8 py-2 text-notion-text-secondary hover:text-notion-text dark:hover:text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <UIcon name="i-lucide-arrow-left" class="w-3 h-3" />
                Back to details
              </button>
            </div>
          </div>

          <!-- Step 3: Success -->
          <div v-else-if="step === 3" class="animate-fade-in px-4 sm:px-0">
            <div class="bg-white dark:bg-stone-900 rounded-xl p-6 sm:p-12 border border-notion-border dark:border-stone-800 text-center shadow-sm">
              <div class="w-20 h-20 bg-notion-green rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-in">
                <UIcon name="i-lucide-check-circle" class="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <h2 class="text-2xl sm:text-3xl font-bold text-notion-text dark:text-white mb-4 font-serif">Application Submitted!</h2>
              
              <p class="text-xs sm:text-sm text-notion-text-secondary dark:text-stone-400 mb-8 max-w-sm mx-auto leading-relaxed">
                Your agent registration is now pending review. Our team will verify your details and notify you via SMS.
              </p>

              <div class="bg-notion-gray dark:bg-stone-800/50 rounded-xl p-5 sm:p-6 mb-8 border border-notion-border">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm: gap-6 text-left">
                  <div>
                    <p class="text-stone-400 text-[10px] uppercase font-bold tracking-widest mb-1 font-sans">Name</p>
                    <p class="text-sm sm:text-base font-bold text-notion-text dark:text-white font-serif">{{ fullName }}</p>
                  </div>
                  <div>
                    <p class="text-stone-400 text-[10px] uppercase font-bold tracking-widest mb-1 font-sans">Phone</p>
                    <p class="text-sm sm:text-base font-bold text-notion-text dark:text-white font-serif">+233 {{ formatPhone(phoneNumber) }}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-center gap-2 text-amber-600 mb-10 bg-amber-50 dark:bg-amber-900/20 py-2.5 px-4 rounded-full max-w-max mx-auto">
                <UIcon name="i-lucide-clock" class="w-4 h-4" />
                <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Review in 1-2 business days</span>
              </div>

              <NuxtLink 
                to="/"
                class="inline-flex items-center gap-2 px-8 py-4 bg-notion-text dark:bg-white text-white dark:text-notion-text font-bold rounded-lg hover:opacity-90 transition-all active:scale-95 shadow-md"
              >
                <UIcon name="i-lucide-home" class="w-4 h-4" />
                Back to Home
              </NuxtLink>
            </div>
          </div>

          <!-- Already have account -->
          <div v-if="step !== 3" class="text-center mt-8 px-4 sm:px-0">
            <p class="text-notion-text-secondary dark:text-stone-400 text-sm">
              Already registered? 
              <NuxtLink to="/auth/login" class="text-notion-blue font-bold hover:underline">Sign In</NuxtLink>
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
