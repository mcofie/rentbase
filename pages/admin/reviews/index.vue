<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="group relative mb-8">
      <div class="mb-4 text-6xl">
        ⭐
      </div>
      <h1 class="text-4xl font-bold text-[#37352F] dark:text-[#FFFFFF] font-serif mb-2">Review Moderation</h1>
      <p class="text-[#787774] dark:text-[#9B9B9B]">Monitor and manage community feedback on agents.</p>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E1E1E1] dark:border-[#2F2F2F] pb-4">
      <div class="flex items-center gap-4">
        <div class="text-sm">
          <span class="text-[#787774] font-medium">Total:</span>
          <span class="font-bold text-[#37352F] dark:text-white ml-1">{{ totalCount }}</span>
        </div>
      </div>
    </div>

    <!-- Reviews Table -->
    <div class="border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-md overflow-hidden bg-white dark:bg-[#191919]">
      <table class="w-full text-sm">
        <thead class="bg-[#F7F7F5] dark:bg-[#202020] border-b border-[#E1E1E1] dark:border-[#2F2F2F]">
          <tr>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              Reviewer
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-40">
              Agent
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-32">
              Rating
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-24">
              Status
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B]">
              Comment
            </th>
            <th class="px-4 py-2 text-right font-normal text-[#787774] dark:text-[#9B9B9B] w-32">
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E1E1E1] dark:divide-[#2F2F2F]">
          <tr v-if="loading">
            <td colspan="6" class="px-4 py-12 text-center text-[#91918E]">
              <UIcon name="i-lucide-loader-2" class="w-5 h-5 animate-spin mx-auto mb-2" />
              Loading reviews...
            </td>
          </tr>
          <tr v-else-if="reviews.length === 0">
            <td colspan="6" class="px-4 py-12 text-center text-[#91918E]">
              No reviews found
            </td>
          </tr>
          <tr 
            v-for="review in reviews" 
            :key="review.id"
            class="group hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] transition-colors"
          >
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="font-medium text-[#37352F] dark:text-[#D4D4D4]">{{ review.reviewer_phone || 'Anonymous' }}</div>
              <div class="text-[10px] text-[#91918E]">{{ review.reviewer_id ? 'App User' : 'Guest' }}</div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="text-[#37352F] dark:text-[#D4D4D4] font-mono text-xs">{{ review.agent_phone }}</div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="flex text-amber-400">
                <UIcon v-for="i in review.rating" :key="i" name="i-lucide-star" class="w-3.5 h-3.5 fill-current" />
              </div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <span :class="['px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider', getStatusClass(review.status)]">
                {{ review.status || 'pending' }}
              </span>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="text-[#37352F] dark:text-[#D4D4D4] line-clamp-2" :title="review.comment">{{ review.comment }}</div>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-1">
                <button 
                  v-if="review.status !== 'approved'"
                  @click="updateStatus(review.id, 'approved')" 
                  class="p-1.5 hover:bg-[#DBEDDB] dark:hover:bg-emerald-900/10 text-[#6A9A78] rounded transition-all"
                  title="Approve"
                >
                  <UIcon name="i-lucide-check" class="w-4 h-4" />
                </button>
                <button 
                  v-if="review.status !== 'rejected'"
                  @click="updateStatus(review.id, 'rejected')" 
                  class="p-1.5 hover:bg-[#FFE2DD] dark:hover:bg-red-900/10 text-[#D27C7C] rounded transition-all"
                  title="Reject"
                >
                  <UIcon name="i-lucide-x" class="w-4 h-4" />
                </button>
                <button 
                  @click="deleteReview(review.id)" 
                  class="p-1.5 hover:bg-[#EFEFEF] dark:hover:bg-[#2F2F2F] text-[#91918E] rounded transition-all opacity-0 group-hover:opacity-100"
                  :disabled="deleting === review.id"
                  title="Delete"
                >
                  <UIcon v-if="deleting === review.id" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
                  <UIcon v-else name="i-lucide-trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalCount > itemsPerPage" class="px-3 py-2 border-t border-[#E1E1E1] dark:border-[#2F2F2F] bg-[#F7F7F5] dark:bg-[#202020] flex items-center justify-between text-xs text-[#787774]">
        <span>Page {{ currentPage }} of {{ Math.ceil(totalCount / itemsPerPage) }}</span>
        <div class="flex items-center gap-1">
          <button @click="prevPage" :disabled="currentPage === 1 || loading" class="p-1 hover:bg-[#E1E1E1] dark:hover:bg-[#464646] rounded disabled:opacity-30">
            <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
          </button>
          <button @click="nextPage" :disabled="currentPage >= Math.ceil(totalCount / itemsPerPage) || loading" class="p-1 hover:bg-[#E1E1E1] dark:hover:bg-[#464646] rounded disabled:opacity-30">
            <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const client = useSupabaseClient()
const toast = useToast()
const reviews = ref<any[]>([])
const deleting = ref<number | null>(null)
const loading = ref(false)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 20
const totalCount = ref(0)
const offset = computed(() => (currentPage.value - 1) * itemsPerPage)

async function fetchReviews() {
  loading.value = true
  try {
    const response = await $fetch<{ reviews: any[], total: number }>('/api/admin/reviews', {
      query: {
        limit: itemsPerPage,
        offset: offset.value
      }
    })
    
    reviews.value = response.reviews
    totalCount.value = response.total
  } catch (err) {
    console.error('Error fetching reviews:', err)
  } finally {
    loading.value = false
  }
}

async function updateStatus(id: number, status: string) {
  try {
    await $fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      body: { status }
    })
    
    const review = reviews.value.find(r => r.id === id)
    if (review) review.status = status
    
    toast.add({
      title: `Review ${status}`,
      color: status === 'approved' ? 'success' : 'warning'
    })
  } catch (err: any) {
    toast.add({
      title: 'Failed to update status',
      description: err.data?.message || 'Please try again.',
      color: 'error'
    })
  }
}

async function deleteReview(id: number) {
  if (!confirm('Are you sure you want to delete this review?')) return
  
  deleting.value = id
  try {
    const { error } = await client.from('reviews').delete().eq('id', id)
    
    if (!error) {
      reviews.value = reviews.value.filter(r => r.id !== id)
      totalCount.value--
      toast.add({ title: 'Review deleted' })
    } else {
      throw error
    }
  } catch (err: any) {
    toast.add({ title: 'Failed to delete', description: err.message, color: 'error' })
  } finally {
    deleting.value = null
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'approved': return 'bg-[#DBEDDB] text-[#1C3829] dark:bg-[#1C3829]/30 dark:text-[#DBEDDB]'
    case 'rejected': return 'bg-[#FFE2DD] text-[#5D1715] dark:bg-[#5D1715]/30 dark:text-[#FFE2DD]'
    default: return 'bg-[#FDECC8] text-[#402C1B] dark:bg-[#402C1B]/30 dark:text-[#FDECC8]'
  }
}

const nextPage = () => {
  if (currentPage.value < Math.ceil(totalCount.value / itemsPerPage)) {
    currentPage.value++
    fetchReviews()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchReviews()
  }
}

onMounted(() => {
  fetchReviews()
})
</script>
