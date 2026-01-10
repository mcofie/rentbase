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
      
      <main class="px-6 py-8 sm:py-12 flex-grow">
        <div class="max-w-3xl mx-auto">
          <!-- Page Header -->
          <div class="text-center mb-10 animate-fade-in">
            <p class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">Deposit Shield</p>
            <h1 class="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white mb-3 tracking-tighter">
              Secure Your Deposit
            </h1>
            <p class="text-stone-500 dark:text-stone-400 font-medium">
              Document property conditions before moving in.
            </p>
          </div>
          
          <!-- Progress Steps -->
          <div class="flex items-center justify-center gap-4 mb-12">
            <div class="flex items-center gap-2">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all', step >= 1 ? 'bg-emerald-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-400']">1</div>
              <span :class="['text-xs font-bold uppercase tracking-widest', step >= 1 ? 'text-stone-900 dark:text-white' : 'text-stone-400']">Photos</span>
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
          
          <!-- Step 1: Upload Photos -->
          <div v-if="step === 1" class="bg-white dark:bg-stone-900 rounded-[40px] p-8 border border-stone-200 dark:border-stone-800 animate-fade-in">
            <h2 class="text-xl font-black text-stone-900 dark:text-white mb-2 tracking-tighter uppercase">Upload Property Photos</h2>
            <p class="text-stone-500 dark:text-stone-400 text-sm mb-8">
              Take photos of any existing damage, defects, or notable conditions.
            </p>
            
            <PhotoUploader 
              :report-id="reportId"
              @uploaded="handlePhotosUploaded"
            />
            
            <div v-if="uploadedPhotos.length > 0" class="mt-8 pt-8 border-t border-stone-100 dark:border-stone-800">
              <button 
                class="w-full py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                @click="step = 2"
              >
                Continue to Payment ({{ uploadedPhotos.length }} photos)
              </button>
            </div>
          </div>
          
          <!-- Step 2: Email & Payment -->
          <div v-else-if="step === 2" class="animate-fade-in space-y-6">
            <!-- Photo Review -->
            <div class="bg-white dark:bg-stone-900 rounded-[40px] p-8 border border-stone-200 dark:border-stone-800">
              <h2 class="text-lg font-black text-stone-900 dark:text-white mb-6 tracking-tighter uppercase">Review Photos</h2>
              <div class="grid grid-cols-3 gap-3">
                <div 
                  v-for="(photo, index) in uploadedPhotos" 
                  :key="index"
                  class="rounded-2xl overflow-hidden bg-stone-50 dark:bg-stone-800"
                >
                  <img 
                    :src="photo.url" 
                    :alt="`Photo ${index + 1}`"
                    class="w-full h-24 object-cover"
                  />
                </div>
              </div>
            </div>

            <!-- Payment Card -->
            <div class="bg-white dark:bg-stone-900 rounded-[40px] p-8 border border-stone-200 dark:border-stone-800">
              <h2 class="text-xl font-black text-stone-900 dark:text-white mb-8 tracking-tighter text-center uppercase">Complete Payment</h2>
              
              <div class="bg-stone-50 dark:bg-stone-950/50 rounded-3xl p-6 mb-8">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-bold text-stone-900 dark:text-white">Deposit Shield Report</p>
                    <p class="text-xs text-stone-500">{{ uploadedPhotos.length }} photos documented</p>
                  </div>
                  <p class="text-3xl font-black text-emerald-500">GH₵ 25</p>
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
                  v-if="customerEmail && reportId"
                  feature-type="deposit_report"
                  :email="customerEmail"
                  :item-id="reportId"
                  class="flex-1"
                  @success="handlePaymentSuccess"
                >
                  Pay GH₵ 25
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
            
            <h2 class="text-3xl font-black text-stone-900 dark:text-white mb-4 tracking-tighter uppercase">Report Ready!</h2>
            <p class="text-stone-500 dark:text-stone-400 mb-10 max-w-sm mx-auto font-medium">
              Your condition report has been generated. Download it now for your records.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                class="px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black rounded-2xl hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2"
                @click="downloadReport"
              >
                <UIcon name="i-lucide-download" class="w-5 h-5" />
                Download PDF
              </button>
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
import { downloadConditionReportPDF } from '~/utils/generateReportPDF'
import type { ConditionReport, ReportImage } from '~/types'

const supabase = useSupabaseClient()

const step = ref(1)
const error = ref<string | null>(null)
const reportId = ref('')
const customerEmail = ref('')
const uploadedPhotos = ref<{ url: string; description: string }[]>([])
const paymentRef = ref<string | null>(null)

// Create a report ID on mount (anonymous, no user needed)
onMounted(async () => {
  try {
    const { data, error: dbError } = await (supabase
      .from('condition_reports') as any)
      .insert({
        is_finalized: false,
      })
      .select()
      .single()
    
    if (dbError) throw dbError
    
    reportId.value = data.id
  } catch (err: any) {
    error.value = err.message || 'Failed to initialize report'
  }
})

// Handle photos uploaded
function handlePhotosUploaded(photos: { url: string; description: string }[]) {
  uploadedPhotos.value = photos
}

// Handle payment success
async function handlePaymentSuccess(reference: string) {
  paymentRef.value = reference
  
  try {
    // Update report as finalized with email
    const { error: dbError } = await (supabase
      .from('condition_reports') as any)
      .update({
        is_finalized: true,
        payment_ref: reference,
        customer_email: customerEmail.value,
      })
      .eq('id', reportId.value)
    
    if (dbError) throw dbError
    
    // Save images to database
    if (uploadedPhotos.value.length > 0) {
      const imagesToInsert = uploadedPhotos.value.map(photo => ({
        report_id: reportId.value,
        image_url: photo.url,
        defect_description: photo.description || null,
      }))
      
      await (supabase.from('report_images') as any).insert(imagesToInsert)
    }
    
    step.value = 3
  } catch (err: any) {
    error.value = err.message || 'Failed to finalize report'
  }
}

// Download the report
async function downloadReport() {
  const report: ConditionReport = {
    id: reportId.value,
    user_id: '',
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

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
