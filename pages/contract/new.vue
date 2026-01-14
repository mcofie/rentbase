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
        <div class="flex items-center gap-2 px-4 py-2 bg-[#0075DE] text-white rounded-lg text-xs font-medium shadow-lg animate-fade-in">
          <UIcon :name="autoSaveStatus === 'saving' ? 'i-lucide-loader-2' : 'i-lucide-check'" :class="{ 'animate-spin': autoSaveStatus === 'saving' }" class="w-4 h-4" />
          {{ autoSaveStatus === 'saving' ? 'Saving...' : 'Draft saved' }}
        </div>
      </div>
      
      <!-- Main Content -->
      <main class="px-6 py-8 sm:py-12 flex-grow">
        <div :class="['mx-auto', step === 2 ? 'max-w-6xl' : 'max-w-4xl']">
          <!-- Page Header -->
          <div class="text-center mb-10 animate-fade-in">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Pocket Lawyer
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-3 tracking-tight font-serif">
              {{ stepTitles[step - 1] }}
            </h1>
            <p class="text-stone-500 dark:text-stone-400 font-medium">
              {{ stepDescriptions[step - 1] }}
            </p>
          </div>
          
      <!-- Progress Steps (Notion Style: Minimal) -->
          <div class="flex items-center justify-center gap-4 mb-12 text-xs font-medium text-stone-400">
             <div :class="['flex items-center gap-2 px-3 py-1.5 rounded-md transition-all', step === 1 ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white' : '']">
               <span>1. Details</span>
             </div>
             <span class="text-stone-300">/</span>
             <div :class="['flex items-center gap-2 px-3 py-1.5 rounded-md transition-all', step === 2 ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white' : '']">
               <span>2. Preview</span>
             </div>
             <span class="text-stone-300">/</span>
             <div :class="['flex items-center gap-2 px-3 py-1.5 rounded-md transition-all', step === 3 ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white' : '']">
               <span>3. Pay</span>
             </div>
             <span class="text-stone-300">/</span>
             <div :class="['flex items-center gap-2 px-3 py-1.5 rounded-md transition-all', step === 4 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : '']">
               <span>4. Done</span>
             </div>
          </div>

          <!-- Step 1: Contract Form -->
          <div v-if="step === 1">
            <ContractForm 
              :loading="loading"
              :initial-data="formData"
              @submit="handleFormSubmit"
              @cancel="$router.push('/')"
            />
            
            <!-- Clear saved draft button -->
            <div v-if="hasSavedDraft" class="mt-4 text-center">
              <button 
                @click="clearSavedDraft"
                class="text-xs text-stone-400 hover:text-stone-900 transition-colors underline decoration-stone-200"
              >
                Clear saved draft
              </button>
            </div>
          </div>

          <!-- Step 2: Preview with Watermark -->
          <div v-else-if="step === 2" class="animate-fade-in">
            <div class="grid lg:grid-cols-3 gap-8">
              <!-- Preview Document -->
              <div class="lg:col-span-2 order-2 lg:order-1">
                <ContractPreview :details="formData!" />
              </div>

              <!-- Action Sidebar -->
              <div class="space-y-6 order-1 lg:order-2">
                <!-- Summary Card -->
                <ContractSummaryCard :details="formData!" />
                
                <!-- Approval Card -->
                <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 bg-notion-green rounded-md flex items-center justify-center">
                      <UIcon name="i-lucide-check-circle" class="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <h3 class="font-bold text-stone-900 dark:text-white">Looks Good?</h3>
                      <p class="text-xs text-stone-500">Proceed to payment</p>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <UButton
                      block
                      size="lg"
                      class="rounded-lg font-medium btn-primary"
                      icon="i-lucide-credit-card"
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
                      class="rounded-lg font-medium"
                      icon="i-lucide-pencil"
                      @click="step = 1"
                    >
                      Edit Details
                    </UButton>
                  </div>
                </div>

                <!-- Share & Download Card -->
                <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
                  <p class="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Share Draft</p>
                  
                  <div class="space-y-3">
                    <UButton
                      variant="outline"
                      color="neutral"
                      block
                      size="lg"
                      class="rounded-lg font-medium"
                      icon="i-lucide-download"
                      @click="downloadDraftPDF"
                    >
                      Download Draft PDF
                    </UButton>
                    
                    <UButton
                      variant="outline"
                      block
                      size="lg"
                      class="rounded-lg font-medium border-stone-200 text-stone-700 hover:bg-stone-50"
                      icon="i-lucide-message-circle"
                      @click="shareViaWhatsApp"
                    >
                      Share via WhatsApp
                    </UButton>
                    
                    <UButton
                      variant="ghost"
                      color="neutral"
                      block
                      size="lg"
                      class="rounded-lg font-medium"
                      icon="i-lucide-copy"
                      @click="copyShareLink"
                    >
                      {{ linkCopied ? 'Link Copied!' : 'Copy Share Link' }}
                    </UButton>
                  </div>
                  
                  <p class="text-xs text-stone-400 mt-4 text-center">
                    Share the draft for review before payment
                  </p>
                </div>

                <!-- Info Card -->
                <div class="p-4 rounded-lg bg-notion-yellow border border-stone-100">
                  <div class="flex items-start gap-3">
                    <UIcon name="i-lucide-info" class="w-4 h-4 text-stone-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="text-xs font-bold text-stone-700 mb-1">Draft Watermark</p>
                      <p class="text-xs text-stone-600 leading-relaxed">
                        The watermark will be removed after payment. Share this draft for review before finalizing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Email & Payment -->
          <div v-else-if="step === 3" class="animate-fade-in">
            <div class="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <!-- Payment Form -->
              <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 shadow-sm">
                <div class="flex items-center justify-center gap-3 mb-6">
                  <div class="w-10 h-10 bg-notion-green rounded-md flex items-center justify-center">
                    <UIcon name="i-lucide-credit-card" class="w-5 h-5 text-emerald-700" />
                  </div>
                </div>
                <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-2 text-center font-serif">Complete Payment</h2>
                <p class="text-stone-500 text-center mb-8 text-sm">Secure payment via Paystack</p>
                
                <!-- Order Summary -->
                <div class="bg-stone-50 dark:bg-stone-950/50 rounded-lg p-5 mb-6 border border-stone-100">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="font-bold text-stone-900 dark:text-white">Tenancy Agreement</p>
                      <p class="text-xs text-stone-500">{{ formData?.landlord_name }} ↔ {{ formData?.tenant_name }}</p>
                    </div>
                    <p class="text-xl font-bold text-stone-900">GH₵ 40</p>
                  </div>
                </div>

                <!-- Email Input -->
                <div class="mb-6">
                  <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Your Email</label>
                  <input 
                    v-model="customerEmail"
                    type="email"
                    placeholder="you@example.com"
                    class="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm text-stone-900 dark:text-white focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition-all placeholder-stone-300"
                  />
                </div>

                <div class="flex gap-3">
                  <UButton variant="ghost" color="neutral" size="lg" class="rounded-lg" @click="step = 2">Back</UButton>
                  <PaystackButton
                    v-if="customerEmail && contractId"
                    feature-type="contract"
                    :email="customerEmail"
                    :item-id="contractId"
                    class="flex-1"
                    @success="handlePaymentSuccess"
                  >
                    Pay GH₵ 40
                  </PaystackButton>
                  <button 
                    v-else
                    disabled
                    class="flex-1 py-3 bg-stone-100 dark:bg-stone-800 text-stone-400 font-medium rounded-lg cursor-not-allowed text-sm"
                  >
                    Enter Email
                  </button>
                </div>
              </div>

              <!-- Summary Card -->
              <div class="hidden lg:block">
                <ContractSummaryCard :details="formData!" />
                
                <div class="mt-6 p-4 rounded-lg bg-notion-green border border-emerald-100/50">
                  <div class="flex items-start gap-3">
                    <UIcon name="i-lucide-shield-check" class="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="text-xs font-bold text-emerald-800 mb-1">Secure Payment</p>
                      <p class="text-xs text-emerald-700 leading-relaxed">
                        Your payment is processed securely by Paystack.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Success -->
          <div v-else-if="step === 4" class="text-center py-16 animate-fade-in">
            <div class="w-16 h-16 bg-notion-green rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-check-circle-2" class="w-8 h-8 text-emerald-600" />
            </div>
            
            <h2 class="text-3xl font-bold text-stone-900 dark:text-white mb-4 font-serif">Agreement Ready!</h2>
            <p class="text-stone-500 dark:text-stone-400 mb-10 max-w-sm mx-auto">
              Your tenancy agreement has been generated.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink 
                :to="`/contract/preview/${contractId}`"
                class="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors inline-flex items-center justify-center gap-2 font-medium"
              >
                <UIcon name="i-lucide-download" class="w-4 h-4" />
                View & Download
              </NuxtLink>
              <button 
                @click="shareViaWhatsApp"
                class="px-6 py-3 bg-white border border-stone-200 text-stone-900 rounded-lg hover:bg-stone-50 transition-colors inline-flex items-center justify-center gap-2 font-medium"
              >
                <UIcon name="i-lucide-message-circle" class="w-4 h-4" />
                WhatsApp
              </button>
              <NuxtLink 
                to="/"
                class="px-6 py-3 text-stone-500 hover:text-stone-900 rounded-lg transition-colors font-medium"
              >
                Go Home
              </NuxtLink>
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

const STORAGE_KEY = 'rentbase_contract_draft'

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
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.5); }
  50% { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
