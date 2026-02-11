<template>
    <!-- Back Button Row -->
    <div class="max-w-5xl mx-auto w-full px-6 pt-12 pb-4 flex items-center justify-between animate-fade-in">
        <UButton 
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left" 
          size="sm"
          class="rounded-full hover:bg-stone-100 dark:hover:bg-white/10"
          @click="handleBack"
        >
          Back
        </UButton>
      </div>
      
      <!-- Auto-save indicator -->
      <div v-if="autoSaveStatus" class="fixed bottom-6 right-6 z-50">
        <div class="flex items-center gap-2 px-4 py-2 bg-notion-blue text-white rounded-lg text-xs font-medium shadow-lg animate-fade-in">
          <UIcon :name="autoSaveStatus === 'saving' ? 'i-lucide-loader-2' : 'i-lucide-check'" :class="{ 'animate-spin': autoSaveStatus === 'saving' }" class="w-4 h-4" />
          {{ autoSaveStatus === 'saving' ? 'Saving...' : 'Draft saved' }}
        </div>
      </div>
      
      <!-- Main Content -->
      <main class="px-6 py-8 sm:py-12 flex-grow">
        <div :class="['mx-auto', step === 2 ? 'max-w-6xl' : 'max-w-4xl']">
          <!-- Page Header -->
          <div class="text-center mb-10 animate-fade-in group">
            <div class="mb-4 text-6xl group-hover:scale-110 transition-transform duration-500 cursor-default">
              {{ step === 1 ? '✍️' : step === 2 ? '📄' : step === 3 ? '💳' : '🎉' }}
            </div>
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-notion-gray dark:bg-stone-800 text-notion-text-secondary rounded-md text-[10px] font-bold uppercase tracking-widest mb-4 border border-notion-border">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Pocket Lawyer Protocol
            </div>
            <h1 class="text-3xl sm:text-5xl font-bold text-stone-900 dark:text-white mb-3 tracking-tight font-serif">
              {{ stepTitles[step - 1] }}
            </h1>
            <p class="text-stone-500 dark:text-stone-400 font-medium max-w-xl mx-auto">
              {{ stepDescriptions[step - 1] }}
            </p>
          </div>
          
          <!-- Progress Steps (Notion Style: Minimal) -->
          <div class="flex items-center justify-center gap-2 mb-16 text-[11px] font-bold uppercase tracking-widest text-notion-text-secondary">
             <div :class="['flex items-center gap-2 px-3 py-2 rounded-lg transition-all', step === 1 ? 'bg-notion-blue/10 text-notion-blue shadow-sm ring-1 ring-notion-blue/20' : 'opacity-40']">
               <span class="w-4 h-4 rounded-full bg-notion-blue text-white flex items-center justify-center text-[8px]">1</span>
               <span>Details</span>
             </div>
             <UIcon name="i-lucide-chevron-right" class="w-3 h-3 opacity-20" />
             <div :class="['flex items-center gap-2 px-3 py-2 rounded-lg transition-all', step === 2 ? 'bg-notion-blue/10 text-notion-blue shadow-sm ring-1 ring-notion-blue/20' : 'opacity-40']">
               <span class="w-4 h-4 rounded-full bg-notion-blue text-white flex items-center justify-center text-[8px]">2</span>
               <span>Preview</span>
             </div>
             <UIcon name="i-lucide-chevron-right" class="w-3 h-3 opacity-20" />
             <div :class="['flex items-center gap-2 px-3 py-2 rounded-lg transition-all', step === 3 ? 'bg-notion-blue/10 text-notion-blue shadow-sm ring-1 ring-notion-blue/20' : 'opacity-40']">
               <span class="w-4 h-4 rounded-full bg-notion-blue text-white flex items-center justify-center text-[8px]">3</span>
               <span>Pay</span>
             </div>
             <UIcon name="i-lucide-chevron-right" class="w-3 h-3 opacity-20" />
             <div :class="['flex items-center gap-2 px-3 py-2 rounded-lg transition-all', step === 4 ? 'bg-notion-green text-emerald-800 shadow-sm ring-1 ring-emerald-200' : 'opacity-40']">
               <UIcon name="i-lucide-check" class="w-4 h-4" />
               <span>Done</span>
             </div>
          </div>

          <!-- Step 1: Contract Form -->
          <div v-if="step === 1" class="animate-fade-in-up">
            <ContractForm 
              :loading="loading"
              :initial-data="formData"
              @submit="handleFormSubmit"
              @cancel="$router.push('/')"
            />
            
            <!-- Clear saved draft button -->
            <div v-if="hasSavedDraft" class="mt-8 text-center">
              <button 
                @click="clearSavedDraft"
                class="text-xs text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <UIcon name="i-lucide-trash-2" class="w-3 h-3" />
                Clear saved draft
              </button>
            </div>
          </div>

          <!-- Step 2: Preview with Watermark -->
          <div v-else-if="step === 2" class="animate-fade-in">
            <div class="grid lg:grid-cols-12 gap-8 items-start">
              <!-- Preview Document -->
              <div class="lg:col-span-8 order-2 lg:order-1">
                <div class="bg-white dark:bg-stone-900 border border-notion-border dark:border-stone-800 rounded-xl overflow-hidden shadow-sm">
                  <ContractPreview :details="formData!" />
                </div>
              </div>

              <!-- Action Sidebar -->
              <div class="lg:col-span-4 space-y-6 order-1 lg:order-2 sticky top-24">
                <!-- Summary Card -->
                <ContractSummaryCard :details="formData!" />
                
                <!-- Approval Card -->
                <div class="bg-white dark:bg-stone-900 rounded-[24px] p-6 border border-notion-border dark:border-stone-800 shadow-sm">
                  <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-notion-green dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <UIcon name="i-lucide-check-circle-2" class="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 class="text-sm font-bold text-notion-text dark:text-white">Review Draft</h3>
                      <p class="text-[11px] text-notion-text-secondary">Ready for finalization</p>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <UButton
                      block
                      size="xl"
                      class="rounded-xl font-bold btn-primary h-12"
                      icon="i-lucide-arrow-right"
                      trailing
                      :loading="loading"
                      @click="approvePreview"
                    >
                      Continue to Payment
                    </UButton>
                    <UButton
                      variant="ghost"
                      color="neutral"
                      block
                      size="lg"
                      class="rounded-xl font-medium text-notion-text-secondary hover:text-notion-text"
                      icon="i-lucide-pencil"
                      @click="step = 1"
                    >
                      Edit Details
                    </UButton>
                  </div>
                </div>

                <!-- Share & Download Card -->
                <div class="bg-notion-gray dark:bg-stone-800/40 rounded-[24px] p-6 border border-notion-border dark:border-stone-700">
                  <div class="flex items-center gap-2 mb-4">
                    <UIcon name="i-lucide-share-2" class="w-4 h-4 text-notion-text-secondary" />
                    <span class="text-[10px] font-bold text-notion-text-secondary uppercase tracking-[0.1em]">Collaborate</span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-3">
                    <UButton
                      variant="outline"
                      color="neutral"
                      block
                      size="md"
                      class="rounded-xl font-medium bg-white dark:bg-stone-900 border-notion-border"
                      icon="i-lucide-file-text"
                      @click="downloadDraftPDF"
                    >
                      Draft PDF
                    </UButton>
                    
                    <UButton
                      variant="outline"
                      block
                      size="md"
                      class="rounded-xl font-medium border-notion-border text-stone-700 bg-white dark:bg-stone-900 dark:text-stone-300"
                      icon="i-lucide-message-circle"
                      @click="shareViaWhatsApp"
                    >
                      WhatsApp
                    </UButton>
                  </div>
                  
                  <UButton
                    variant="soft"
                    color="neutral"
                    block
                    size="md"
                    class="rounded-xl font-medium mt-3 bg-stone-200/50 dark:bg-stone-700/50 text-notion-text dark:text-white"
                    icon="i-lucide-link"
                    @click="copyShareLink"
                  >
                    {{ linkCopied ? 'Link Copied!' : 'Copy Preview Link' }}
                  </UButton>
                </div>

                <!-- Info Card -->
                <div class="p-4 rounded-xl bg-notion-yellow/40 border border-amber-200/50 dark:border-amber-900/30">
                  <div class="flex items-start gap-3">
                    <UIcon name="i-lucide-info" class="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <p class="text-[11px] text-amber-800 dark:text-amber-400 leading-normal">
                      Watermark is removed after payment. Agreement is stored for 2 years.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Email & Payment -->
          <div v-else-if="step === 3" class="animate-fade-in-up">
            <div class="grid lg:grid-cols-12 gap-10 max-w-5xl mx-auto">
              <!-- Payment Form -->
              <div class="lg:col-span-7 bg-white dark:bg-stone-900 rounded-[24px] p-8 border border-notion-border dark:border-stone-800 shadow-sm">
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-notion-pastel-blue dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                      <UIcon name="i-lucide-credit-card" class="w-6 h-6 text-notion-blue dark:text-notion-pastel-blue" />
                    </div>
                    <div>
                      <h2 class="text-xl font-bold text-notion-text dark:text-white font-serif">Checkout</h2>
                      <p class="text-xs text-notion-text-secondary italic">Secure Payment Processing</p>
                    </div>
                  </div>
                  <div class="flex flex-col items-end">
                    <img src="https://paystack.com/assets/img/login/paystack-logo.png" class="h-4 opacity-40 dark:invert" />
                  </div>
                </div>
                
                <!-- Order Summary Breakdown -->
                <div class="bg-notion-gray dark:bg-stone-800/50 rounded-2xl p-6 mb-8 border border-notion-border dark:border-stone-700/50">
                   <div class="space-y-4">
                      <div class="flex justify-between items-center text-sm">
                        <div class="flex items-center gap-2">
                          <UIcon name="i-lucide-file-text" class="w-4 h-4 text-notion-text-secondary" />
                          <span class="text-notion-text-secondary">Tenancy Agreement Feature</span>
                        </div>
                        <span class="font-bold text-notion-text dark:text-white">GH₵ {{ servicePrice }}</span>
                      </div>
                      <div class="flex justify-between items-center text-sm">
                        <div class="flex items-center gap-2">
                          <UIcon name="i-lucide-cloud" class="w-4 h-4 text-emerald-500" />
                          <span class="text-notion-text-secondary">Cloud Backup & Storage (2yrs)</span>
                        </div>
                        <span class="text-emerald-600 font-bold text-xs bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">INCLUDED</span>
                      </div>
                      <div class="pt-4 border-t border-notion-border dark:border-stone-700 flex justify-between items-center">
                        <span class="font-black text-notion-text dark:text-white uppercase tracking-widest text-[11px]">Payable Total</span>
                        <span class="text-3xl font-black text-notion-blue dark:text-white tracking-tighter">GH₵ {{ servicePrice }}</span>
                      </div>
                   </div>
                </div>

                <!-- Email Input -->
                <div class="mb-8 group">
                  <div class="flex items-center gap-2 mb-3">
                    <label class="text-[11px] font-bold text-notion-text-secondary uppercase tracking-widest group-focus-within:text-notion-blue transition-colors">Receipt Recipient</label>
                  </div>
                  <UInput 
                    v-model="customerEmail"
                    type="email"
                    placeholder="email@example.com"
                    size="xl"
                    icon="i-lucide-mail"
                    class="w-full"
                    variant="outline"
                  />
                  <p class="text-[10px] text-notion-text-secondary mt-2.5 flex items-center gap-1.5">
                    <UIcon name="i-lucide-shield-check" class="w-3.5 h-3.5" />
                    Final document will be delivered to this address
                  </p>
                </div>

                <div class="flex gap-4">
                  <UButton variant="ghost" color="neutral" size="xl" class="rounded-xl px-6" @click="step = 2">Back</UButton>
                  <PaystackButton
                    v-if="customerEmail && contractId"
                    feature-type="contract"
                    :email="customerEmail"
                    :item-id="contractId"
                    class="flex-1"
                    @success="handlePaymentSuccess"
                  >
                    Complete Checkout
                  </PaystackButton>
                  <UButton
                    v-else
                    disabled
                    block
                    size="xl"
                    class="flex-1 bg-notion-blue/50 text-white cursor-not-allowed rounded-xl"
                  >
                    Enter Email to Pay
                  </UButton>
                </div>
              </div>

              <!-- Summary Card (Right Column) -->
              <div class="lg:col-span-5 space-y-6">
                <ContractSummaryCard :details="formData!" />
                
                <div class="p-6 rounded-[24px] bg-notion-text dark:bg-stone-800 text-white shadow-lg shadow-stone-200/50 dark:shadow-none">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <UIcon name="i-lucide-shield-lock" class="w-4 h-4 text-emerald-400" />
                    </div>
                    <span class="text-[11px] font-black uppercase tracking-[0.2em] text-stone-300">Carfax Protection</span>
                  </div>
                  <p class="text-sm leading-relaxed text-stone-300 italic">
                    Once paid, we remove the draft watermark and invite all parties to digitally sign the verified agreement.
                  </p>
                </div>
              </div>
            </div>
          </div>


          <!-- Step 4: Success -->
          <div v-else-if="step === 4" class="text-center py-16 animate-fade-in max-w-2xl mx-auto">
            <div class="bg-white dark:bg-stone-900 p-12 rounded-[32px] border border-notion-border shadow-xl">
              <div class="w-20 h-20 bg-notion-green rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-in">
                <UIcon name="i-lucide-party-popper" class="w-10 h-10 text-emerald-600" />
              </div>
              
              <h2 class="text-4xl font-bold text-notion-text dark:text-white mb-4 font-serif tracking-tight">Agreement Ready!</h2>
              <p class="text-notion-text-secondary dark:text-stone-400 mb-12 text-lg">
                Your legally binding tenancy agreement has been successfully generated and finalized.
              </p>
              
              <div class="grid sm:grid-cols-2 gap-4">
                <UButton
                  size="xl"
                  class="rounded-xl font-bold bg-notion-blue hover:bg-notion-blue-hover text-white h-14"
                  icon="i-lucide-download"
                  @click="downloadDraftPDF" 
                >
                  Download PDF
                </UButton>
                <UButton
                   variant="outline"
                   size="xl"
                   class="rounded-xl font-bold border-notion-border text-notion-text h-14"
                   icon="i-lucide-message-circle"
                   @click="shareViaWhatsApp"
                >
                  Send via WhatsApp
                </UButton>
              </div>

              <div class="mt-12 pt-8 border-t border-notion-border">
                <NuxtLink 
                  to="/"
                  class="text-sm font-bold text-notion-blue hover:underline flex items-center justify-center gap-2"
                >
                  Return to Dashboard
                  <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
                </NuxtLink>
              </div>
            </div>
          </div>
          
          <!-- Error Alert -->
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :description="error"
            icon="i-lucide-alert-circle"
            class="mt-6"
          />
        </div>
      </main>
