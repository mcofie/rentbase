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
      
      <main class="px-6 py-8 sm:py-12 flex-grow">
        <div :class="['mx-auto', step === 2 ? 'max-w-5xl' : 'max-w-3xl']">
          <!-- Page Header -->
          <div class="text-center mb-10 animate-fade-in">
             <div class="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4">
               <span class="w-2 h-2 rounded-full bg-purple-500"></span>
               Deposit Shield
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
             <div :class="['flex items-center gap-2 px-2.5 py-1 rounded-md transition-all', step === 1 ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white font-bold' : 'hover:text-stone-600']">
               <span>1. Photos</span>
             </div>
             <span class="text-stone-200 dark:text-stone-700">/</span>
             <div :class="['flex items-center gap-2 px-2.5 py-1 rounded-md transition-all', step === 2 ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white font-bold' : 'hover:text-stone-600']">
               <span>2. Preview</span>
             </div>
             <span class="text-stone-200 dark:text-stone-700">/</span>
             <div :class="['flex items-center gap-2 px-2.5 py-1 rounded-md transition-all', step === 3 ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white font-bold' : 'hover:text-stone-600']">
               <span>3. Pay</span>
             </div>
             <span class="text-stone-200 dark:text-stone-700">/</span>
             <div :class="['flex items-center gap-2 px-2.5 py-1 rounded-md transition-all', step === 4 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 font-bold' : 'hover:text-stone-600']">
               <span>4. Done</span>
             </div>
          </div>
          
          <!-- Step 1: Upload Photos -->
          <div v-if="step === 1" class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 shadow-sm animate-fade-in">
            <h2 class="text-xl font-bold text-stone-900 dark:text-white mb-2 font-serif">Document Property</h2>
            <p class="text-stone-500 dark:text-stone-400 text-sm mb-6 max-w-lg">
              Take clear photos of any existing damage, defects, or notable conditions before moving in.
            </p>
            
            <!-- Property Address Input -->
            <div class="mb-8">
              <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Property Address (Optional)</label>
              <input 
                v-model="propertyAddress"
                type="text"
                placeholder="e.g., 123 Main Street, Accra"
                class="w-full px-4 py-3 bg-white dark:bg-stone-950/50 border border-stone-200 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-white focus:ring-1 focus:ring-stone-900 dark:focus:ring-white focus:border-stone-900 transition-all placeholder-stone-300"
              />
            </div>
            
            <!-- Room-by-Room Photo Uploader -->
            <RoomPhotoUploader 
              :report-id="reportId"
              @uploaded="handlePhotosUploaded"
            />
            
            <div v-if="uploadedPhotos.length > 0" class="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800">
              <button 
                class="w-full py-3.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                @click="goToPreview"
              >
                Preview Report ({{ uploadedPhotos.length }} photos)
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Step 2: Preview -->
          <div v-else-if="step === 2" class="animate-fade-in">
            <div class="grid lg:grid-cols-3 gap-8">
              <!-- Preview -->
              <div class="lg:col-span-2 order-2 lg:order-1">
                <DepositPreview 
                  :report-id="reportId"
                  :photos="uploadedPhotos"
                  :property-address="propertyAddress"
                />
              </div>

              <!-- Action Sidebar -->
              <div class="space-y-6 order-1 lg:order-2">
                <!-- Summary Card -->
                <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 rounded-md bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                      <UIcon name="i-lucide-shield-check" class="w-4 h-4 text-purple-700" />
                    </div>
                    <div>
                      <h3 class="font-bold text-stone-900 dark:text-white">Report Summary</h3>
                      <p class="text-xs text-stone-400">Deposit Shield</p>
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <div class="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                      <span class="text-sm text-stone-500">Photos</span>
                      <span class="font-bold text-stone-900 dark:text-white">{{ uploadedPhotos.length }}</span>
                    </div>
                    <div class="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                      <span class="text-sm text-stone-500">Storage</span>
                      <span class="font-bold text-purple-600">2 Years</span>
                    </div>
                    <div class="flex justify-between py-2">
                      <span class="text-sm text-stone-500">Report Fee</span>
                      <span class="font-bold text-lg text-stone-900 dark:text-white">GH₵ 25</span>
                    </div>
                  </div>
                </div>

                <!-- Approval Card -->
                <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
                  <h3 class="font-bold text-stone-900 dark:text-white mb-4">Looks Good?</h3>
                  
                  <div class="space-y-3">
                    <UButton
                      block
                      size="lg"
                      class="rounded-lg font-medium"
                      color="primary"
                      icon="i-lucide-credit-card"
                      @click="step = 3"
                    >
                      Continue to Payment
                    </UButton>
                    <UButton
                      variant="ghost"
                      color="neutral"
                      block
                      size="lg"
                      class="rounded-lg font-medium"
                      icon="i-lucide-plus"
                      @click="step = 1"
                    >
                      Add More Photos
                    </UButton>
                  </div>
                </div>

                <!-- Download Draft -->
                <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
                  <p class="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Draft Options</p>
                  <UButton
                    variant="outline"
                    color="neutral"
                    block
                    size="lg"
                    class="rounded-lg font-medium"
                    icon="i-lucide-download"
                    @click="downloadDraftReport"
                  >
                    Download Draft PDF
                  </UButton>
                  <p class="text-xs text-stone-400 mt-3 text-center">
                    Draft contains watermark. Pay to get official report.
                  </p>
                </div>

                <!-- Info Card -->
                <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-stone-100 dark:border-stone-800">
                  <div class="flex items-start gap-3">
                    <UIcon name="i-lucide-info" class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">Secure Storage</p>
                      <p class="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                        Your photos are stored for 2 years. Retrieve anytime with your email or report ID.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Step 3: Email & Payment -->
          <div v-else-if="step === 3" class="animate-fade-in space-y-6 max-w-xl mx-auto">
            <!-- Payment Card -->
            <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 shadow-sm">
              <div class="flex items-center justify-center mb-6">
                <div class="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-md flex items-center justify-center">
                  <UIcon name="i-lucide-credit-card" class="w-5 h-5 text-purple-700" />
                </div>
              </div>
              
              <h2 class="text-2xl font-bold text-stone-900 dark:text-white mb-2 text-center font-serif">Complete Payment</h2>
              <p class="text-stone-500 text-center mb-8 text-sm">Secure payment via Paystack</p>
              
              <div class="bg-stone-50 dark:bg-stone-950/50 rounded-lg p-6 mb-8 border border-stone-100 dark:border-stone-800">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-bold text-stone-900 dark:text-white">Deposit Shield Report</p>
                    <p class="text-xs text-stone-500">{{ uploadedPhotos.length }} photos • 2 years storage</p>
                  </div>
                  <p class="text-xl font-bold text-stone-900 dark:text-white">GH₵ 25</p>
                </div>
              </div>

              <!-- Email Input -->
              <div class="mb-8">
                <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Your Email</label>
                <input 
                  v-model="customerEmail"
                  type="email"
                  placeholder="you@example.com"
                  class="w-full px-4 py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-sm text-stone-900 dark:text-white focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition-all placeholder-stone-300"
                />
                <p class="text-xs text-stone-400 mt-2">
                  💡 Use this email to retrieve your report anytime in the next 2 years
                </p>
              </div>

              <div class="flex gap-3">
                <UButton variant="ghost" color="neutral" size="lg" class="rounded-lg" @click="step = 2">Back</UButton>
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
                  class="flex-1 py-3 bg-stone-100 dark:bg-stone-800 text-stone-400 font-medium rounded-lg cursor-not-allowed text-sm"
                >
                  Enter Email
                </button>
              </div>
            </div>
          </div>
          
          <!-- Step 4: Success -->
          <div v-else-if="step === 4" class="text-center py-16 animate-fade-in">
            <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-check-circle-2" class="w-8 h-8 text-emerald-600" />
            </div>
            
            <h2 class="text-3xl font-bold text-stone-900 dark:text-white mb-4 font-serif">Report Ready!</h2>
            <p class="text-stone-500 dark:text-stone-400 mb-6 max-w-sm mx-auto font-medium">
              Your condition report has been securely stored and is ready for download.
            </p>

            <!-- Retrieval Info -->
            <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 max-w-md mx-auto mb-10 shadow-sm">
              <div class="flex items-center gap-3 mb-4">
                <UIcon name="i-lucide-key" class="w-4 h-4 text-emerald-500" />
                <span class="font-bold text-stone-900 dark:text-white text-sm">Your Report ID</span>
              </div>
              <div class="bg-stone-50 dark:bg-stone-800 rounded-md p-3 font-mono text-xs text-stone-700 dark:text-stone-300 break-all border border-stone-200 dark:border-stone-700">
                {{ reportId }}
              </div>
              <p class="text-xs text-stone-400 mt-3">
                Save this ID! Use it with your email ({{ customerEmail }}) to retrieve your report anytime before {{ retrievalDeadline }}.
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
              <button 
                class="px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 font-medium"
                @click="downloadReport"
              >
                <UIcon name="i-lucide-download" class="w-4 h-4" />
                Download PDF
              </button>
              <button 
                @click="shareViaWhatsApp"
                class="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 font-medium"
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
import { downloadConditionReportPDF } from '~/utils/generateReportPDF'
import type { ConditionReport, ReportImage } from '~/types'

