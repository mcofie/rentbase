<template>
  <div class="space-y-6">
    
    <!-- Page Header (Notion Style) -->
    <div class="group relative mb-8">
      <div class="mb-4 text-6xl">
        💬
      </div>
      <h1 class="text-4xl font-bold text-[#37352F] dark:text-[#FFFFFF] font-serif mb-2">Reviews Database</h1>
      <p class="text-[#787774] dark:text-[#9B9B9B]">Manage and moderate agent reviews.</p>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E1E1E1] dark:border-[#2F2F2F] pb-4">
      
      <!-- View Switcher (Tabs) -->
      <div class="flex items-center gap-1">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="currentTab = tab.value"
          :class="[
            'px-3 py-1.5 text-sm rounded transition-colors',
            currentTab === tab.value 
              ? 'bg-[#EFEFEF] dark:bg-[#37352F] text-[#37352F] dark:text-[#D4D4D4] font-medium' 
              : 'text-[#787774] dark:text-[#9B9B9B] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] hover:text-[#37352F] dark:hover:text-[#D4D4D4]'
          ]"
        >
          {{ tab.label }}
          <span class="ml-1 text-xs text-[#91918E]">{{ tab.count }}</span>
        </button>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <UIcon name="i-lucide-search" class="absolute left-2.5 top-2.5 w-4 h-4 text-[#91918E]" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="pl-9 pr-4 py-1.5 bg-transparent border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-sm text-[#37352F] dark:text-[#D4D4D4] focus:outline-none focus:ring-1 focus:ring-[#2EAADC] focus:border-[#2EAADC] transition-all w-64"
          />
        </div>
        
        <button 
          @click="exportCSV"
          class="px-3 py-1.5 text-sm font-medium text-[#37352F] dark:text-[#D4D4D4] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] rounded transition-colors flex items-center gap-2"
        >
          <UIcon name="i-lucide-download" class="w-4 h-4 text-[#91918E]" />
          Export
        </button>
      </div>
    </div>

    <!-- Bulk Actions Bar -->
    <div 
      v-if="selectedIds.length > 0"
      class="bg-[#2383E2] text-white rounded-md p-2 flex items-center justify-between shadow-sm animate-slide-down"
    >
      <div class="flex items-center gap-3 px-2">
        <span class="text-sm font-medium">
          {{ selectedIds.length }} selected
        </span>
        <div class="h-4 w-px bg-white/20"></div>
        <button 
          @click="selectedIds = []"
          class="text-xs text-white/80 hover:text-white"
        >
          Clear
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="bulkUpdateStatus('approved')"
          class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm font-medium transition-colors"
        >
          Approve
        </button>
        <button 
          @click="bulkUpdateStatus('rejected')"
          class="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm font-medium transition-colors"
        >
          Reject
        </button>
      </div>
    </div>

    <!-- Reviews Table (Notion Database Style) -->
    <div class="border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-md overflow-hidden bg-white dark:bg-[#191919]">
      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <UIcon name="i-lucide-loader-2" class="w-5 h-5 animate-spin text-[#91918E] mx-auto mb-2" />
        <p class="text-sm text-[#91918E]">Loading...</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredReviews.length === 0" class="p-12 text-center">
        <span class="text-4xl block mb-2">📭</span>
        <h3 class="font-medium text-[#37352F] dark:text-[#D4D4D4] mb-1">No reviews found</h3>
        <p class="text-sm text-[#91918E]">Clear filters or search to see more.</p>
      </div>
      
      <!-- Table -->
      <table v-else class="w-full text-sm">
        <thead class="bg-[#F7F7F5] dark:bg-[#202020] border-b border-[#E1E1E1] dark:border-[#2F2F2F]">
          <tr>
            <th class="w-10 px-3 py-2 text-center border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <input 
                type="checkbox" 
                :checked="allSelected"
                @change="toggleSelectAll"
                class="rounded border-[#D3D1CB] text-[#2383E2] focus:ring-0 cursor-pointer"
              />
            </th>
            <th class="px-3 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-48">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-user" class="w-3.5 h-3.5" />
                Agent
              </div>
            </th>
            <th class="px-3 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-32">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-star" class="w-3.5 h-3.5" />
                Rating
              </div>
            </th>
            <th class="px-3 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-align-left" class="w-3.5 h-3.5" />
                Comment
              </div>
            </th>
            <th class="px-3 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-32">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-tag" class="w-3.5 h-3.5" />
                Status
              </div>
            </th>
            <th class="px-3 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] w-32">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                Date
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E1E1E1] dark:divide-[#2F2F2F]">
          <tr 
            v-for="review in paginatedReviews" 
            :key="review.id"
            class="group hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] transition-colors"
            :class="{ 'bg-[#E6F3FF] dark:bg-[#112945]': selectedIds.includes(review.id) }"
          >
            <td class="px-3 py-2 text-center border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
               <input 
                type="checkbox" 
                :checked="selectedIds.includes(review.id)"
                @change="toggleSelect(review.id)"
                class="rounded border-[#D3D1CB] text-[#2383E2] focus:ring-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                :class="{ 'opacity-100': selectedIds.includes(review.id) }"
              />
            </td>
            <td class="px-3 py-2 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="truncate font-medium text-[#37352F] dark:text-[#D4D4D4]">
                 {{ review.agent_name || formatPhone(review.agent_phone) }}
              </div>
            </td>
            <td class="px-3 py-2 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="flex items-center gap-0.5">
                <span v-for="i in 5" :key="i" class="text-sm leading-none">
                  {{ i <= review.rating ? '★' : '☆' }}
                </span>
              </div>
            </td>
            <td class="px-3 py-2 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <p class="truncate text-[#37352F] dark:text-[#D4D4D4] max-w-md">
                {{ review.comment || '—' }}
              </p>
            </td>
            <td class="px-3 py-2 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <span 
                :class="['inline-flex items-center px-2 py-0.5 rounded text-xs whitespace-nowrap', getStatusBadgeClass(review.status)]"
              >
                {{ review.status || 'pending' }}
              </span>
            </td>
            <td class="px-3 py-2 text-[#787774] dark:text-[#9B9B9B] whitespace-nowrap">
              <div class="flex items-center justify-between group/actions">
                <span>{{ formatDate(review.created_at) }}</span>
                
                <!-- Hover Actions -->
                <div class="opacity-0 group-hover/actions:opacity-100 flex items-center gap-1 transition-opacity">
                  <button 
                    v-if="review.status !== 'approved'"
                    @click="updateStatus(review.id, 'approved')"
                    class="p-1 hover:bg-[#EFEFEF] dark:hover:bg-[#464646] rounded text-[#6A9A78]"
                    title="Approve"
                  >
                    <UIcon name="i-lucide-check" class="w-3.5 h-3.5" />
                  </button>
                  <button 
                    v-if="review.status !== 'rejected'"
                    @click="updateStatus(review.id, 'rejected')"
                    class="p-1 hover:bg-[#EFEFEF] dark:hover:bg-[#464646] rounded text-[#D27C7C]"
                   title="Reject"
                  >
                    <UIcon name="i-lucide-x" class="w-3.5 h-3.5" />
                  </button>
                  <button 
                    @click="deleteReview(review.id)"
                    class="p-1 hover:bg-[#EFEFEF] dark:hover:bg-[#464646] rounded text-[#91918E]"
                    title="Delete"
                  >
                    <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Footer / Pagination -->
      <div v-if="totalPages > 1" class="px-3 py-2 border-t border-[#E1E1E1] dark:border-[#2F2F2F] bg-[#F7F7F5] dark:bg-[#202020] flex items-center justify-between text-xs text-[#787774]">
        <span>
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <div class="flex items-center gap-1">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="p-1 hover:bg-[#E1E1E1] dark:hover:bg-[#464646] rounded disabled:opacity-30"
          >
            <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
          </button>
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="p-1 hover:bg-[#E1E1E1] dark:hover:bg-[#464646] rounded disabled:opacity-30"
          >
            <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ... same script exports, but need to update getStatusClass logic for Notion pastel colors
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const client = useSupabaseClient()
const toast = useToast()

const loading = ref(true)
const reviews = ref<any[]>([])
const searchQuery = ref('')
const currentTab = ref('all')
const currentPage = ref(1)
const pageSize = 15
const selectedIds = ref<string[]>([])

const tabs = computed(() => [
  { value: 'all', label: 'All Reviews', count: reviews.value.length || 0 },
  { value: 'pending', label: 'Pending', count: reviews.value.filter(r => !r.status || r.status === 'pending').length || 0 },
  { value: 'approved', label: 'Approved', count: reviews.value.filter(r => r.status === 'approved').length || 0 },
  { value: 'rejected', label: 'Rejected', count: reviews.value.filter(r => r.status === 'rejected').length || 0 },
])

const filteredReviews = computed(() => {
  let result = reviews.value

  if (currentTab.value !== 'all') {
    result = result.filter(r => {
      if (currentTab.value === 'pending') return !r.status || r.status === 'pending'
      return r.status === currentTab.value
    })
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      (r.agent_name || '').toLowerCase().includes(query) ||
      (r.agent_phone || '').includes(query) ||
      (r.comment || '').toLowerCase().includes(query)
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredReviews.value.length / pageSize))

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredReviews.value.slice(start, start + pageSize)
})

const allSelected = computed(() => 
  paginatedReviews.value.length > 0 && 
  paginatedReviews.value.every(r => selectedIds.value.includes(r.id))
)

watch([currentTab, searchQuery], () => {
  currentPage.value = 1
  selectedIds.value = []
})

onMounted(async () => {
  await fetchReviews()
})

async function fetchReviews() {
  loading.value = true
  try {
    const { data, error } = await client
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    reviews.value = data || []
  } catch (err) {
    console.error('Failed to fetch reviews:', err)
  } finally {
    loading.value = false
  }
}

function toggleSelect(id: string) {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedIds.value = selectedIds.value.filter(id => !paginatedReviews.value.some(r => r.id === id))
  } else {
    const newIds = paginatedReviews.value.map(r => r.id).filter(id => !selectedIds.value.includes(id))
    selectedIds.value.push(...newIds)
  }
}

async function updateStatus(id: string, status: string) {
  try {
    await $fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      body: { status }
    })

    const review = reviews.value.find(r => r.id === id)
    if (review) review.status = status

    toast.add({ title: `Review ${status}`, color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Failed to update', description: err.data?.message, color: 'error' })
  }
}

async function bulkUpdateStatus(status: string) {
  const count = selectedIds.value.length
  
  try {
    await Promise.all(
      selectedIds.value.map(id => 
        $fetch(`/api/admin/reviews/${id}`, {
          method: 'PATCH',
          body: { status }
        })
      )
    )

    selectedIds.value.forEach(id => {
      const review = reviews.value.find(r => r.id === id)
      if (review) review.status = status
    })

    selectedIds.value = []
    toast.add({ title: `${count} reviews ${status}`, color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Some updates failed', color: 'error' })
  }
}

async function deleteReview(id: string) {
  if (!confirm('Delete this review? This cannot be undone.')) return

  try {
    await $fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    reviews.value = reviews.value.filter(r => r.id !== id)
    selectedIds.value = selectedIds.value.filter(i => i !== id)
    toast.add({ title: 'Review deleted', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Failed to delete', description: err.data?.message, color: 'error' })
  }
}

function exportCSV() {
  const data = filteredReviews.value
  const headers = ['Agent Phone', 'Rating', 'Comment', 'Status', 'Date']
  const rows = data.map(r => [
    r.agent_phone,
    r.rating,
    `"${(r.comment || '').replace(/"/g, '""')}"`,
    r.status || 'pending',
    formatDate(r.created_at)
  ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
  
  toast.add({ title: 'CSV exported', color: 'success' })
}

// Notion Style Status Badges (Pastel Backgrounds)
function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'approved': 
      return 'bg-[#DBEDDB] text-[#1C3829] dark:bg-[#1C3829] dark:text-[#DBEDDB]' // Green
    case 'rejected': 
      return 'bg-[#FFE2DD] text-[#5D1715] dark:bg-[#5D1715] dark:text-[#FFE2DD]' // Red
    default: 
      return 'bg-[#FDECC8] text-[#402C1B] dark:bg-[#402C1B] dark:text-[#FDECC8]' // Orange/Yellow
  }
}

function formatPhone(phone: string): string {
  if (!phone) return ''
  return phone.replace(/^\+233/, '0')
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

<style scoped>
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slide-down 0.2s ease-out;
}
</style>
