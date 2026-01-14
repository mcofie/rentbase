<template>
  <main class="min-h-screen bg-stone-50 dark:bg-stone-950 px-4 py-8 sm:py-12 flex flex-col">
    <!-- Back Button Row -->
    <div class="max-w-3xl mx-auto w-full mb-6">
      <button 
        @click="$router.push('/retrieve')"
        class="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back to Search
      </button>
    </div>

    <div class="max-w-3xl mx-auto w-full flex-grow pb-24">
      
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 animate-pulse">
        <div class="h-8 w-64 bg-stone-200 dark:bg-stone-800 rounded mb-4"></div>
        <div class="h-4 w-48 bg-stone-200 dark:bg-stone-800 rounded"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center px-4">
        <div class="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 ring-1 ring-red-100 dark:ring-red-900/30">
          <UIcon name="i-lucide-file-x" class="w-8 h-8 text-red-500" />
        </div>
        <h1 class="text-2xl font-bold text-stone-900 dark:text-white mb-2">Report Not Found</h1>
        <p class="text-stone-500 dark:text-stone-400 mb-8 max-w-sm mx-auto">{{ error }}</p>
        <NuxtLink to="/retrieve" class="px-6 py-3 bg-[#050505] dark:bg-white text-white dark:text-stone-900 rounded-lg font-medium hover:bg-stone-800 transition-colors">
          Search Again
        </NuxtLink>
      </div>

      <!-- Report Content -->
      <div v-else-if="report" class="space-y-6 animate-fade-in-up">
        
        <!-- Header Section -->
        <div class="text-center mb-8">
           <div class="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4">
             <span class="w-2 h-2 rounded-full bg-purple-500"></span>
             Deposit Shield
           </div>
           
           <h1 class="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-3 tracking-tight font-serif">
             Condition Report
           </h1>
           
           <p class="text-stone-500 dark:text-stone-400 font-medium">
             {{ report.property_address || 'Address not specified' }}
           </p>
        </div>

        <!-- Summary Card -->
        <div class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
          <!-- Status Badge -->
          <div class="absolute top-6 right-6">
            <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ring-1 ring-inset', report.is_finalized ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/10 dark:text-emerald-400 dark:ring-emerald-500/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20']">
              <span :class="['w-1.5 h-1.5 rounded-full', report.is_finalized ? 'bg-emerald-500' : 'bg-amber-500']"></span>
              {{ report.is_finalized ? 'Finalized' : 'Draft' }}
            </span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Report ID</p>
              <p class="font-mono font-medium text-stone-900 dark:text-white text-sm">
                {{ report.short_code || report.id.slice(0, 8).toUpperCase() }}
              </p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Date</p>
              <p class="font-medium text-stone-900 dark:text-white text-sm">
                {{ formatDate(report.report_date || report.created_at || '') }}
              </p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Photos</p>
              <p class="font-medium text-stone-900 dark:text-white text-sm">{{ images.length }} Documented</p>
            </div>
          </div>
        </div>

        <!-- Photos Section -->
        <div class="bg-white dark:bg-stone-900 rounded-xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-stone-900 dark:text-white font-serif">Property Photos</h2>
            <span class="text-xs font-medium text-stone-400">{{ images.length }} items</span>
          </div>
          
          <div v-if="images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <button 
              v-for="(image, index) in images" 
              :key="image.id"
              class="group relative aspect-square bg-stone-100 dark:bg-stone-800 rounded-lg overflow-hidden ring-1 ring-stone-900/5 dark:ring-white/10"
              @click="openLightbox(index)"
            >
              <img 
                :src="image.image_url" 
                :alt="image.defect_description || 'Property condition'" 
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              <!-- Simple Overlay -->
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                 <UIcon name="i-lucide-maximize-2" class="w-6 h-6 text-white drop-shadow-md" />
              </div>
              
              <!-- Description Tag -->
              <div v-if="image.defect_description" class="absolute bottom-2 left-2 right-2">
                <div class="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded truncate">
                  {{ image.defect_description }}
                </div>
              </div>
            </button>
          </div>

          <!-- Empty State -->
          <div v-else class="py-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-stone-100 dark:border-stone-800 rounded-lg">
            <UIcon name="i-lucide-image-off" class="w-10 h-10 text-stone-300 mb-2" />
            <p class="text-stone-400 font-medium text-sm">No photos available</p>
          </div>
        </div>
        
        <!-- Footer Info -->
        <div class="text-center">
          <p class="text-xs text-stone-400">
            Securely stored by RentBase • ID: {{ report.id }}
          </p>
        </div>

        <!-- Action Bar -->
        <div class="fixed bottom-6 left-4 right-4 z-40 mx-auto max-w-md">
          <div class="bg-white dark:bg-stone-800 p-2 rounded-xl shadow-xl shadow-stone-200/50 dark:shadow-black/50 border border-stone-200 dark:border-stone-700 flex gap-2">
            <button 
              @click="shareReport"
              class="flex-1 py-3 px-4 bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-white rounded-lg font-medium text-sm hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors flex items-center justify-center gap-2"
            >
              <UIcon name="i-lucide-share-2" class="w-4 h-4" />
              Share
            </button>
            <button 
              @click="downloadReport"
              class="flex-1 py-3 px-4 bg-[#050505] dark:bg-white text-white dark:text-stone-900 rounded-lg font-medium text-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-stone-900/20"
            >
              <UIcon name="i-lucide-download" class="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox remains the same -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="lightboxOpen" 
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click.self="closeLightbox"
        >
          <div class="absolute inset-0 bg-stone-950/95 backdrop-blur-sm" @click="closeLightbox"></div>
          
          <div class="relative max-w-4xl max-h-[90vh] w-full flex flex-col justify-center h-full">
            <button 
              @click="closeLightbox"
              class="absolute top-4 right-0 z-50 p-4 text-white/50 hover:text-white transition-colors"
            >
              <UIcon name="i-lucide-x" class="w-8 h-8" />
            </button>
            
            <div class="relative flex-1 flex items-center justify-center min-h-0 py-12">
               <img 
                :src="images[lightboxIndex]?.image_url" 
                :alt="images[lightboxIndex]?.defect_description || 'Property condition'"
                class="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>
            
            <div class="text-center pb-8">
               <p v-if="images[lightboxIndex]?.defect_description" class="text-white font-medium text-lg">
                 {{ images[lightboxIndex].defect_description }}
               </p>
               <p class="text-stone-500 text-sm mt-1">{{ lightboxIndex + 1 }} of {{ images.length }}</p>
            </div>

            <!-- Navigation -->
            <button 
              v-if="lightboxIndex > 0"
              @click.stop="lightboxIndex--"
              class="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors"
            >
              <UIcon name="i-lucide-chevron-left" class="w-10 h-10" />
            </button>
            <button 
              v-if="lightboxIndex < images.length - 1"
              @click.stop="lightboxIndex++"
              class="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors"
            >
              <UIcon name="i-lucide-chevron-right" class="w-10 h-10" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { downloadConditionReportPDF } from '~/utils/generateReportPDF'