const router = useRouter()
const config = useRuntimeConfig()
const supabase = useSupabaseClient()

const step = ref(1)
const error = ref<string | null>(null)
const reportId = ref('')
const propertyAddress = ref('')
const customerEmail = ref('')
const uploadedPhotos = ref<{ url: string; description: string; room?: string }[]>([])
const paymentRef = ref<string | null>(null)

const stepTitles = [
  'Document Conditions',
  'Preview Report',
  'Complete Payment',
  'Report Ready!'
]

const stepDescriptions = [
  'Take photos of property conditions before moving in.',
  'Review your photos and report details.',
  'Pay to secure your report for 2 years.',
  'Download and share your official report.'
]

const retrievalDeadline = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 2)
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
})

const uniqueRooms = computed(() => {
  const rooms = new Set(uploadedPhotos.value.map(p => p.room || 'other'))
  return rooms.size
})

const reportSmsMessage = computed(() => {
  return `DEPOSIT SHIELD REPORT\n` +
    `Property: ${propertyAddress.value || 'N/A'}\n` +
    `Photos: ${uploadedPhotos.value.length}\n` +
    `Report ID: ${reportId.value.slice(0, 8)}...\n` +
    `Retrieve at: rentbase.app/retrieve\n` +
    `- RentBase`
})

