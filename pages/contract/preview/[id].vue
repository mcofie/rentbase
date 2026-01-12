<template>
  <div class="max-w-6xl mx-auto px-4 py-8 sm:py-12 animate-fade-in relative z-10">
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
       <div class="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
       <p class="text-sm font-bold text-stone-400 uppercase tracking-widest animate-pulse">Fetching Document...</p>
    </div>

    <div v-else-if="error" class="max-w-xl mx-auto text-center py-20 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-sm">
       <div class="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-lg flex items-center justify-center mx-auto mb-6">
         <span class="text-3xl">🚫</span>
       </div>
       <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-2 tracking-tight font-serif">Document Not Found</h2>
       <p class="text-stone-500 dark:text-stone-400 font-medium mb-8 px-8">{{ error }}</p>
       <UButton size="xl" color="neutral" class="rounded-lg font-medium px-8" to="/dashboard">Back to Dashboard</UButton>
    </div>

    <div v-else-if="contract" class="max-w-6xl mx-auto">
      <!-- Status Banner -->
      <div class="mb-10 text-center">
         <div class="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border shadow-sm mb-4" :class="contract.is_finalized ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900 text-amber-700 dark:text-amber-400'">
            <span class="w-2 h-2 rounded-full" :class="contract.is_finalized ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'"></span>
            <span class="text-[10px] font-bold uppercase tracking-widest">{{ contract.is_finalized ? 'Finalized Document' : 'Draft Preview' }}</span>
         </div>
         <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white tracking-tight font-serif">Review Agreement</h1>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Document View -->
        <div class="lg:col-span-2 space-y-6">
           <div class="bg-white dark:bg-stone-900 rounded-lg shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden relative">
              <!-- Draft Watermark Overlay -->
              <div v-if="!contract.is_finalized" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] rotate-[-35deg]">
                <span class="text-[120px] font-black tracking-tighter">DRAFT</span>
              </div>

              <!-- Document Header -->
              <div class="p-8 sm:p-12 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/20">
                <div class="flex justify-between items-start mb-8">
                   <div class="w-10 h-10 bg-stone-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-stone-900">
                     <span class="text-lg">⚡</span>
                   </div>
                   <div class="text-right">
                     <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Generated On</p>
                     <p class="text-sm font-bold text-stone-900 dark:text-white">{{ formatDate(contract.created_at) }}</p>
                   </div>
                </div>
                <h2 class="text-2xl font-bold text-stone-900 dark:text-white tracking-tight text-center sm:text-left font-serif">Residential Tenancy Agreement</h2>
              </div>

              <!-- Document Body -->
              <div class="p-8 sm:p-12 space-y-12">
                <!-- Parties -->
                <section class="grid sm:grid-cols-2 gap-12">
                  <div>
                    <h4 class="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">The Landlord</h4>
                    <div class="space-y-1">
                      <p class="text-lg font-bold text-stone-900 dark:text-white">{{ details.landlord_name }}</p>
                      <p class="text-sm font-medium text-stone-500">{{ details.landlord_phone }}</p>
                      <p class="text-xs text-stone-400">{{ details.landlord_id_type }}: {{ details.landlord_id_number }}</p>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">The Tenant</h4>
                    <div class="space-y-1">
                      <p class="text-lg font-bold text-stone-900 dark:text-white">{{ details.tenant_name }}</p>
                      <p class="text-sm font-medium text-stone-500">{{ details.tenant_phone }}</p>
                      <p class="text-xs text-stone-400">{{ details.tenant_id_type }}: {{ details.tenant_id_number }}</p>
                    </div>
                  </div>
                </section>

                <!-- Property -->
                <section>
                  <h4 class="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-6 border-b border-stone-100 dark:border-stone-800 pb-2">The Premises</h4>
                  <div class="grid sm:grid-cols-2 gap-8">
                    <div>
                       <p class="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Address</p>
                       <p class="text-base font-bold text-stone-900 dark:text-white">{{ details.property_address }}</p>
                    </div>
                    <div>
                       <p class="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Property Type</p>
                       <p class="text-base font-bold text-stone-900 dark:text-white">{{ details.property_type }}</p>
                    </div>
                  </div>
                </section>

                <!-- Terms -->
                <section>
                  <h4 class="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-6 border-b border-stone-100 dark:border-stone-800 pb-2">The Terms</h4>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="bg-stone-50 dark:bg-stone-800/40 p-4 rounded-lg">
                       <p class="text-[10px] font-bold text-stone-400 uppercase mb-1">Rent</p>
                       <p class="text-sm font-bold text-stone-900 dark:text-white">{{ details.rent_currency }} {{ details.rent_amount }}</p>
                    </div>
                    <div class="bg-stone-50 dark:bg-stone-800/40 p-4 rounded-lg">
                       <p class="text-[10px] font-bold text-stone-400 uppercase mb-1">Deposit</p>
                       <p class="text-sm font-bold text-stone-900 dark:text-white">{{ details.rent_currency }} {{ details.security_deposit }}</p>
                    </div>
                    <div class="bg-stone-50 dark:bg-stone-800/40 p-4 rounded-lg">
                       <p class="text-[10px] font-bold text-stone-400 uppercase mb-1">Starts</p>
                       <p class="text-sm font-bold text-stone-900 dark:text-white">{{ formatDateSimple(details.lease_start_date) }}</p>
                    </div>
                    <div class="bg-stone-50 dark:bg-stone-800/40 p-4 rounded-lg">
                       <p class="text-[10px] font-bold text-stone-400 uppercase mb-1">Duration</p>
                       <p class="text-sm font-bold text-stone-900 dark:text-white">{{ details.lease_duration_months }} months</p>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Footer -->
              <div class="p-6 bg-stone-50 dark:bg-stone-800/20 text-center text-[10px] font-bold text-stone-400 dark:text-stone-600 uppercase tracking-[0.3em]">
                RENTBASE PROTOCOL • IMMUTABLE DOCUMENT
              </div>
           </div>
        </div>

        <!-- Action Sidebar -->
        <div class="space-y-6">
           <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 shadow-sm relative sticky top-24">
              <div v-if="!contract.is_finalized" class="space-y-4">
                <h3 class="text-xl font-bold text-stone-900 dark:text-white mb-2 tracking-tight font-serif">Finalize Document</h3>
                <p class="text-sm font-medium text-stone-500 mb-8 leading-relaxed">Pay the protocol fee to remove the draft watermark and generate a legally-valid signed PDF.</p>
                
                <PaystackButton
                  v-if="user && userEmail"
                  feature-type="contract"
                  :email="userEmail"
                  :item-id="contract.id"
                  class="w-full py-3.5 !bg-stone-900 dark:!bg-white !text-white dark:!text-stone-900 !font-medium !rounded-lg !shadow-sm hover:!bg-stone-800 transition-colors flex items-center justify-center gap-2"
                  @success="handlePaymentSuccess"
                >
                  Mint Official PDF (GH₵ 40)
                </PaystackButton>
                <UButton
                  v-else
                  block
                  size="lg"
                  color="neutral"
                  class="rounded-lg font-medium py-3.5"
                  @click="showAuthModal = true"
                >
                  Sign In to Finalize
                </UButton>

                <div class="pt-4 space-y-3">
                  <UButton
                    variant="ghost"
                    color="neutral"
                    block
                    icon="i-lucide-share-2"
                    class="rounded-lg font-medium"
                    @click="shareContract"
                  >
                    Share Draft
                  </UButton>
                  <UButton
                    variant="ghost"
                    color="neutral"
                    block
                    icon="i-lucide-download"
                    class="rounded-lg font-medium"
                    @click="downloadDraft"
                  >
                    Download Draft PDF
                  </UButton>
                </div>
              </div>

              <div v-else class="space-y-4">
                <!-- Signature Status Card -->
                <div class="mb-6">
                  <div v-if="contract.is_fully_signed" class="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                    <UIcon name="i-lucide-check-circle-2" class="w-6 h-6 text-emerald-600" />
                    <div>
                      <p class="font-bold text-emerald-700 dark:text-emerald-300">Fully Signed</p>
                      <p class="text-xs text-emerald-600 dark:text-emerald-400">Both parties have signed this agreement</p>
                    </div>
                  </div>
                  <div v-else class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    <UIcon name="i-lucide-clock" class="w-6 h-6 text-amber-600" />
                    <div>
                      <p class="font-bold text-amber-700 dark:text-amber-300">Awaiting Signatures</p>
                      <p class="text-xs text-amber-600 dark:text-amber-400">Share signing links with both parties</p>
                    </div>
                  </div>
                </div>

                <!-- Signature Status List -->
                <div class="space-y-3 mb-6">
                  <div class="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-100 dark:border-stone-800">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <UIcon name="i-lucide-user" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p class="text-sm font-bold text-stone-900 dark:text-white">Landlord</p>
                        <p class="text-xs text-stone-500">{{ details.landlord_name }}</p>
                      </div>
                    </div>
                    <div v-if="contract.landlord_signature" class="flex items-center gap-2 text-emerald-500">
                      <UIcon name="i-lucide-check-circle" class="w-5 h-5" />
                      <span class="text-xs font-bold">Signed</span>
                    </div>
                    <UButton 
                      v-else 
                      size="xs" 
                      color="neutral"
                      variant="soft"
                      icon="i-lucide-send"
                      class="rounded-md"
                      @click="copySigningLink('landlord')"
                    >
                      {{ copiedLink === 'landlord' ? 'Copied!' : 'Copy Link' }}
                    </UButton>
                  </div>

                  <div class="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-100 dark:border-stone-800">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <UIcon name="i-lucide-user-check" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p class="text-sm font-bold text-stone-900 dark:text-white">Tenant</p>
                        <p class="text-xs text-stone-500">{{ details.tenant_name }}</p>
                      </div>
                    </div>
                    <div v-if="contract.tenant_signature" class="flex items-center gap-2 text-emerald-500">
                      <UIcon name="i-lucide-check-circle" class="w-5 h-5" />
                      <span class="text-xs font-bold">Signed</span>
                    </div>
                    <UButton 
                      v-else 
                      size="xs" 
                      color="neutral"
                      variant="soft"
                      icon="i-lucide-send"
                      class="rounded-md"
                      @click="copySigningLink('tenant')"
                    >
                      {{ copiedLink === 'tenant' ? 'Copied!' : 'Copy Link' }}
                    </UButton>
                  </div>
                </div>

                <!-- Download Button -->
                <UButton
                  block
                  size="lg"
                  color="neutral"
                  class="rounded-lg font-medium py-3.5"
                  icon="i-lucide-download"
                  @click="downloadFinal"
                >
                  Download {{ contract.is_fully_signed ? 'Signed' : 'Final' }} PDF
                </UButton>
                
                <!-- Share via WhatsApp -->
                <UButton
                  variant="outline"
                  block
                  size="lg"
                  color="neutral"
                  class="rounded-lg font-medium"
                  icon="i-lucide-message-circle"
                  @click="shareSigningLinks"
                >
                  Share via WhatsApp
                </UButton>

                <!-- Send via SMS -->
                <SMSSender
                  v-if="!contract.is_fully_signed"
                  variant="outline"
                  size="lg"
                  icon="i-lucide-smartphone"
                  button-class="w-full rounded-lg font-bold"
                  description="Send signing link via SMS"
                  :message="smsMessage"
                >
                  Send via SMS
                </SMSSender>
              </div>
           </div>

           <!-- Security Note -->
           <div class="p-4 rounded-lg bg-stone-50 dark:bg-stone-900/10 border border-stone-200 dark:border-stone-800/30">
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-shield-check" class="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
                <p class="text-xs font-medium text-stone-500 leading-relaxed">
                  All signatures are cryptographically timestamped and securely stored. The signed document cannot be altered after both parties have signed.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
    
    <AuthModal v-model="showAuthModal" @success="handleAuthSuccess" />
  </div>
