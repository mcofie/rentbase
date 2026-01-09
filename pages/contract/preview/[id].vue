<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
    <!-- Dot Pattern Background -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-[0.4] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Header -->
      <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-4 sticky top-0 z-50">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center transform -rotate-6 shadow-sm">
              <span class="text-lg">⚡</span>
            </div>
            <span class="font-bold text-gray-900 dark:text-white tracking-tighter text-lg">RentBase</span>
          </NuxtLink>
          
          <div class="flex items-center gap-3">
            <ColorSchemeButton />
            <UButton 
              variant="ghost"
              color="neutral"
              icon="i-lucide-arrow-left" 
              size="sm"
              class="rounded-full hidden sm:flex"
              @click="$router.push('/dashboard')"
            >
              Dashboard
            </UButton>
            <div v-if="user" class="sm:ml-2">
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow px-4 py-8 sm:py-12 relative z-10">
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
           <div class="w-12 h-12 border-4 border-uni-500/20 border-t-uni-500 rounded-full animate-spin"></div>
           <p class="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Fetching Document...</p>
        </div>

        <div v-else-if="error" class="max-w-xl mx-auto text-center py-20 bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl">
           <div class="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
             <span class="text-4xl">🚫</span>
           </div>
           <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Document Not Found</h2>
           <p class="text-gray-500 dark:text-gray-400 font-medium mb-8 px-8">{{ error }}</p>
           <UButton size="xl" class="rounded-2xl font-black px-12" to="/dashboard">Back to Dashboard</UButton>
        </div>

        <div v-else-if="contract" class="max-w-4xl mx-auto">
          <!-- Status Banner -->
          <div class="mb-10 text-center animate-fade-in">
             <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full border shadow-sm mb-4" :class="contract.is_finalized ? 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900 text-green-700 dark:text-green-400' : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900 text-yellow-700 dark:text-yellow-400'">
                <span class="w-2 h-2 rounded-full" :class="contract.is_finalized ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'"></span>
                <span class="text-xs font-black uppercase tracking-widest">{{ contract.is_finalized ? 'Finalized Document' : 'Draft Preview' }}</span>
             </div>
             <h1 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Review Agreement</h1>
          </div>

          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Document View -->
            <div class="lg:col-span-2 space-y-6 animate-fade-in delay-100">
               <div class="bg-white dark:bg-gray-900 rounded-[32px] sm:rounded-[48px] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden relative">
                  <!-- Draft Watermark Overlay -->
                  <div v-if="!contract.is_finalized" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] rotate-[-35deg]">
                    <span class="text-[120px] font-black tracking-tighter">DRAFT</span>
                  </div>

                  <!-- Document Header -->
                  <div class="p-8 sm:p-12 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                    <div class="flex justify-between items-start mb-8">
                       <div class="w-12 h-12 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-gray-900">
                         <span class="text-lg">⚡</span>
                       </div>
                       <div class="text-right">
                         <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Generated On</p>
                         <p class="text-sm font-bold text-gray-900 dark:text-white">{{ formatDate(contract.created_at) }}</p>
                       </div>
                    </div>
                    <h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tighter text-center sm:text-left">Residential Tenancy Agreement</h2>
                  </div>

                  <!-- Document Body -->
                  <div class="p-8 sm:p-12 space-y-12">
                    <!-- Parties -->
                    <section class="grid sm:grid-cols-2 gap-12">
                      <div>
                        <h4 class="text-[10px] font-black text-uni-500 uppercase tracking-[0.2em] mb-4">The Landlord</h4>
                        <div class="space-y-1">
                          <p class="text-lg font-black text-gray-900 dark:text-white">{{ details.landlord_name }}</p>
                          <p class="text-sm font-medium text-gray-500">{{ details.landlord_phone }}</p>
                          <p class="text-xs text-gray-400">{{ details.landlord_id_type }}: {{ details.landlord_id_number }}</p>
                        </div>
                      </div>
                      <div>
                        <h4 class="text-[10px] font-black text-uni-500 uppercase tracking-[0.2em] mb-4">The Tenant</h4>
                        <div class="space-y-1">
                          <p class="text-lg font-black text-gray-900 dark:text-white">{{ details.tenant_name }}</p>
                          <p class="text-sm font-medium text-gray-500">{{ details.tenant_phone }}</p>
                          <p class="text-xs text-gray-400">{{ details.tenant_id_type }}: {{ details.tenant_id_number }}</p>
                        </div>
                      </div>
                    </section>

                    <!-- Property -->
                    <section>
                      <h4 class="text-[10px] font-black text-uni-500 uppercase tracking-[0.2em] mb-6 border-b border-gray-50 dark:border-gray-800 pb-2">The Premises</h4>
                      <div class="grid sm:grid-cols-2 gap-8">
                        <div>
                           <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Address</p>
                           <p class="text-base font-bold text-gray-900 dark:text-white">{{ details.property_address }}</p>
                        </div>
                        <div>
                           <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Propety Type</p>
                           <p class="text-base font-bold text-gray-900 dark:text-white">{{ details.property_type }}</p>
                        </div>
                      </div>
                    </section>

                    <!-- Terms -->
                    <section>
                      <h4 class="text-[10px] font-black text-uni-500 uppercase tracking-[0.2em] mb-6 border-b border-gray-50 dark:border-gray-800 pb-2">The Terms</h4>
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div class="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl">
                           <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Rent</p>
                           <p class="text-sm font-black text-gray-900 dark:text-white">{{ details.rent_currency }} {{ details.rent_amount }}</p>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl">
                           <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Deposit</p>
                           <p class="text-sm font-black text-gray-900 dark:text-white">{{ details.rent_currency }} {{ details.security_deposit }}</p>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl">
                           <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Starts</p>
                           <p class="text-sm font-black text-gray-900 dark:text-white">{{ formatDateSimple(details.lease_start_date) }}</p>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl">
                           <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Duration</p>
                           <p class="text-sm font-black text-gray-900 dark:text-white">{{ details.lease_duration_months }} months</p>
                        </div>
                      </div>
                    </section>
                  </div>

                  <!-- Footer -->
                  <div class="p-6 bg-gray-50 dark:bg-gray-800/20 text-center text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em]">
                    RENTBASE PROTOCOL • IMMUTABLE DOCUMENT
                  </div>
               </div>
            </div>

            <!-- Action Sidebar -->
            <div class="space-y-6 animate-fade-in delay-200">
               <div class="bg-white dark:bg-gray-900 rounded-[32px] p-8 border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden relative">
                  <div v-if="!contract.is_finalized" class="space-y-4">
                    <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Finalize Document</h3>
                    <p class="text-sm font-medium text-gray-500 mb-8 leading-relaxed">Pay the protocol fee to remove the draft watermark and generate a legally-valid signed PDF.</p>
                    
                    <PaystackButton
                      v-if="user && userEmail"
                      feature-type="contract"
                      :email="userEmail"
                      :item-id="contract.id"
                      class="w-full py-4 !bg-gray-900 dark:!bg-white !text-white dark:!text-gray-900 !font-black !rounded-2xl !shadow-xl hover:!scale-[1.02] transition-transform flex items-center justify-center gap-2"
                      @success="handlePaymentSuccess"
                    >
                      Mint Official PDF (GH₵ 40)
                    </PaystackButton>
                    <UButton
                      v-else
                      block
                      size="xl"
                      class="rounded-2xl font-black py-4"
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
                        class="rounded-xl font-bold"
                        @click="shareContract"
                      >
                        Share Draft
                      </UButton>
                      <UButton
                        variant="ghost"
                        color="neutral"
                        block
                        icon="i-lucide-download"
                        class="rounded-xl font-bold"
                        @click="downloadDraft"
                      >
                        Download Draft PDF
                      </UButton>
                    </div>
                  </div>

                  <div v-else class="space-y-4">
                    <div class="w-16 h-16 bg-green-50 dark:bg-green-950/20 rounded-2xl flex items-center justify-center mb-6">
                      <UIcon name="i-lucide-check-circle-2" class="w-10 h-10 text-green-500" />
                    </div>
                    <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Official Document</h3>
                    <p class="text-sm font-medium text-gray-500 mb-8 leading-relaxed">This contract is finalized and ready for signatures.</p>
                    
                    <UButton
                      block
                      size="xl"
                      class="rounded-2xl font-black py-4 shadow-xl shadow-uni-500/20"
                      icon="i-lucide-download"
                      @click="downloadFinal"
                    >
                      Download Final PDF
                    </UButton>
                     <UButton
                      variant="outline"
                      block
                      size="xl"
                      class="rounded-2xl font-black py-4 mt-2"
                      icon="i-lucide-share"
                      @click="shareContract"
                    >
                      Share with Landlord
                    </UButton>
                  </div>
               </div>

               <!-- Security Note -->
               <div class="p-6 rounded-[32px] bg-uni-50 dark:bg-uni-900/10 border border-uni-100 dark:border-uni-900/30">
                  <div class="flex items-start gap-4">
                    <UIcon name="i-lucide-shield-check" class="w-6 h-6 text-uni-600 dark:text-uni-400 flex-shrink-0" />
                    <p class="text-xs font-medium text-uni-700 dark:text-uni-300 leading-relaxed">
                      All RentBase documents are cryptographically hashed. This ensures that the terms cannot be altered after both parties have downloaded the document.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="py-12 border-t border-gray-100 dark:border-gray-800 mt-auto">
         <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
            <div class="flex items-center gap-2">
               <div class="w-6 h-6 bg-gray-900 dark:bg-white rounded-lg"></div>
               <span class="font-bold text-gray-900 dark:text-white">RentBase</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-500 font-medium">© 2025 Protocol Labs Ghana.</p>
         </div>
      </footer>
    </div>
    
    <AuthModal v-model="showAuthModal" @success="handleAuthSuccess" />
  </div>
</template>

<script setup lang="ts">
import { downloadContractPDF } from '~/utils/generatePDF'
import type { ContractDetails } from '~/types'

const route = useRoute()
const router = useRouter()
const { fetchContract, finalizeContract, shareViaWhatsApp, loading, error, currentContract: contract } = useContractGenerator()
const { user } = useAuth()

const showAuthModal = ref(false)

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
    downloadContractPDF(details.value, false)
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