import type { ConditionReport, ReportImage } from '~/types'

const route = useRoute()
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const loading = ref(true)
const error = ref<string | null>(null)
const report = ref<ConditionReport | null>(null)
const images = ref<ReportImage[]>([])

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

onMounted(async () => {
  const id = route.params.id as string
  
  if (!id) {
    error.value = 'No report ID provided'
    loading.value = false
    return
  }

  try {
    // Fetch report
    const { data: reportData, error: reportError } = await (supabase
      .from('condition_reports') as any)
      .select('*')
      .eq('id', id)
      .single()

    if (reportError || !reportData) {
      error.value = 'Report not found or has been deleted.'
      loading.value = false
      return
    }

    report.value = reportData

    // Fetch images
    const { data: imagesData } = await (supabase
      .from('report_images') as any)
      .select('*')
      .eq('report_id', id)
      .order('id', { ascending: true })

    images.value = imagesData || []
  } catch (e: any) {
    error.value = e.message || 'Failed to load report'
  } finally {
    loading.value = false
  }
})

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

async function downloadReport() {
  if (!report.value) return
  await downloadConditionReportPDF(report.value, images.value, false)
}

function shareReport() {
  if (!report.value) return
  
  const baseUrl = config.public.appUrl || 'http://localhost:3000'
  const code = report.value.short_code || report.value.id.slice(0, 8)
  
  const message = `DEPOSIT SHIELD REPORT\n\n` +
    `Property: ${report.value.property_address || 'See report'}\n` +
    `Photos: ${images.value.length} documented\n` +
    `Code: ${code}\n\n` +
    `View: ${baseUrl}/deposit/view/${report.value.id}\n\n` +
    `- RentBase`
  
  if (navigator.share) {
    navigator.share({
      title: 'Deposit Shield Report',
      text: message,
      url: `${baseUrl}/deposit/view/${report.value.id}`
    })
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-enter-active {
  transition: opacity 0.3s ease;
}

.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
