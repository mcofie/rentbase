<template>
  <Teleport to="body">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-[999] flex items-center justify-center bg-stone-900/20 backdrop-blur-sm p-4" 
      @click.self="close"
    >
      <div class="bg-white dark:bg-stone-900 rounded-lg p-6 max-w-md w-full animate-bounce-in border border-[#E1E1E1] dark:border-stone-800 relative max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold text-[#050505] dark:text-white font-serif">Report Agent</h3>
            <p class="text-sm text-[#666666] dark:text-stone-400 mt-1">Help keep the community safe</p>
          </div>
          <button 
            @click="close" 
            class="p-2 hover:bg-[#F7F7F5] dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <UIcon name="i-lucide-x" class="w-5 h-5 text-[#666666]" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitReport" class="space-y-5">
          <!-- Agent Phone (display only) -->
          <div>
            <label class="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">Agent</label>
            <div class="px-4 py-3 bg-[#F7F7F5] dark:bg-stone-800 rounded-lg text-[#050505] dark:text-white font-mono">
              {{ formatPhoneDisplay(agentPhone) }}
            </div>
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">Reason for Reporting</label>
            <select
              v-model="reason"
              required
              class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-base font-medium text-[#050505] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all"
            >
              <option value="">Select a reason</option>
              <option value="fraud">Fraud or scam</option>
              <option value="harassment">Harassment or threats</option>
              <option value="false_listing">False property listing</option>
              <option value="unprofessional">Unprofessional conduct</option>
              <option value="overcharging">Overcharging or hidden fees</option>
              <option value="discrimination">Discrimination</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Details -->
          <div>
            <label class="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">Details (Optional)</label>
            <UTextarea
              v-model="details"
              placeholder="Please describe what happened..."
              :rows="4"
              variant="none"
              class="w-full bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg p-4 text-sm font-medium text-[#050505] dark:text-white placeholder-[#999999] focus:border-[#0075DE] transition-all resize-none"
            />
          </div>

          <!-- Your Phone (Optional) -->
          <div>
            <label class="block text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2">Your Phone (Optional)</label>
            <input
              v-model="reporterPhone"
              type="tel"
              placeholder="0XX XXX XXXX"
              class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-base font-medium text-[#050505] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all placeholder-[#999999]"
            />
            <p class="text-xs text-[#999999] mt-1">Only if you'd like us to follow up with you.</p>
          </div>

          <!-- Error -->
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :description="error"
            icon="i-lucide-alert-circle"
          />

          <!-- Success -->
          <div 
            v-if="submitted" 
            class="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/30"
          >
            <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-600" />
            <p class="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
              Report submitted. We'll review it within 48 hours.
            </p>
          </div>

          <!-- Actions -->
          <div v-if="!submitted" class="flex gap-3 pt-2">
            <button
              type="button"
              @click="close"
              class="flex-1 py-3 bg-white border border-[#E1E1E1] dark:bg-stone-800 dark:border-stone-700 text-[#050505] dark:text-white font-medium rounded-lg hover:bg-[#F7F7F5] dark:hover:bg-stone-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting || !reason"
              class="flex-1 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>Submit Report</span>
            </button>
          </div>

          <!-- Close after success -->
          <button
            v-else
            type="button"
            @click="close"
            class="w-full py-3 bg-[#0075DE] text-white font-medium rounded-lg hover:bg-[#005BAB] transition-colors"
          >
            Done
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { formatPhoneDisplay } from '~/utils/formatPhone'

interface Props {
  modelValue: boolean
  agentPhone: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const reason = ref('')
const details = ref('')
const reporterPhone = ref('')
const submitting = ref(false)
const error = ref<string | null>(null)
const submitted = ref(false)

const toast = useToast()

function close() {
  emit('update:modelValue', false)
  // Reset form after animation
  setTimeout(() => {
    reason.value = ''
    details.value = ''
    reporterPhone.value = ''
    error.value = null
    submitted.value = false
  }, 300)
}

async function submitReport() {
  if (!reason.value) return

  submitting.value = true
  error.value = null

  try {
    await $fetch('/api/agents/report', {
      method: 'POST',
      body: {
        agent_phone: props.agentPhone,
        reason: reason.value,
        details: details.value,
        reporter_phone: reporterPhone.value || null
      }
    })

    submitted.value = true
    toast.add({
      title: 'Report Submitted',
      description: 'Thank you for helping keep the community safe.',
      color: 'success'
    })
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Failed to submit report'
  } finally {
    submitting.value = false
  }
}
</script>
