<template>
  <div class="sms-sender">
    <!-- Trigger Button -->
    <UButton
      :variant="variant"
      :size="size"
      :color="color"
      :icon="icon"
      @click="showModal = true"
      :class="buttonClass"
    >
      <slot>Send via SMS</slot>
    </UButton>

    <!-- Modal - Teleported to body for proper overlay -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
          
          <!-- Modal Content -->
          <div class="relative bg-white dark:bg-stone-900 rounded-2xl p-6 max-w-md w-full animate-bounce-in shadow-2xl border border-stone-200 dark:border-stone-800">
            <!-- Header -->
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                <UIcon name="i-lucide-message-square" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 class="font-black text-stone-900 dark:text-white">Send SMS Notification</h3>
                <p class="text-xs text-stone-500">{{ description }}</p>
              </div>
            </div>

            <!-- Phone Input -->
            <div class="mb-6">
              <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Phone Number</label>
              <div class="flex gap-2">
                <div class="flex items-center gap-2 px-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700">
                  <span class="text-lg">🇬🇭</span>
                  <span class="text-sm font-bold text-stone-600 dark:text-stone-400">+233</span>
                </div>
                <input
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="24 123 4567"
                  class="flex-1 px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl text-base font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-stone-300"
                  @input="formatPhone"
                />
              </div>
              <p class="text-xs text-stone-400 mt-2">Enter a valid Ghana phone number</p>
            </div>

            <!-- Preview -->
            <div class="mb-6">
              <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Message Preview</label>
              <div class="p-4 bg-stone-50 dark:bg-stone-800 rounded-xl text-sm text-stone-600 dark:text-stone-300 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto border border-stone-100 dark:border-stone-700">
                {{ messagePreview }}
              </div>
              <p class="text-xs text-stone-400 mt-2">{{ messagePreview.length }}/160 characters</p>
            </div>

            <!-- Error -->
            <UAlert
              v-if="error"
              color="error"
              variant="soft"
              :description="error"
              icon="i-lucide-alert-circle"
              class="mb-4"
            />

            <!-- Success -->
            <div v-if="success" class="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
              <UIcon name="i-lucide-check-circle-2" class="w-5 h-5 text-emerald-500" />
              <span class="text-sm font-bold text-emerald-700 dark:text-emerald-300">SMS sent successfully!</span>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                @click="closeModal"
                class="flex-1 py-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              >
                {{ success ? 'Close' : 'Cancel' }}
              </button>
              <button
                v-if="!success"
                @click="sendMessage"
                :disabled="!isValidPhone || sending"
                :class="[
                  'flex-1 py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2',
                  isValidPhone && !sending
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-400 cursor-not-allowed'
                ]"
              >
                <div v-if="sending" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span v-else>Send SMS</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
type ButtonColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

const props = defineProps<{
  // Button styling
  variant?: 'solid' | 'outline' | 'ghost' | 'soft'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: ButtonColor
  icon?: string
  buttonClass?: string

  // SMS content
  description?: string
  message: string
  recipientName?: string
}>()

const emit = defineEmits<{
  'sent': [{ phone: string; success: boolean }]
}>()

const { sendSMS, sending, error } = useSMS()

const showModal = ref(false)
const phoneNumber = ref('')
const success = ref(false)

const isValidPhone = computed(() => {
  const cleaned = phoneNumber.value.replace(/\D/g, '')
  return cleaned.length >= 9
})

const messagePreview = computed(() => {
  return props.message.slice(0, 160)
})

function formatPhone(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  // Format as XX XXX XXXX
  if (value.length > 2) {
    value = value.slice(0, 2) + ' ' + value.slice(2)
  }
  if (value.length > 6) {
    value = value.slice(0, 6) + ' ' + value.slice(6)
  }
  
  phoneNumber.value = value.slice(0, 12) // Max 10 digits + 2 spaces
}

async function sendMessage() {
  if (!isValidPhone.value) return
  
  const fullPhone = '+233' + phoneNumber.value.replace(/\D/g, '')
  const result = await sendSMS(fullPhone, props.message)
  
  if (result.success) {
    success.value = true
    emit('sent', { phone: fullPhone, success: true })
  }
}

function closeModal() {
  showModal.value = false
  success.value = false
  phoneNumber.value = ''
}
</script>

<style scoped>
@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.9); }
  50% { transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-bounce-in {
  animation: bounce-in 0.3s ease-out forwards;
}

/* Modal transition */
.modal-enter-active {
  transition: opacity 0.3s ease;
}

.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
