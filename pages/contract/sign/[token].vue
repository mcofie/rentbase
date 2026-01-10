<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Header -->
      <nav class="max-w-4xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <span class="text-white text-xl">⚡</span>
          </div>
          <span class="text-2xl font-black text-stone-900 dark:text-white tracking-tighter">RentBase</span>
        </NuxtLink>
        <ColorSchemeButton />
      </nav>

      <!-- Main Content -->
      <main class="flex-grow px-6 py-8">
        <div class="max-w-2xl mx-auto">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-20">
            <div class="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-stone-500">Loading contract...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-20">
            <div class="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-alert-circle" class="w-10 h-10 text-rose-500" />
            </div>
            <h2 class="text-2xl font-black text-stone-900 dark:text-white mb-2">Invalid Signing Link</h2>
            <p class="text-stone-500 mb-8">{{ error }}</p>
            <NuxtLink to="/" class="text-emerald-500 font-bold hover:underline">Go to Homepage</NuxtLink>
          </div>

          <!-- Already Signed State -->
          <div v-else-if="alreadySigned" class="text-center py-20 animate-fade-in">
            <div class="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-check-circle-2" class="w-10 h-10 text-emerald-500" />
            </div>
            <h2 class="text-2xl font-black text-stone-900 dark:text-white mb-2">Already Signed!</h2>
            <p class="text-stone-500 mb-4">
              You signed this agreement on {{ formatDate(signedAt) }}
            </p>
            <div v-if="contract?.is_fully_signed" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-bold mb-8">
              <UIcon name="i-lucide-check-check" class="w-4 h-4" />
              Both parties have signed
            </div>
            <div v-else class="text-sm text-amber-600 dark:text-amber-400 mb-8">
              Waiting for the other party to sign...
            </div>
            <NuxtLink 
              :to="`/contract/preview/${contract?.id}`"
              class="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-xl hover:scale-105 transition-transform"
            >
              <UIcon name="i-lucide-eye" class="w-4 h-4" />
              View Contract
            </NuxtLink>
          </div>

          <!-- Signing Form -->
          <div v-else-if="contract" class="animate-fade-in">
            <!-- Header -->
            <div class="text-center mb-8">
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <UIcon name="i-lucide-pen-tool" class="w-4 h-4" />
                Digital Signature Required
              </div>
              <h1 class="text-3xl font-black text-stone-900 dark:text-white mb-2 tracking-tighter">
                Sign as {{ partyType === 'landlord' ? 'Landlord' : 'Tenant' }}
              </h1>
              <p class="text-stone-500">
                {{ partyName }}, please review and sign the tenancy agreement below.
              </p>
            </div>

            <!-- Contract Summary -->
            <div class="bg-white dark:bg-stone-900 rounded-[24px] p-6 border border-stone-200 dark:border-stone-800 mb-6">
              <h3 class="text-sm font-black text-stone-400 uppercase tracking-widest mb-4">Agreement Summary</h3>
              
              <div class="grid sm:grid-cols-2 gap-4 mb-6">
                <div class="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
                  <p class="text-xs text-stone-400 uppercase mb-1">Property</p>
                  <p class="font-bold text-stone-900 dark:text-white text-sm">{{ contract.details.property_address }}</p>
                </div>
                <div class="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
                  <p class="text-xs text-stone-400 uppercase mb-1">Monthly Rent</p>
                  <p class="font-bold text-stone-900 dark:text-white text-sm">
                    {{ contract.details.rent_currency }} {{ contract.details.rent_amount.toLocaleString() }}
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <UIcon name="i-lucide-user" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p class="text-xs text-stone-400">Landlord</p>
                    <p class="font-bold text-stone-900 dark:text-white">{{ contract.details.landlord_name }}</p>
                  </div>
                  <UIcon 
                    v-if="contract.landlord_signature" 
                    name="i-lucide-check-circle" 
                    class="w-5 h-5 text-emerald-500 ml-2" 
                  />
                </div>
                
                <UIcon name="i-lucide-arrow-left-right" class="w-4 h-4 text-stone-300" />
                
                <div class="flex items-center gap-3">
                  <div>
                    <p class="text-xs text-stone-400 text-right">Tenant</p>
                    <p class="font-bold text-stone-900 dark:text-white">{{ contract.details.tenant_name }}</p>
                  </div>
                  <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <UIcon name="i-lucide-user-check" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <UIcon 
                    v-if="contract.tenant_signature" 
                    name="i-lucide-check-circle" 
                    class="w-5 h-5 text-emerald-500" 
                  />
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                <NuxtLink 
                  :to="`/contract/preview/${contract.id}`"
                  target="_blank"
                  class="text-sm text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <UIcon name="i-lucide-external-link" class="w-4 h-4" />
                  Read full agreement in new tab
                </NuxtLink>
              </div>
            </div>

            <!-- Signature Section -->
            <div class="bg-white dark:bg-stone-900 rounded-[24px] p-6 border border-stone-200 dark:border-stone-800 mb-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <UIcon name="i-lucide-pen-tool" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 class="font-black text-stone-900 dark:text-white">Your Signature</h3>
                  <p class="text-xs text-stone-500">Draw your signature below</p>
                </div>
              </div>

              <SignaturePad 
                v-model="signature"
                :label="`Sign as ${partyName}`"
                required
              />

              <!-- Agreement Checkbox -->
              <div class="mt-6 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="agreedToTerms"
                    class="mt-1 w-5 h-5 rounded border-stone-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span class="text-sm text-stone-600 dark:text-stone-300">
                    I, <strong>{{ partyName }}</strong>, have read and understood the terms of this 
                    Tenancy Agreement. By signing below, I agree to be legally bound by its terms and conditions.
                  </span>
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <UButton
              block
              size="xl"
              :disabled="!signature || !agreedToTerms"
              :loading="submitting"
              class="rounded-2xl font-black py-5"
              icon="i-lucide-check"
              @click="submitSignature"
            >
              Sign Agreement
            </UButton>

            <p class="text-xs text-stone-400 text-center mt-4">
              Your signature will be securely stored and added to the final document.
            </p>
          </div>

          <!-- Success State -->
          <div v-if="signSuccess" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div class="bg-white dark:bg-stone-900 rounded-[32px] p-8 max-w-md w-full text-center animate-bounce-in">
              <div class="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UIcon name="i-lucide-check-circle-2" class="w-12 h-12 text-emerald-500" />
              </div>
              <h2 class="text-2xl font-black text-stone-900 dark:text-white mb-2">Signature Submitted!</h2>
              <p class="text-stone-500 mb-6">
                Your signature has been securely recorded.
                <span v-if="!contract?.is_fully_signed">
                  The other party will be notified to sign.
                </span>
                <span v-else>
                  Both parties have now signed the agreement.
                </span>
              </p>
              <NuxtLink 
                :to="`/contract/preview/${contract?.id}`"
                class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors"
              >
                <UIcon name="i-lucide-file-text" class="w-4 h-4" />
                View Signed Contract
              </NuxtLink>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contract } from '~/types'