</template>

<script setup lang="ts">
import { downloadContractPDF } from '~/utils/generatePDF'
import type { ContractDetails } from '~/types'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { fetchContract, finalizeContract, shareViaWhatsApp, loading, error, currentContract: contract } = useContractGenerator()
const { user } = useAuth()

const showAuthModal = ref(false)
const copiedLink = ref<'landlord' | 'tenant' | null>(null)

const userEmail = computed(() => {
  if (!user.value) return null
  return user.value.email || `${user.value.phone?.replace(/\+/g, '')}@rentbase.app`
})

const details = computed<ContractDetails>(() => {
  return contract.value?.details || {} as ContractDetails
})

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateSimple(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  })
}

function shareContract() {
  if (contract.value) {
    shareViaWhatsApp(contract.value.id, details.value.landlord_name)
  }
}

function downloadDraft() {
  if (contract.value) {
    downloadContractPDF(details.value, true)
  }
}

function downloadFinal() {
  if (contract.value) {
    downloadContractPDF(details.value, false, contract.value.landlord_signature, contract.value.tenant_signature)
  }
}

async function handlePaymentSuccess(reference: string) {
  if (contract.value) {
    const success = await finalizeContract(contract.value.id, reference)
    if (success) {
      downloadFinal()
    }
  }
}

