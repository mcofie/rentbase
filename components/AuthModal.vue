<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-6 sm:p-0">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" @click="close"></div>

        <!-- Modal Panel -->
        <div class="relative w-full max-w-sm transform overflow-hidden rounded-[48px] bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-2xl transition-all p-2">
          <div class="p-8">
            <div class="flex items-center justify-between mb-10">
               <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-xl">⚡</div>
               <button @click="close" class="p-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg transition-colors">
                 <UIcon name="i-lucide-x" class="w-5 h-5 text-stone-400" />
               </button>
            </div>

            <div class="text-center mb-8">
              <h3 class="text-3xl font-black text-stone-900 dark:text-white tracking-tighter uppercase mb-2">
                {{ state.step === 'phone' ? 'Secure Session' : 'Verify Line' }}
              </h3>
              <p class="text-stone-500 dark:text-stone-400 font-medium text-xs">
                {{ state.step === 'phone' ? 'Enter your line to continue protocol.' : `Code sent to ${formatPhoneDisplay(state.phone)}` }}
              </p>
            </div>

            <!-- Phone Step -->
            <div v-if="state.step === 'phone'" class="space-y-6">
              <div class="space-y-3">
                <label class="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Phone Number</label>
                <div class="relative">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-black text-stone-200">+233</span>
                  <input 
                    v-model="phoneNumber"
                    type="tel"
                    placeholder="24 XXX XXXX"
                    class="w-full pl-16 pr-6 py-5 bg-stone-50 dark:bg-stone-950/50 border-stone-100 dark:border-stone-800 rounded-3xl text-xl font-black text-stone-900 dark:text-white focus:ring-0 focus:border-emerald-500 transition-all placeholder-stone-200 dark:placeholder-stone-800 text-center"
                    @keyup.enter="handleSendOTP"
                  />
                </div>
                <p v-if="state.error" class="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">{{ state.error }}</p>
              </div>

              <button 
                class="w-full py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-lg font-black rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl"
                :disabled="state.loading || phoneNumber.length < 9"
                @click="handleSendOTP"
              >
                <UIcon v-if="state.loading" name="i-lucide-loader-2" class="animate-spin" />
                <span>Send Code</span>
              </button>
            </div>

            <!-- OTP Step -->
            <div v-else class="space-y-6">
              <div class="space-y-3 text-center">
                <label class="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest">6-Digit Code</label>
                <input 
                  v-model="otpCode"
                  type="text"
                  maxlength="6"
                  placeholder="000000"
                  class="w-full px-6 py-5 bg-stone-50 dark:bg-stone-950/50 border-stone-100 dark:border-stone-800 rounded-3xl text-3xl font-black text-stone-900 dark:text-white text-center tracking-[0.5em] focus:ring-0 focus:border-emerald-500 transition-all placeholder-stone-200 dark:placeholder-stone-800"
                  @keyup.enter="handleVerifyOTP"
                />
                <p v-if="state.error" class="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">{{ state.error }}</p>
              </div>

              <button 
                class="w-full py-5 bg-emerald-500 text-white text-lg font-black rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/10"
                :disabled="state.loading || otpCode.length < 6"
                @click="handleVerifyOTP"
              >
                <UIcon v-if="state.loading" name="i-lucide-loader-2" class="animate-spin" />
                <span>Verify & Sign In</span>
              </button>

              <div class="flex items-center justify-between px-2">
                 <button @click="goBack" class="text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-stone-600">Back</button>
                 <button @click="handleResendOTP" class="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">Resend</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { formatPhoneDisplay } from '~/utils/formatPhone'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const { state, sendOTP, verifyOTP, resendOTP, resetState } = useAuth()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const countryCode = ref('+233')
const phoneNumber = ref('')
const otpCode = ref('')

async function handleSendOTP() {
  const fullPhone = `${countryCode.value}${phoneNumber.value.replace(/\s/g, '')}`
  const success = await sendOTP(fullPhone)
  if (success) {
    otpCode.value = ''
  }
}

async function handleVerifyOTP() {
  const success = await verifyOTP(otpCode.value)
  if (success) {
    emit('success')
    close()
  }
}

async function handleResendOTP() {
  await resendOTP()
}

function goBack() {
  state.step = 'phone'
  state.error = null
  otpCode.value = ''
}

function close() {
  isOpen.value = false
  resetState()
  phoneNumber.value = ''
  otpCode.value = ''
}
</script>