</template>

<script setup lang="ts">
import type { ContractDetails } from '~/types'
import { downloadContractPDF } from '~/utils/generatePDF'

const router = useRouter()
const config = useRuntimeConfig()
const { loading, error, createDraft, finalizeContract } = useContractGenerator()

const step = ref(1)
const formData = ref<ContractDetails | null>(null)
const customerEmail = ref('')
const contractId = ref('')
const linkCopied = ref(false)
const autoSaveStatus = ref<'saving' | 'saved' | null>(null)
const hasSavedDraft = ref(false)
const servicePrice = ref(40)

const STORAGE_KEY = 'rentbase_contract_draft'

// Load saved draft and fetch price on mount
onMounted(async () => {
  loadSavedDraft()
  try {
    const prices = await $fetch<{ price_contract: number }>('/api/settings/prices')
    if (prices?.price_contract) servicePrice.value = prices.price_contract
  } catch (e) {
    console.error('Failed to fetch dynamic price:', e)
  }
})

const stepTitles = [
  'Create Agreement',
  'Preview Agreement',
  'Complete Payment',
  'Agreement Ready!'
]

const stepDescriptions = [
  'Fill in the details below to generate your tenancy agreement.',
  'Review your agreement before proceeding to payment.',
  'Secure payment to receive your official document.',
  'Your document is ready for download.'
]