const route = useRoute()
const supabase = useSupabaseClient()

const loading = ref(true)
const error = ref<string | null>(null)
const contract = ref<Contract | null>(null)
const partyType = ref<'landlord' | 'tenant'>('landlord')
const signature = ref<string | null>(null)
const agreedToTerms = ref(false)
const submitting = ref(false)
const signSuccess = ref(false)
const alreadySigned = ref(false)
const signedAt = ref<string | null>(null)

const partyName = computed(() => {
  if (!contract.value) return ''
  return partyType.value === 'landlord' 
    ? contract.value.details.landlord_name 
    : contract.value.details.tenant_name
})

onMounted(async () => {
  const token = route.params.token as string
  
  if (!token) {
    error.value = 'No signing token provided.'
    loading.value = false
    return
  }

  try {
    // Try to find contract by landlord token
    const { data: landlordData, error: landlordError } = await (supabase
      .from('contracts') as any)
      .select('*')
      .eq('landlord_sign_token', token)
      .single()

    if (landlordData) {
      contract.value = landlordData as Contract
      partyType.value = 'landlord'
      
      // Check if already signed
      if (landlordData.landlord_signature) {
        alreadySigned.value = true
        signedAt.value = landlordData.landlord_signed_at
      }
    } else {
      // Try tenant token
      const { data: tenantData, error: tenantError } = await (supabase
        .from('contracts') as any)
        .select('*')
        .eq('tenant_sign_token', token)
        .single()

      if (tenantData) {
        contract.value = tenantData as Contract
        partyType.value = 'tenant'
        
        // Check if already signed
        if (tenantData.tenant_signature) {
          alreadySigned.value = true
          signedAt.value = tenantData.tenant_signed_at
        }
      } else {
        error.value = 'This signing link is invalid or has expired.'
      }
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load contract.'
  } finally {
    loading.value = false
  }
})

async function submitSignature() {
  if (!contract.value || !signature.value || !agreedToTerms.value) return

  submitting.value = true

  try {
    const updateData: any = {}
    const now = new Date().toISOString()

    if (partyType.value === 'landlord') {
      updateData.landlord_signature = signature.value
      updateData.landlord_signed_at = now
    } else {
      updateData.tenant_signature = signature.value
      updateData.tenant_signed_at = now
    }

    // Check if this will complete both signatures
    const otherPartyField = partyType.value === 'landlord' ? 'tenant_signature' : 'landlord_signature'
    if (contract.value[otherPartyField]) {
      updateData.is_fully_signed = true
    }

    const { error: updateError } = await (supabase
      .from('contracts') as any)
      .update(updateData)
      .eq('id', contract.value.id)

    if (updateError) throw updateError

    // Update local state
    if (partyType.value === 'landlord') {
      contract.value.landlord_signature = signature.value
      contract.value.landlord_signed_at = now
    } else {
      contract.value.tenant_signature = signature.value
      contract.value.tenant_signed_at = now
    }
    
    if (updateData.is_fully_signed) {
      contract.value.is_fully_signed = true
    }

    signSuccess.value = true
  } catch (e: any) {
    console.error('Failed to submit signature:', e)
    error.value = e.message || 'Failed to submit signature. Please try again.'
  } finally {
    submitting.value = false
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.8); }
  50% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-bounce-in {
  animation: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
