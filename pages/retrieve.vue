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
          <NuxtLink to="/" class="text-sm text-stone-500 hover:text-stone-900 dark:hover:text-white font-medium">
            Home
          </NuxtLink>
        </div>
      </nav>

      <main class="flex-grow px-6 py-8 sm:py-12">
        <div class="max-w-2xl mx-auto">
          <!-- Page Header -->
          <div class="text-center mb-10 animate-fade-in">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-search" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 class="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white mb-3 tracking-tighter">
              Retrieve Your Report
            </h1>
            <p class="text-stone-500 dark:text-stone-400 font-medium max-w-md mx-auto">
              Enter your email and report ID to access your condition report or tenancy agreement.
            </p>
          </div>

          <!-- Search Form -->
          <div v-if="!result" class="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800 animate-fade-in">
            <form @submit.prevent="searchDocument">
              <!-- Document Type -->
              <div class="mb-6">
                <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block">Document Type</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    @click="docType = 'deposit'"
                    :class="[
                      'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                      docType === 'deposit' 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                    ]"
                  >
                    <UIcon name="i-lucide-shield-check" :class="['w-6 h-6', docType === 'deposit' ? 'text-emerald-600' : 'text-stone-400']" />
                    <span :class="['font-bold text-sm', docType === 'deposit' ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-600 dark:text-stone-400']">
                      Condition Report
                    </span>
                  </button>
                  <button
                    type="button"
                    @click="docType = 'contract'"
                    :class="[
                      'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                      docType === 'contract' 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                    ]"
                  >
                    <UIcon name="i-lucide-file-text" :class="['w-6 h-6', docType === 'contract' ? 'text-emerald-600' : 'text-stone-400']" />
                    <span :class="['font-bold text-sm', docType === 'contract' ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-600 dark:text-stone-400']">
                      Tenancy Agreement
                    </span>
                  </button>
                </div>
              </div>

              <!-- Email -->
              <div class="mb-6">
                <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block">Your Email</label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  class="w-full px-5 py-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-100 dark:border-stone-800 rounded-xl text-base font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-stone-300"
                />
              </div>

              <!-- Report ID -->
              <div class="mb-8">
                <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block">Report / Contract ID</label>
                <input
                  v-model="documentId"
                  type="text"
                  placeholder="e.g., a1b2c3d4-e5f6-..."
                  required
                  class="w-full px-5 py-4 bg-stone-50 dark:bg-stone-950/50 border border-stone-100 dark:border-stone-800 rounded-xl text-base font-medium font-mono text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-stone-300"
                />
              </div>

              <!-- Error -->
              <UAlert
                v-if="error"
                color="error"
                variant="soft"
                :description="error"
                icon="i-lucide-alert-circle"
                class="mb-6"
              />

              <!-- Submit -->
              <UButton
                type="submit"
                block
                size="xl"
                :loading="loading"
                class="rounded-2xl font-black py-4"
                icon="i-lucide-search"
              >
                Find My Document
              </UButton>
            </form>

            <p class="text-xs text-stone-400 text-center mt-6">
              Can't find your document? <a href="mailto:support@rentbase.app" class="text-emerald-500 font-bold hover:underline">Contact Support</a>
            </p>
          </div>

          <!-- Result Found -->
          <div v-else class="animate-fade-in">
            <!-- Success Card -->
            <div class="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800 mb-6">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                  <UIcon name="i-lucide-check-circle-2" class="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h2 class="text-xl font-black text-stone-900 dark:text-white">Document Found!</h2>
                  <p class="text-sm text-stone-500">Your {{ docType === 'deposit' ? 'condition report' : 'tenancy agreement' }} is ready.</p>
                </div>
              </div>

              <!-- Document Info -->
              <div class="space-y-3 mb-6">
                <div class="flex justify-between py-3 border-b border-stone-100 dark:border-stone-800">
                  <span class="text-sm text-stone-500">Document ID</span>
                  <span class="font-mono text-xs text-stone-700 dark:text-stone-300">{{ result.id.slice(0, 12) }}...</span>
                </div>
                <div class="flex justify-between py-3 border-b border-stone-100 dark:border-stone-800">
                  <span class="text-sm text-stone-500">Created</span>
                  <span class="font-bold text-stone-900 dark:text-white">{{ formatDate(result.created_at || result.report_date) }}</span>
                </div>
                <div class="flex justify-between py-3 border-b border-stone-100 dark:border-stone-800">
                  <span class="text-sm text-stone-500">Status</span>
                  <span :class="['font-bold', result.is_finalized ? 'text-emerald-500' : 'text-amber-500']">
                    {{ result.is_finalized ? 'Finalized' : 'Draft' }}
                  </span>
                </div>
                <div v-if="result.property_address" class="flex justify-between py-3">
                  <span class="text-sm text-stone-500">Property</span>
                  <span class="font-bold text-stone-900 dark:text-white text-right max-w-[200px] truncate">{{ result.property_address }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-3">
                <NuxtLink
                  :to="docType === 'deposit' ? `/deposit/view/${result.id}` : `/contract/preview/${result.id}`"
                  class="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  <UIcon name="i-lucide-eye" class="w-5 h-5" />
                  View Document
                </NuxtLink>
                <button
                  @click="downloadDocument"
                  class="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  <UIcon name="i-lucide-download" class="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  @click="result = null"
                  class="w-full py-3 text-stone-500 font-bold hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  Search for Another
                </button>
              </div>
            </div>

            <!-- Expiry Notice -->
            <div class="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-clock" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">Storage Expiry</p>
                  <p class="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                    This document will be stored until {{ expiryDate }}. Download a copy for your permanent records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { downloadConditionReportPDF } from '~/utils/generateReportPDF'
import { downloadContractPDF } from '~/utils/generatePDF'
import type { ConditionReport, Contract, ReportImage } from '~/types'

const supabase = useSupabaseClient()

const docType = ref<'deposit' | 'contract'>('deposit')
const email = ref('')
const documentId = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const result = ref<any>(null)
const reportImages = ref<ReportImage[]>([])

const expiryDate = computed(() => {
  if (!result.value) return ''
  const date = new Date(result.value.created_at || result.value.report_date)
  date.setFullYear(date.getFullYear() + 2)
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
})

async function searchDocument() {
  loading.value = true
  error.value = null

  try {
    if (docType.value === 'deposit') {
      // Search condition reports
      const { data, error: dbError } = await (supabase
        .from('condition_reports') as any)
        .select('*')
        .eq('id', documentId.value)
        .eq('customer_email', email.value)
        .eq('is_finalized', true)
        .single()

      if (dbError || !data) {
        error.value = 'No report found with that ID and email combination. Please check and try again.'
        return
      }

      result.value = data

      // Fetch images
      const { data: images } = await (supabase
        .from('report_images') as any)
        .select('*')
        .eq('report_id', documentId.value)

      reportImages.value = images || []
    } else {
      // Search contracts
      const { data, error: dbError } = await (supabase
        .from('contracts') as any)
        .select('*')
        .eq('id', documentId.value)
        .eq('customer_email', email.value)
        .eq('is_finalized', true)
        .single()

      if (dbError || !data) {
        error.value = 'No contract found with that ID and email combination. Please check and try again.'
        return
      }

      result.value = data
    }
  } catch (e: any) {
    error.value = e.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}

async function downloadDocument() {
  if (!result.value) return

  if (docType.value === 'deposit') {
    const report: ConditionReport = {
      ...result.value,
      images: reportImages.value
    }
    await downloadConditionReportPDF(report, reportImages.value, false)
  } else {
    downloadContractPDF(
      result.value.details,
      false,
      result.value.landlord_signature,
      result.value.tenant_signature
    )
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
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
