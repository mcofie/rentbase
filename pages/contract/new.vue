<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Header -->
      <nav class="max-w-5xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <span class="text-white text-xl">⚡</span>
          </div>
          <span class="text-2xl font-black text-stone-900 dark:text-white tracking-tighter">RentBase</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <ColorSchemeButton />
          <UButton 
            variant="ghost"
            color="neutral"
            icon="i-lucide-arrow-left" 
            size="sm"
            class="rounded-full"
            @click="$router.back()"
          >
            Back
          </UButton>
        </div>
      </nav>
      
      <!-- Main Content -->
      <main class="px-6 py-8 sm:py-12 flex-grow">
        <div class="max-w-3xl mx-auto">
          <!-- Page Header -->
          <div class="text-center mb-10 animate-fade-in">
            <p class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">Pocket Lawyer</p>
            <h1 class="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white mb-3 tracking-tighter">
              Create Agreement
            </h1>
            <p class="text-stone-500 dark:text-stone-400 font-medium">
              Fill in the details below. Pay once to generate your contract.
            </p>
          </div>
          
          <!-- Progress Steps -->
          <div class="flex items-center justify-center gap-4 mb-12">
            <div class="flex items-center gap-2">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all', step >= 1 ? 'bg-emerald-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-400']">1</div>
              <span :class="['text-xs font-bold uppercase tracking-widest', step >= 1 ? 'text-stone-900 dark:text-white' : 'text-stone-400']">Details</span>
            </div>
            <div class="w-8 h-px bg-stone-200 dark:bg-stone-800"></div>
            <div class="flex items-center gap-2">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all', step >= 2 ? 'bg-emerald-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-400']">2</div>
              <span :class="['text-xs font-bold uppercase tracking-widest', step >= 2 ? 'text-stone-900 dark:text-white' : 'text-stone-400']">Pay</span>
            </div>
            <div class="w-8 h-px bg-stone-200 dark:bg-stone-800"></div>
            <div class="flex items-center gap-2">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all', step >= 3 ? 'bg-emerald-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-400']">3</div>
              <span :class="['text-xs font-bold uppercase tracking-widest', step >= 3 ? 'text-stone-900 dark:text-white' : 'text-stone-400']">Done</span>
            </div>
          </div>

          <!-- Step 1: Contract Form -->
          <div v-if="step === 1">
            <ContractForm 
              :loading="loading"
              @submit="handleFormSubmit"
              @cancel="$router.push('/')"
            />
          </div>

          <!-- Step 2: Email & Payment -->
          <div v-else-if="step === 2" class="animate-fade-in">
            <div class="bg-white dark:bg-stone-900 rounded-[40px] p-8 border border-stone-200 dark:border-stone-800">
              <h2 class="text-2xl font-black text-stone-900 dark:text-white mb-8 tracking-tighter text-center uppercase">Complete Payment</h2>
              
              <!-- Order Summary -->
              <div class="bg-stone-50 dark:bg-stone-950/50 rounded-3xl p-6 mb-8">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-bold text-stone-900 dark:text-white">Tenancy Agreement</p>
                    <p class="text-xs text-stone-500">{{ formData?.landlord_name }} ↔ {{ formData?.tenant_name }}</p>
                  </div>
                  <p class="text-3xl font-black text-emerald-500">GH₵ 40</p>
                </div>
              </div>

              <!-- Email Input -->
              <div class="mb-8">
                <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block">Your Email (for receipt)</label>
                <input 
                  v-model="customerEmail"
                  type="email"
                  placeholder="you@example.com"
                  class="w-full px-6 py-5 bg-stone-50 dark:bg-stone-950/50 border border-stone-100 dark:border-stone-800 rounded-2xl text-lg font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-stone-300"
                />
              </div>

              <div class="flex gap-3">
                <UButton variant="outline" size="lg" class="rounded-2xl" @click="step = 1">Back</UButton>
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
                  class="flex-1 py-4 bg-stone-100 dark:bg-stone-800 text-stone-400 font-black rounded-2xl cursor-not-allowed"
                >
                  Enter Email to Continue
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3: Success -->
          <div v-else-if="step === 3" class="text-center py-16 animate-fade-in">
            <div class="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <span class="text-5xl">✅</span>
            </div>
            
            <h2 class="text-3xl font-black text-stone-900 dark:text-white mb-4 tracking-tighter uppercase">Agreement Ready!</h2>
            <p class="text-stone-500 dark:text-stone-400 mb-10 max-w-sm mx-auto font-medium">
              Your tenancy agreement has been generated. Download it now or share with the other party.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink 
                :to="`/contract/preview/${contractId}`"
                class="px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl"
              >
                View & Download
              </NuxtLink>
              <NuxtLink 
                to="/"
                class="px-8 py-4 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold rounded-2xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContractDetails } from '~/types'

const router = useRouter()
const { loading, error, createDraft, finalizeContract } = useContractGenerator()

const step = ref(1)
const formData = ref<ContractDetails | null>(null)
const customerEmail = ref('')
const contractId = ref('')

async function handleFormSubmit(data: ContractDetails) {
  formData.value = data
  
  // Create draft immediately (no user required)
  const contract = await createDraft(data, customerEmail.value || undefined)
  
  if (contract) {
    contractId.value = contract.id
    step.value = 2
  }
}

async function handlePaymentSuccess(reference: string) {
  // Finalize the contract after payment
  const success = await finalizeContract(contractId.value, reference)
  
  if (success) {
    step.value = 3
  }
}
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