// Load saved draft on mount
onMounted(() => {
  loadSavedDraft()
})

function loadSavedDraft() {
  if (import.meta.client) {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        formData.value = JSON.parse(saved)
        hasSavedDraft.value = true
      } catch (e) {
        console.error('Failed to load saved draft:', e)
      }
    }
  }
}

function saveDraft(data: ContractDetails) {
  if (import.meta.client) {
    autoSaveStatus.value = 'saving'
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setTimeout(() => {
      autoSaveStatus.value = 'saved'
      hasSavedDraft.value = true
      setTimeout(() => {
        autoSaveStatus.value = null
      }, 2000)
    }, 500)
  }
}

function clearSavedDraft() {
  if (import.meta.client) {
    localStorage.removeItem(STORAGE_KEY)
    formData.value = null
    hasSavedDraft.value = false
    // Force refresh the form by briefly changing step
    step.value = 0
    nextTick(() => { step.value = 1 })
  }
}

function handleBack() {
  if (step.value > 1) {
    step.value--
  } else {
    router.back()
  }
}

async function handleFormSubmit(data: ContractDetails) {
  formData.value = data
  // Auto-save the draft
  saveDraft(data)
  // Move to preview step
  step.value = 2
}

async function approvePreview() {
  if (!formData.value) return
  
  // Create draft when user approves the preview
  const contract = await createDraft(formData.value, customerEmail.value || undefined)
  
  if (contract) {
    contractId.value = contract.id
    // Clear saved draft since it's now in the database
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
      hasSavedDraft.value = false
    }
    step.value = 3
  }
}

