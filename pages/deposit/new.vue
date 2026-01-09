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
              @click="$router.back()"
            >
              Back
            </UButton>
            <div v-if="user" class="sm:ml-2">
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>
      
      <main class="px-4 py-8 sm:py-12">
        <div class="max-w-3xl mx-auto">
          <!-- Page Header -->
          <div class="text-center mb-10">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-uni-50 dark:bg-uni-900/20 rounded-[20px] sm:rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-uni-100 dark:border-uni-900/30">
              <span class="text-3xl sm:text-4xl">🛡️</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Deposit Shield
            </h1>
            <p class="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-medium">
              Document property conditions before moving in to protect your deposit
            </p>
          </div>
          
          <!-- Progress Steps (Responsive) -->
          <div class="flex items-center justify-center gap-2 sm:gap-4 mb-12">
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div 
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm',
                  step >= 1 ? 'bg-uni-500 text-white shadow-uni-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                ]"
              >
                1
              </div>
              <span :class="step >= 1 ? 'text-[10px] sm:text-sm font-bold text-gray-900 dark:text-white' : 'text-[10px] sm:text-sm text-gray-400 dark:text-gray-600'">Photos</span>
            </div>
            <div class="w-6 sm:w-12 h-px bg-gray-200 dark:bg-gray-800"></div>
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div 
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm',
                  step >= 2 ? 'bg-uni-500 text-white shadow-uni-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                ]"
              >
                2
              </div>
              <span :class="step >= 2 ? 'text-[10px] sm:text-sm font-bold text-gray-900 dark:text-white' : 'text-[10px] sm:text-sm text-gray-400 dark:text-gray-600'">Review</span>
            </div>
            <div class="w-6 sm:w-12 h-px bg-gray-200 dark:bg-gray-800"></div>
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div 
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm',
                  step >= 3 ? 'bg-uni-500 text-white shadow-uni-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                ]"
              >
                3
              </div>
              <span :class="step >= 3 ? 'text-[10px] sm:text-sm font-bold text-gray-900 dark:text-white' : 'text-[10px] sm:text-sm text-gray-400 dark:text-gray-600'">Final</span>
            </div>
          </div>
          
          <!-- Step 1: Upload Photos -->
          <div v-if="step === 1" class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 class="text-lg font-bold mb-4 dark:text-white">Upload Property Photos</h2>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Take photos of any existing damage, defects, or notable conditions in the property. 
              Add descriptions to each photo for clarity.
            </p>
            
            <PhotoUploader 
              :report-id="reportId"
              @uploaded="handlePhotosUploaded"
            />
            
            <div v-if="uploadedPhotos.length > 0" class="mt-6 pt-6 border-t dark:border-gray-800">
              <UButton 
                size="lg" 
                class="w-full"
                @click="step = 2"
              >
                Continue to Review ({{ uploadedPhotos.length }} photos)
              </UButton>
            </div>
          </div>
          
          <!-- Step 2: Review & Pay -->
          <div v-else-if="step === 2" class="space-y-6">
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 class="text-lg font-bold mb-4 dark:text-white">Review Your Photos</h2>
              
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div 
                  v-for="(photo, index) in uploadedPhotos" 
                  :key="index"
                  class="rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 border dark:border-gray-700"
                >
                  <img 
                    :src="photo.url" 
                    :alt="`Photo ${index + 1}`"
                    class="w-full h-32 object-cover"
                  />
                  <div class="p-2 text-xs font-medium dark:text-gray-300">
                    {{ photo.description || 'No description' }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Payment Card -->
            <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 class="text-lg font-bold mb-4 dark:text-white">Generate Your Report</h2>
              
              <div class="bg-uni-50 dark:bg-uni-900/10 rounded-xl p-4 mb-6">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-bold dark:text-white">Deposit Shield Report</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ uploadedPhotos.length }} photos documented</p>
                  </div>
                  <p class="text-2xl font-black text-uni-600 dark:text-uni-400">GH₵ 25</p>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UIcon name="i-lucide-check-circle-2" class="text-uni-500" />
                  Timestamped PDF report
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UIcon name="i-lucide-check-circle-2" class="text-uni-500" />
                  All photos included with descriptions
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UIcon name="i-lucide-check-circle-2" class="text-uni-500" />
                  Legal evidence for deposit disputes
                </div>
              </div>
              
              <div class="mt-6 flex gap-3">
                <UButton 
                  variant="outline" 
                  size="lg"
                  @click="step = 1"
                >
                  Back
                </UButton>
                
                <PaystackButton
                  v-if="userEmail"
                  feature-type="deposit_report"
                  :email="userEmail"
                  :item-id="reportId"
                  class="flex-1"
                  @success="handlePaymentSuccess"
                >
                  Pay & Generate Report
                </PaystackButton>
              </div>
            </div>
          </div>
          
          <!-- Step 3: Success -->
          <div v-else-if="step === 3" class="text-center py-12">
            <div class="w-20 h-20 bg-lime-100 dark:bg-lime-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-4xl text-lime-600">✅</span>
            </div>
            
            <h2 class="text-2xl font-black mb-2 dark:text-white">Report Generated!</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Your condition report has been created and is ready for download.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <UButton
                size="lg"
                icon="i-lucide-download"
                @click="downloadReport"
              >
                Download PDF
              </UButton>
              
              <UButton
                variant="ghost"
                size="lg"
                to="/"
              >
                Go Home
              </UButton>
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
import { downloadConditionReportPDF } from '~/utils/generateReportPDF'
import type { ConditionReport, ReportImage } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const supabase = useSupabaseClient()
const { user } = useAuth()

const step = ref(1)
const error = ref<string | null>(null)
const reportId = ref('')
const uploadedPhotos = ref<{ url: string; description: string }[]>([])
const paymentRef = ref<string | null>(null)

// Generate unique report ID on mount
const userEmail = computed(() => {
  if (!user.value) return null
  return user.value.email || `${user.value.phone?.replace(/\+/g, '')}@rentbase.app`
})

// Create report on mount
onMounted(async () => {
  if (!user.value) return
  
  try {
    const { data, error: dbError } = await supabase
      .from('condition_reports')
      .insert({
        user_id: user.value.id,
        is_finalized: false,
      })
      .select()
      .single()
    
    if (dbError) throw dbError
    
    reportId.value = data.id
  } catch (err: any) {
    error.value = err.message || 'Failed to create report'
  }
})

// Handle photos uploaded
async function handlePhotosUploaded(photos: { url: string; description: string }[]) {
  uploadedPhotos.value = photos
  
  // Save images to database
  try {
    const imagesToInsert = photos.map(photo => ({
      report_id: reportId.value,
      image_url: photo.url,
      defect_description: photo.description || null,
    }))
    
    const { error: dbError } = await supabase
      .from('report_images')
      .insert(imagesToInsert)
    
    if (dbError) throw dbError
  } catch (err: any) {
    error.value = err.message || 'Failed to save images'
  }
}

// Handle payment success
async function handlePaymentSuccess(reference: string) {
  paymentRef.value = reference
  
  try {
    // Update report as finalized
    const { error: dbError } = await supabase
      .from('condition_reports')
      .update({
        is_finalized: true,
        payment_ref: reference,
      })
      .eq('id', reportId.value)
    
    if (dbError) throw dbError
    
    step.value = 3
  } catch (err: any) {
    error.value = err.message || 'Failed to finalize report'
  }
}

// Download the report
async function downloadReport() {
  const report: ConditionReport = {
    id: reportId.value,
    user_id: user.value?.id || '',
    payment_ref: paymentRef.value,
    is_finalized: true,
    report_date: new Date().toISOString(),
  }
  
  const images: ReportImage[] = uploadedPhotos.value.map((photo, index) => ({
    id: index,
    report_id: reportId.value,
    image_url: photo.url,
    defect_description: photo.description || null,
  }))
  
  await downloadConditionReportPDF(report, images, false)
}
</script>
