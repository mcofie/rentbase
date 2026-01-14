<template>
  <main class="mx-auto px-6 py-8 sm:py-12 flex-grow">
        <div class="max-w-2xl mx-auto">
          <!-- Page Header -->
          <div class="text-center mb-10 animate-fade-in">
            <div class="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-search" class="w-6 h-6 text-stone-600 dark:text-stone-400" />
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-3 tracking-tight font-serif">
              Retrieve Your Report
            </h1>
            <p class="text-stone-500 dark:text-stone-400 font-medium max-w-md mx-auto">
              Enter your email and report ID to access your condition report or tenancy agreement.
            </p>
          </div>

          <!-- Search Form -->
          <div v-if="!result" class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 animate-fade-in shadow-sm">
            <form @submit.prevent="searchDocument">
              <!-- Document Type -->
              <div class="mb-6">
                <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 block">Document Type</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    @click="docType = 'deposit'"
                    :class="[
                      'p-4 rounded-lg border transition-all flex flex-col items-center gap-2',
                      docType === 'deposit' 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 hover:bg-stone-50'
                    ]"
                  >
                    <UIcon name="i-lucide-shield-check" :class="['w-5 h-5', docType === 'deposit' ? 'text-purple-600' : 'text-stone-400']" />
                    <span :class="['font-medium text-sm', docType === 'deposit' ? 'text-purple-700 dark:text-purple-300' : 'text-stone-600 dark:text-stone-400']">
                      Condition Report
                    </span>
                  </button>
                  <button
                    type="button"
                    @click="docType = 'contract'"
                    :class="[
                      'p-4 rounded-lg border transition-all flex flex-col items-center gap-2',
                      docType === 'contract' 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 hover:bg-stone-50'
                    ]"
                  >
                    <UIcon name="i-lucide-file-text" :class="['w-5 h-5', docType === 'contract' ? 'text-emerald-600' : 'text-stone-400']" />
                    <span :class="['font-medium text-sm', docType === 'contract' ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-600 dark:text-stone-400']">
                      Tenancy Agreement
                    </span>
                  </button>
                </div>
              </div>

              <!-- Email -->
              <div class="mb-6">
                <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 block">Your Email</label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg text-sm font-medium text-stone-900 dark:text-white focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition-all placeholder-stone-300"
                />
              </div>

              <!-- Report ID -->
              <div class="mb-8">
                <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 block">Report Code / Contract ID</label>
                <input
                  v-model="documentId"
                  type="text"
                  placeholder="e.g., 8-char code (ABC123XY) or full ID"
                  required
                  class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg text-sm font-medium font-mono text-stone-900 dark:text-white focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition-all placeholder-stone-300"
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
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-medium rounded-lg hover:bg-stone-800 dark:hover:bg-stone-100 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
                 <span v-else>Find My Document</span>
              </button>
            </form>

            <p class="text-xs text-stone-400 text-center mt-6">
              Can't find your document? <a href="mailto:support@rentbase.app" class="text-stone-900 font-bold hover:underline">Contact Support</a>
            </p>
          </div>

          <!-- Result Found -->
          <div v-else class="animate-fade-in">
            <!-- Success Card -->
            <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 mb-6 shadow-sm">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <UIcon name="i-lucide-check-circle-2" class="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 class="text-xl font-bold text-stone-900 dark:text-white font-serif">Document Found!</h2>
                  <p class="text-sm text-stone-500">Your {{ docType === 'deposit' ? 'condition report' : 'tenancy agreement' }} is ready.</p>
                </div>
              </div>

              <!-- Document Info -->
              <div class="space-y-3 mb-6">
                <div class="flex justify-between py-3 border-b border-stone-100 dark:border-stone-800">
                  <span class="text-sm text-stone-500">Document ID</span>
                  <span class="font-mono text-xs text-stone-700 dark:text-stone-300">
                    {{ result.short_code || result.id.slice(0, 12) + '...' }}
                  </span>
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
                  class="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-medium rounded-lg hover:bg-stone-800 dark:hover:bg-stone-100 transition-all flex items-center justify-center gap-2"
                >
                  <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  View Document
                </NuxtLink>
                <button
                  @click="downloadDocument"
                  class="w-full py-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-medium rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-all flex items-center justify-center gap-2"
                >
                  <UIcon name="i-lucide-download" class="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  @click="result = null"
                  class="w-full py-3 text-stone-500 font-medium hover:text-stone-900 dark:hover:text-white transition-colors text-sm"
                >
                  Search for Another
                </button>
              </div>
            </div>

            <!-- Expiry Notice -->
            <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-stone-100 dark:border-stone-800">
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-clock" class="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-xs font-bold text-red-700 dark:text-red-300 mb-1">Storage Expiry</p>
                  <p class="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                    This document will be stored until {{ expiryDate }}. Download a copy for your permanent records.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
      let query = supabase
        .from('condition_reports')
        .select('*')
        .eq('customer_email', email.value)
        .eq('is_finalized', true)
        
      // Check if ID is short code (e.g. 8 chars) or UUID
      if (documentId.value.trim().length <= 10) {
        query = query.eq('short_code', documentId.value.trim())
      } else {
        query = query.eq('id', documentId.value.trim())
      }
      
      const { data, error: dbError } = await query.single()

      if (dbError || !data) {
        error.value = 'No report found with that ID/Code and email combination. Please check and try again.'
        return
      }

      result.value = data

      // Fetch images
      const { data: images } = await (supabase
        .from('report_images') as any)
        .select('*')
        .eq('report_id', data.id) // Ensure we use the full ID for images fetch

      reportImages.value = images || []
    } else {
      // Search contracts
      const { data, error: dbError } = await (supabase
        .from('contracts') as any)
        .select('*')
        .eq('id', documentId.value.trim())
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