async function handlePaymentSuccess(reference: string) {
  // Finalize the contract after payment
  const success = await finalizeContract(contractId.value, reference)
  
  if (success) {
    step.value = 4
  }
}

function downloadDraftPDF() {
  if (formData.value) {
    downloadContractPDF(formData.value, true, `RentBase_Draft_${formData.value.landlord_name}_${formData.value.tenant_name}.pdf`)
  }
}

function shareViaWhatsApp() {
  if (!formData.value) return
  
  let message = ''
  
  if (contractId.value) {
    // If we have a contract ID, share the preview link
    const baseUrl = config.public.appUrl || 'http://localhost:3000'
    const url = `${baseUrl}/contract/preview/${contractId.value}`
    message = `Hello ${formData.value.landlord_name},\n\nPlease review this tenancy agreement draft:\n${url}\n\nGenerated by RentBase - The Carfax for Rentals`
  } else {
    // Share a summary of the draft
    message = `*TENANCY AGREEMENT DRAFT*\n\n` +
      `📍 Property: ${formData.value.property_address}\n` +
      `🏠 Type: ${formData.value.property_type}\n\n` +
      `👤 Landlord: ${formData.value.landlord_name}\n` +
      `👤 Tenant: ${formData.value.tenant_name}\n\n` +
      `💰 Rent: ${formData.value.rent_currency} ${formData.value.rent_amount.toLocaleString()} (${formData.value.payment_frequency})\n` +
      `🔒 Deposit: ${formData.value.rent_currency} ${formData.value.security_deposit.toLocaleString()}\n` +
      `📅 Duration: ${formData.value.lease_duration_months} months\n` +
      `📅 Start: ${new Date(formData.value.lease_start_date).toLocaleDateString('en-GB')}\n\n` +
      `_Generated by RentBase - The Carfax for Rentals_`
  }
  
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
}

async function copyShareLink() {
  if (!contractId.value) {
    // Copy a placeholder message
    const message = `Check out RentBase for secure rental agreements: ${config.public.appUrl || 'https://rentbase.app'}`
    await navigator.clipboard.writeText(message)
  } else {
    const baseUrl = config.public.appUrl || 'http://localhost:3000'
    const url = `${baseUrl}/contract/preview/${contractId.value}`
    await navigator.clipboard.writeText(url)
  }
  
  linkCopied.value = true
  setTimeout(() => { linkCopied.value = false }, 2000)
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