function handleAuthSuccess() {
  showAuthModal.value = false
  // Payment will be triggered by user clicking the Paystack button which is now visible
}

async function copySigningLink(party: 'landlord' | 'tenant') {
  if (!contract.value) return
  
  const baseUrl = config.public.appUrl || 'http://localhost:3000'
  const token = party === 'landlord' ? contract.value.landlord_sign_token : contract.value.tenant_sign_token
  const url = `${baseUrl}/contract/sign/${token}`
  
  await navigator.clipboard.writeText(url)
  copiedLink.value = party
  setTimeout(() => { copiedLink.value = null }, 2000)
}

function shareSigningLinks() {
  if (!contract.value) return
  
  const baseUrl = config.public.appUrl || 'http://localhost:3000'
  const landlordUrl = `${baseUrl}/contract/sign/${contract.value.landlord_sign_token}`
  const tenantUrl = `${baseUrl}/contract/sign/${contract.value.tenant_sign_token}`
  
  const message = `*TENANCY AGREEMENT - DIGITAL SIGNATURE REQUIRED*\n\n` +
    `📍 Property: ${details.value.property_address}\n\n` +
    `Please sign the agreement using your unique link:\n\n` +
    `👤 *Landlord* (${details.value.landlord_name}):\n${landlordUrl}\n\n` +
    `👤 *Tenant* (${details.value.tenant_name}):\n${tenantUrl}\n\n` +
    `_Powered by RentBase - The Carfax for Rentals_`
  
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
}

const smsMessage = computed(() => {
  if (!contract.value) return ''
  const baseUrl = config.public.appUrl || 'http://localhost:3000'
  const landlordUrl = `${baseUrl}/contract/sign/${contract.value.landlord_sign_token}`
  
  return `SIGN YOUR TENANCY AGREEMENT\n` +
    `Property: ${details.value.property_address}\n` +
    `Sign here: ${landlordUrl}\n` +
    `- RentBase`
})

onMounted(async () => {
  const id = route.params.id as string
  await fetchContract(id)
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
.delay-200 { animation-delay: 0.2s; }
</style>
