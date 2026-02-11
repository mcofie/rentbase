<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="group relative mb-8">
      <div class="mb-4 text-6xl">
        🛡️
      </div>
      <h1 class="text-4xl font-bold text-[#37352F] dark:text-[#FFFFFF] font-serif mb-2">Deposit Reports</h1>
      <p class="text-[#787774] dark:text-[#9B9B9B]">Monitor and manage condition reports for move-in/out.</p>
    </div>

    <!-- Stats & Filters -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#E1E1E1] dark:border-[#2F2F2F] pb-4">
      <div class="flex items-center gap-4">
        <div class="text-sm">
          <span class="text-[#787774] font-medium">Total:</span>
          <span class="font-bold text-[#37352F] dark:text-white ml-1">{{ totalCount }}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="relative">
          <UIcon name="i-lucide-search" class="absolute left-2.5 top-2.5 w-4 h-4 text-[#91918E]" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search reports..."
            class="pl-9 pr-4 py-1.5 bg-transparent border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-sm text-[#37352F] dark:text-[#D4D4D4] focus:outline-none focus:ring-1 focus:ring-[#2EAADC] focus:border-[#2EAADC] transition-all w-64"
          />
        </div>
      </div>
    </div>

    <!-- Reports Grid -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-stone-400" />
    </div>
    
    <div v-else-if="reports.length === 0" class="bg-white dark:bg-[#191919] rounded-xl border border-[#E1E1E1] dark:border-[#2F2F2F] p-12 text-center">
      <span class="text-4xl block mb-2">📭</span>
      <p class="text-sm text-[#91918E]">No deposit reports found</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="report in reports" 
        :key="report.id"
        class="bg-white dark:bg-[#191919] rounded-xl border border-[#E1E1E1] dark:border-[#2F2F2F] overflow-hidden hover:shadow-md transition-all group"
      >
        <!-- Thumbnail -->
        <div class="aspect-video bg-stone-100 dark:bg-[#2C2C2C] relative overflow-hidden">
          <img 
            v-if="report.thumbnail_url"
            :src="report.thumbnail_url"
            class="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <UIcon name="i-lucide-image" class="w-8 h-8 text-stone-300 dark:text-stone-700" />
          </div>
          <div :class="['absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider', report.is_finalized ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white']">
            {{ report.is_finalized ? 'Finalized' : 'Draft' }}
          </div>
        </div>
        
        <!-- Info -->
        <div class="p-5">
          <h3 class="font-bold text-[#37352F] dark:text-white text-sm mb-1 truncate">
            {{ report.property_address || 'No address' }}
          </h3>
          <p class="text-xs text-[#91918E] mb-4 truncate">{{ report.customer_email || 'No email' }}</p>
          
          <div class="flex items-center justify-between pt-4 border-t border-[#F1F1F0] dark:border-[#2F2F2F]">
            <span class="text-[10px] text-[#91918E] font-mono">{{ formatDate(report.report_date) }}</span>
            <div class="flex items-center gap-1">
              <NuxtLink 
                :to="`/deposit/view/${report.id}`"
                class="p-2 text-[#91918E] hover:text-[#2EAADC] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] rounded transition-colors"
                target="_blank"
              >
                <UIcon name="i-lucide-external-link" class="w-4 h-4" />
              </NuxtLink>
              <button 
                @click="showDetails(report)"
                class="p-2 text-[#91918E] hover:text-[#37352F] dark:hover:text-white hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] rounded transition-colors"
                title="Details"
              >
                <UIcon name="i-lucide-info" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalCount > itemsPerPage" class="mt-8 flex items-center justify-between text-xs text-[#787774]">
      <span>
        Showing {{ offset + 1 }}-{{ Math.min(offset + itemsPerPage, totalCount) }} of {{ totalCount }}
      </span>
      <div class="flex items-center gap-2">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1 || loading"
          class="px-3 py-1.5 bg-[#F7F7F5] dark:bg-[#2C2C2C] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-[#37352F] dark:text-[#D4D4D4] hover:bg-[#EFEFEF] disabled:opacity-30 transition-colors"
        >
          Previous
        </button>
        <button 
          @click="nextPage" 
          :disabled="currentPage >= Math.ceil(totalCount / itemsPerPage) || loading"
          class="px-3 py-1.5 bg-[#F7F7F5] dark:bg-[#2C2C2C] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-[#37352F] dark:text-[#D4D4D4] hover:bg-[#EFEFEF] disabled:opacity-30 transition-colors"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Details Modal -->
    <UModal v-model:open="showModal">
      <template #content>
        <div class="p-6" v-if="selectedReport">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-[#37352F] dark:text-white font-serif">Report details</h2>
            <button @click="showModal = false" class="p-1 text-[#91918E] hover:text-[#37352F]">
              <UIcon name="i-lucide-x" class="w-5 h-5" />
            </button>
          </div>
          
          <dl class="space-y-4">
            <div>
              <dt class="text-[10px] font-bold text-[#91918E] uppercase tracking-wider mb-1">Property address</dt>
              <dd class="text-sm text-[#37352F] dark:text-white">{{ selectedReport.property_address || 'Not specified' }}</dd>
            </div>
            <div>
              <dt class="text-[10px] font-bold text-[#91918E] uppercase tracking-wider mb-1">Customer email</dt>
              <dd class="text-sm text-[#37352F] dark:text-white">{{ selectedReport.customer_email || 'Not provided' }}</dd>
            </div>
            <div>
              <dt class="text-[10px] font-bold text-[#91918E] uppercase tracking-wider mb-1">Report code</dt>
              <dd class="text-sm font-mono text-[#37352F] dark:text-white">{{ selectedReport.short_code || selectedReport.id?.slice(0, 8).toUpperCase() }}</dd>
            </div>
          </dl>
          
          <div class="mt-8 flex gap-3">
            <NuxtLink 
              :to="`/deposit/view/${selectedReport.id}`"
              target="_blank"
              class="flex-1 py-2 bg-[#2EAADC] text-white rounded font-medium text-sm text-center hover:bg-[#2383E2] transition-colors"
            >
              Open report
            </NuxtLink>
            <button 
              @click="showModal = false"
              class="px-4 py-2 border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-sm font-medium text-[#37352F] dark:text-[#D4D4D4] hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] transition-colors"
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

const loading = ref(true)
const reports = ref<any[]>([])
const searchQuery = ref('')
const showModal = ref(false)
const selectedReport = ref<any>(null)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 9 // Grid friendly
const totalCount = ref(0)
const offset = computed(() => (currentPage.value - 1) * itemsPerPage)

async function fetchReports() {
  loading.value = true
  try {
    const response = await $fetch<{ reports: any[], total: number }>('/api/admin/deposits', {
      query: {
        limit: itemsPerPage,
        offset: offset.value,
        search: searchQuery.value
      }
    })
    
    reports.value = response.reports
    totalCount.value = response.total
  } catch (err) {
    console.error('Failed to fetch reports:', err)
  } finally {
    loading.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < Math.ceil(totalCount.value / itemsPerPage)) {
    currentPage.value++
    fetchReports()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchReports()
  }
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

// Watch search query but debounced would be better
watch(searchQuery, () => {
  currentPage.value = 1
  fetchReports()
})

onMounted(() => {
  fetchReports()
})
</script>
