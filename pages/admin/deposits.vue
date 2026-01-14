<template>
  <div class="space-y-6">
    
    <!-- Stats -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="text-sm">
          <span class="text-stone-500">Total Reports:</span>
          <span class="font-bold text-stone-900 dark:text-white ml-1">{{ reports.length }}</span>
        </div>
        <div class="text-sm">
          <span class="text-stone-500">Total Photos:</span>
          <span class="font-bold text-stone-900 dark:text-white ml-1">{{ totalPhotos }}</span>
        </div>
      </div>
      
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Search by address or email..."
        class="flex-1 max-w-xs px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent"
      />
    </div>

    <!-- Reports Grid -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-stone-400" />
    </div>
    
    <div v-else-if="filteredReports.length === 0" class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-8 text-center">
      <UIcon name="i-lucide-camera" class="w-10 h-10 text-stone-200 dark:text-stone-700 mx-auto mb-3" />
      <p class="text-sm text-stone-500">No deposit reports found</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="report in filteredReports" 
        :key="report.id"
        class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
      >
        <!-- Thumbnail -->
        <div class="aspect-video bg-stone-100 dark:bg-stone-800 relative">
          <img 
            v-if="report.thumbnail"
            :src="report.thumbnail"
            :alt="report.property_address"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <UIcon name="i-lucide-image" class="w-8 h-8 text-stone-300 dark:text-stone-600" />
          </div>
          <div class="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-xs font-medium text-white">
            {{ report.photo_count || 0 }} photos
          </div>
        </div>
        
        <!-- Info -->
        <div class="p-4">
          <h3 class="font-bold text-stone-900 dark:text-white text-sm mb-1 truncate">
            {{ report.property_address || 'No address' }}
          </h3>
          <p class="text-xs text-stone-500 mb-3">{{ report.customer_email || 'No email' }}</p>
          
          <div class="flex items-center justify-between">
            <span class="text-xs text-stone-400">{{ formatDate(report.created_at) }}</span>
            <div class="flex items-center gap-1">
              <NuxtLink 
                :to="`/deposit/view/${report.id}`"
                class="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                target="_blank"
              >
                <UIcon name="i-lucide-external-link" class="w-4 h-4" />
              </NuxtLink>
              <button 
                @click="copyCode(report)"
                class="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                <UIcon name="i-lucide-copy" class="w-4 h-4" />
              </button>
              <button 
                @click="showDetails(report)"
                class="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              >
                <UIcon name="i-lucide-info" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <UModal v-model:open="showModal">
      <template #content>
        <div class="p-6" v-if="selectedReport">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-stone-900 dark:text-white">Report Details</h2>
            <button @click="showModal = false" class="p-1 text-stone-400 hover:text-stone-600">
              <UIcon name="i-lucide-x" class="w-5 h-5" />
            </button>
          </div>
          
          <dl class="space-y-4">
            <div>
              <dt class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Property</dt>
              <dd class="text-sm text-stone-900 dark:text-white">{{ selectedReport.property_address || 'Not specified' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Email</dt>
              <dd class="text-sm text-stone-900 dark:text-white">{{ selectedReport.customer_email || 'Not provided' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Phone</dt>
              <dd class="text-sm text-stone-900 dark:text-white">{{ selectedReport.customer_phone || 'Not provided' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Report Code</dt>
              <dd class="text-sm font-mono text-stone-900 dark:text-white">{{ selectedReport.short_code || selectedReport.id?.slice(0, 8).toUpperCase() }}</dd>
            </div>
            <div>
              <dt class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Created</dt>
              <dd class="text-sm text-stone-900 dark:text-white">{{ formatDate(selectedReport.created_at) }}</dd>
            </div>
            <div>
              <dt class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Payment Ref</dt>
              <dd class="text-sm font-mono text-stone-600 dark:text-stone-400">{{ selectedReport.payment_ref || 'N/A' }}</dd>
            </div>
          </dl>
          
          <div class="mt-6 flex gap-3">
            <NuxtLink 
              :to="`/deposit/view/${selectedReport.id}`"
              target="_blank"
              class="flex-1 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg font-medium text-sm text-center hover:bg-stone-800 transition-colors"
            >
              View Report
            </NuxtLink>
            <button 
              @click="showModal = false"
              class="px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const client = useSupabaseClient()
const toast = useToast()

const loading = ref(true)
const reports = ref<any[]>([])
const searchQuery = ref('')
const showModal = ref(false)
const selectedReport = ref<any>(null)

const totalPhotos = computed(() => 
  reports.value.reduce((acc, r) => acc + (r.photo_count || 0), 0)
)

const filteredReports = computed(() => {
  if (!searchQuery.value) return reports.value
  
  const query = searchQuery.value.toLowerCase()
  return reports.value.filter(r => 
    r.property_address?.toLowerCase().includes(query) ||
    r.customer_email?.toLowerCase().includes(query) ||
    r.short_code?.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  await fetchReports()
})

async function fetchReports() {
  loading.value = true
  try {
    const { data, error } = await useFetch('/api/admin/reports')
    
    if (error.value) throw error.value
    reports.value = data.value || []
    
    console.log('[Admin Deposits] Fetched reports:', reports.value.length)
  } catch (err) {
    console.error('Failed to fetch reports:', err)
    reports.value = []
  } finally {
    loading.value = false
  }
}

function copyCode(report: any) {
  const code = report.short_code || report.id.slice(0, 8).toUpperCase()
  navigator.clipboard.writeText(code)
  toast.add({ title: 'Code copied', description: code, color: 'success' })
}

function showDetails(report: any) {
  selectedReport.value = report
  showModal.value = true
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  })
}
</script>