// Create a report ID on mount
onMounted(async () => {
  try {
    const { data, error: dbError } = await (supabase
      .from('condition_reports') as any)
      .insert({
        is_finalized: false,
        property_address: propertyAddress.value || null,
        report_type: 'move_in',
      })
      .select()
      .single()
    
    if (dbError) throw dbError
    
    reportId.value = data.id
  } catch (err: any) {
    error.value = err.message || 'Failed to initialize report'
  }
})

function handleBack() {
  if (step.value > 1) {
    step.value--
  } else {
    router.back()
  }
}

function handlePhotosUploaded(photos: { url: string; description: string }[]) {
  uploadedPhotos.value = photos
}

async function goToPreview() {
  // Update property address if provided
  if (propertyAddress.value && reportId.value) {
    await (supabase.from('condition_reports') as any)
      .update({ property_address: propertyAddress.value })
      .eq('id', reportId.value)
  }
  step.value = 2
}

async function handlePaymentSuccess(reference: string) {
  paymentRef.value = reference
  
  try {
    // Update report as finalized
    const { error: dbError } = await (supabase
      .from('condition_reports') as any)
      .update({
        is_finalized: true,
        payment_ref: reference,
        customer_email: customerEmail.value,
        property_address: propertyAddress.value || null,
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
    
    step.value = 4
  } catch (err: any) {
    error.value = err.message || 'Failed to finalize report'
  }
}

async function downloadReport() {
  const report: ConditionReport = {
    id: reportId.value,
    user_id: null,
    customer_email: customerEmail.value,
    payment_ref: paymentRef.value,
    property_address: propertyAddress.value,
    report_type: 'move_in',
    is_finalized: true,
    report_date: new Date().toISOString(),
  }
  
  const images: ReportImage[] = uploadedPhotos.value.map((photo, index) => ({
    id: index,
    report_id: reportId.value,
    image_url: photo.url,
    room_name: null,
    defect_description: photo.description || null,
  }))
  
  await downloadConditionReportPDF(report, images, false)
}

async function downloadDraftReport() {
  const report: ConditionReport = {
    id: reportId.value,
    user_id: null,
    customer_email: null,
    payment_ref: null,
    property_address: propertyAddress.value,
    report_type: 'move_in',
    is_finalized: false,
    report_date: new Date().toISOString(),
  }
  
  const images: ReportImage[] = uploadedPhotos.value.map((photo, index) => ({
    id: index,
    report_id: reportId.value,
    image_url: photo.url,
    room_name: null,
    defect_description: photo.description || null,
  }))
  
  await downloadConditionReportPDF(report, images, true)
}

function shareViaWhatsApp() {
  const baseUrl = config.public.appUrl || 'http://localhost:3000'
  const message = `*DEPOSIT SHIELD - CONDITION REPORT*\n\n` +
    `📍 Property: ${propertyAddress.value || 'Not specified'}\n` +
    `📸 Photos: ${uploadedPhotos.value.length} documented\n` +
    `🔒 Storage: 7 years\n\n` +
    `Report ID: ${reportId.value}\n\n` +
    `_Powered by RentBase - Deposit Shield_`
  
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
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
