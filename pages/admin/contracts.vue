<template>
  <div class="space-y-6">
    
    <!-- Stats & Filters -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="text-sm">
          <span class="text-stone-500">Total:</span>
          <span class="font-bold text-stone-900 dark:text-white ml-1">{{ contracts.length }}</span>
        </div>
        <div class="text-sm">
          <span class="text-stone-500">Signed:</span>
          <span class="font-bold text-emerald-600 ml-1">{{ signedCount }}</span>
        </div>
      </div>
      
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or address..."
        class="flex-1 max-w-xs px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent"
      />
    </div>

    <!-- Contracts Table -->
    <div class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-stone-400 mx-auto" />
      </div>
      
      <div v-else-if="filteredContracts.length === 0" class="p-8 text-center">
        <UIcon name="i-lucide-file-text" class="w-10 h-10 text-stone-200 dark:text-stone-700 mx-auto mb-3" />
        <p class="text-sm text-stone-500">No contracts found</p>
      </div>
      
      <table v-else class="w-full">
        <thead class="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
          <tr>
            <th class="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Tenant</th>
            <th class="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Property</th>
            <th class="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
            <th class="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Created</th>
            <th class="px-5 py-3 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
          <tr 
            v-for="contract in filteredContracts" 
            :key="contract.id"
            class="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
          >
            <td class="px-5 py-4">
              <p class="font-medium text-stone-900 dark:text-white text-sm">{{ contract.details?.tenant_name || 'Unknown' }}</p>
              <p class="text-xs text-stone-500">{{ contract.customer_email || 'No email' }}</p>
            </td>
            <td class="px-5 py-4">
              <p class="text-sm text-stone-600 dark:text-stone-300 max-w-xs truncate">{{ contract.details?.property_address || 'No address' }}</p>
            </td>
            <td class="px-5 py-4">
              <span :class="['inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium', getStatusClass(contract)]">
                <span :class="['w-1.5 h-1.5 rounded-full', getStatusDotClass(contract)]"></span>
                {{ getStatusLabel(contract) }}
              </span>
            </td>
            <td class="px-5 py-4 text-sm text-stone-500">
              {{ formatDate(contract.created_at) }}
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center justify-end gap-2">
                <button 
                  @click="openSMSModal(contract)"
                  class="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  title="Send SMS"
                >
                  <UIcon name="i-lucide-message-square" class="w-4 h-4" />
                </button>
                <NuxtLink 
                  :to="`/contract/preview/${contract.id}`"
                  class="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  title="View"
                  target="_blank"
                >
                  <UIcon name="i-lucide-external-link" class="w-4 h-4" />
                </NuxtLink>
                <button 
                  @click="copyCode(contract)"
                  class="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  title="Copy Code"
                >
                  <UIcon name="i-lucide-copy" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination placeholder -->
    <div v-if="contracts.length > 20" class="flex justify-center">
      <p class="text-sm text-stone-400">Showing {{ filteredContracts.length }} of {{ contracts.length }} contracts</p>
    </div>

    <!-- SMS Modal -->
    <UModal 
      v-model="showSMSModal" 
      :ui="{ 
        content: '!p-0 !rounded-[32px] !max-w-md w-full'
      }"
    >
      <div class="bg-white rounded-[32px] p-8 shadow-2xl relative w-full max-w-md mx-auto">
        
        <!-- Header -->
        <div class="flex items-start gap-5 mb-8">
          <div class="w-14 h-14 rounded-2xl bg-[#E6F4EA] flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-message-square" class="w-6 h-6 text-[#1E8E3E]" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-[#202124] mb-1">Send SMS Notification</h3>
            <p class="text-sm text-[#5F6368]">Send signing link via SMS</p>
          </div>
        </div>

        <!-- Phone Input -->
        <div class="mb-6">
          <label class="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest mb-2 block">Phone Number</label>
          <div class="flex gap-3">
             <div class="bg-[#F1F3F4] rounded-xl px-4 py-3 flex items-center gap-2 font-medium text-[#202124] flex-shrink-0">
               <span class="text-lg">🇬🇭</span>
               <span>+233</span>
             </div>
             <input 
               v-model="smsPhone" 
               type="tel"
               placeholder="55 850 8306"
               class="bg-[#F1F3F4] flex-1 rounded-xl px-4 py-3 text-lg font-medium text-[#202124] placeholder-[#80868B] focus:outline-none focus:ring-2 focus:ring-[#1E8E3E]/20 transition-all font-mono"
             />
          </div>
          <p class="text-xs text-[#9AA0A6] mt-2">Enter a valid Ghana phone number</p>
        </div>

        <!-- Message Preview -->
        <div class="mb-2">
          <label class="text-[10px] font-bold text-[#5F6368] uppercase tracking-widest mb-2 block">Message Preview</label>
          <div class="bg-[#F8F9FA] rounded-2xl p-5 border border-[#E8EAED]">
            <textarea 
               v-model="smsMessage"
               rows="5"
               class="w-full bg-transparent text-sm font-mono text-[#3C4043] resize-none focus:outline-none"
            ></textarea>
          </div>
        </div>
        <p class="text-xs text-[#5F6368] mb-6 text-right">{{ smsMessage.length }}/160 characters</p>

        <!-- Success Message -->
        <div v-if="smsSuccess" class="mb-6 bg-[#E6F4EA] border border-[#CEEAD6] rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
           <div class="w-6 h-6 rounded-full bg-[#1E8E3E] flex items-center justify-center flex-shrink-0">
             <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-white" />
           </div>
           <span class="font-bold text-[#137333]">SMS sent successfully!</span>
        </div>

        <!-- Error Message -->
         <div v-if="smsError" class="mb-6 bg-[#FCE8E6] border border-[#FAD2CF] rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
           <UIcon name="i-lucide-alert-circle" class="w-5 h-5 text-[#C5221F]" />
           <span class="font-medium text-[#C5221F] text-sm">{{ smsError }}</span>
        </div>

        <!-- Actions -->
        <div v-if="!smsSuccess" class="flex flex-col gap-3">
          <button 
            @click="sendSMS"
            :disabled="sending || !smsPhone"
            class="w-full py-4 bg-[#1E8E3E] hover:bg-[#137333] text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UIcon v-if="sending" name="i-lucide-loader-2" class="w-5 h-5 animate-spin" />
            <span>Send Notification</span>
          </button>
           <button 
             @click="showSMSModal = false"
             class="w-full py-4 bg-white text-[#5F6368] font-bold rounded-xl hover:bg-[#F1F3F4] transition-colors"
           >
             Cancel
           </button>
        </div>
        
        <div v-else>
           <button 
             @click="showSMSModal = false"
             class="w-full py-4 bg-[#F1F3F4] text-[#202124] font-bold rounded-xl hover:bg-[#E8EAED] transition-colors"
           >
             Close
           </button>
        </div>

      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const client = useSupabaseClient()
const toast = useToast()
const config = useRuntimeConfig()

const loading = ref(true)
const contracts = ref<any[]>([])
const searchQuery = ref('')
const showSMSModal = ref(false)
const selectedContract = ref<any>(null)
const smsPhone = ref('')
const smsMessage = ref('')
const sending = ref(false)
const smsSuccess = ref(false)
const smsError = ref<string | null>(null)

const signedCount = computed(() => 
  contracts.value.filter(c => c.landlord_signature && c.tenant_signature).length
)

const filteredContracts = computed(() => {
  if (!searchQuery.value) return contracts.value
  
  const query = searchQuery.value.toLowerCase()
  return contracts.value.filter(c => 
    c.details?.tenant_name?.toLowerCase().includes(query) ||
    c.details?.landlord_name?.toLowerCase().includes(query) ||
    c.details?.property_address?.toLowerCase().includes(query) ||
    c.customer_email?.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  await fetchContracts()
})

async function fetchContracts() {
  loading.value = true
  try {
    const { data, error } = await client
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    contracts.value = data || []
  } catch (err) {
    console.error('Failed to fetch contracts:', err)
  } finally {
    loading.value = false
  }
}

function openSMSModal(contract: any) {
  selectedContract.value = contract
  // Default to tenant phone, strip non-digits
  smsPhone.value = contract.details?.tenant_phone?.replace(/^\+233|^0/, '') || ''
  
  // Generate shorter link
  const linkId = contract.tenant_short_code || contract.id
  // Use current origin if available, otherwise just relative path or localhost placeholder
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://rentbase.app'
  const link = `${origin}/s/${linkId}`
  
  smsMessage.value = `SIGN YOUR TENANCY AGREEMENT
Property: ${contract.details?.property_address || 'Unavailable'}
Sign here: ${link}
- RentBase`
  
  smsSuccess.value = false
  smsError.value = null
  showSMSModal.value = true
}

async function sendSMS() {
  sending.value = true
  smsError.value = null
  
  try {
    // Format phone to +233
    const formattedPhone = `+233${smsPhone.value.replace(/\s/g, '')}`
    
    const response = await $fetch('/api/sms/send', {
      method: 'POST',
      body: {
        to: formattedPhone,
        message: smsMessage.value
      }
    }) as any
    
    if (response.success) {
      smsSuccess.value = true
    } else {
      smsError.value = response.error || 'Failed to send SMS'
    }
  } catch (err: any) {
    smsError.value = err.data?.message || 'An error occurred'
  } finally {
    sending.value = false
  }
}

function getStatusClass(contract: any): string {
  if (contract.landlord_signature && contract.tenant_signature) {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
  }
  if (contract.landlord_signature || contract.tenant_signature) {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
  }
  return 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
}

function getStatusDotClass(contract: any): string {
  if (contract.landlord_signature && contract.tenant_signature) return 'bg-emerald-500'
  if (contract.landlord_signature || contract.tenant_signature) return 'bg-amber-500'
  return 'bg-stone-400'
}

function getStatusLabel(contract: any): string {
  if (contract.landlord_signature && contract.tenant_signature) return 'Fully Signed'
  if (contract.landlord_signature) return 'Landlord Signed'
  if (contract.tenant_signature) return 'Tenant Signed'
  return 'Pending'
}

function copyCode(contract: any) {
  const code = contract.landlord_short_code || contract.id.slice(0, 8).toUpperCase()
  navigator.clipboard.writeText(code)
  toast.add({ title: 'Code copied', description: code, color: 'success' })
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  })
}
</script>
