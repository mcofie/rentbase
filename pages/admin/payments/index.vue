<template>
  <div class="space-y-6">
    
    <!-- Page Header (Notion Style) -->
    <div class="group relative mb-8">
      <div class="mb-4 text-6xl">
        💰
      </div>
      <h1 class="text-4xl font-bold text-[#37352F] dark:text-[#FFFFFF] font-serif mb-2">Payments & Revenue</h1>
      <p class="text-[#787774] dark:text-[#9B9B9B]">Track collections from contracts and condition reports.</p>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E1E1E1] dark:border-[#2F2F2F] pb-4">
      
      <!-- Stats Summary -->
      <div class="flex items-center gap-6">
        <div class="text-sm">
          <span class="text-[#787774] font-medium uppercase text-[10px] tracking-wider block mb-0.5">Total Collected</span>
          <span class="font-bold text-[#37352F] dark:text-white text-lg">GHS {{ totalRevenue.toFixed(2) }}</span>
        </div>
        <div class="text-sm">
          <span class="text-[#787774] font-medium uppercase text-[10px] tracking-wider block mb-0.5">Success Rate</span>
          <span class="font-bold text-[#6A9A78] text-lg">{{ successRate }}%</span>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <UIcon name="i-lucide-search" class="absolute left-2.5 top-2.5 w-4 h-4 text-[#91918E]" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search reference or email..."
            class="pl-9 pr-4 py-1.5 bg-transparent border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-sm text-[#37352F] dark:text-[#D4D4D4] focus:outline-none focus:ring-1 focus:ring-[#2EAADC] focus:border-[#2EAADC] transition-all w-64"
          />
        </div>
        
        <button 
          @click="fetchPayments"
          class="px-3 py-1.5 text-sm font-medium text-[#37352F] dark:text-[#D4D4D4] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] rounded transition-colors flex items-center gap-2"
        >
          <UIcon name="i-lucide-refresh-cw" class="w-4 h-4 text-[#91918E]" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-md overflow-hidden bg-white dark:bg-[#191919]">
      <table class="w-full text-sm">
        <thead class="bg-[#F7F7F5] dark:bg-[#202020] border-b border-[#E1E1E1] dark:border-[#2F2F2F]">
          <tr>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-48">
              Reference
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              Customer
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-32">
              Amount
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-36">
              Type
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-28">
              Status
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] w-40">
              Date
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E1E1E1] dark:divide-[#2F2F2F]">
          <tr v-if="loading">
            <td colspan="6" class="px-4 py-12 text-center text-[#91918E]">
              <UIcon name="i-lucide-loader-2" class="w-5 h-5 animate-spin mx-auto mb-2" />
              Loading transactions...
            </td>
          </tr>
          <tr v-else-if="payments.length === 0">
            <td colspan="6" class="px-4 py-12 text-center text-[#91918E]">
              No transactions found
            </td>
          </tr>
          <tr 
            v-for="payment in payments" 
            :key="payment.id"
            class="group hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] transition-colors"
          >
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="font-mono text-[11px] text-[#37352F] dark:text-[#D4D4D4]">{{ payment.reference }}</div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div v-if="payment.customer_email" class="text-[#37352F] dark:text-[#D4D4D4] truncate">{{ payment.customer_email }}</div>
              <div v-else-if="payment.profile?.phone_number" class="text-[#91918E] font-mono text-xs">{{ payment.profile.phone_number }}</div>
              <div v-else class="text-[#91918E] italic text-xs">Guest Customer</div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="font-medium text-[#37352F] dark:text-white">GHS {{ payment.amount.toFixed(2) }}</div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="flex items-center gap-1.5 text-xs text-[#37352F] dark:text-[#D4D4D4]">
                <UIcon :name="payment.feature_type === 'contract' ? 'i-lucide-file-text' : 'i-lucide-camera'" class="w-3.5 h-3.5 text-[#91918E]" />
                <span class="capitalize">{{ payment.feature_type?.replace('_', ' ') }}</span>
              </div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <span 
                :class="['inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider', getStatusBadgeClass(payment.status)]"
              >
                {{ payment.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="text-[#787774] dark:text-[#9B9B9B] whitespace-nowrap">
                {{ formatDate(payment.created_at) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div v-if="totalCount > itemsPerPage" class="px-3 py-2 border-t border-[#E1E1E1] dark:border-[#2F2F2F] bg-[#F7F7F5] dark:bg-[#202020] flex items-center justify-between text-xs text-[#787774]">
        <span>
          Page {{ currentPage }} of {{ Math.ceil(totalCount / itemsPerPage) }}
        </span>
        <div class="flex items-center gap-1">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1 || loading"
            class="p-1 hover:bg-[#E1E1E1] dark:hover:bg-[#464646] rounded disabled:opacity-30"
          >
            <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage >= Math.ceil(totalCount / itemsPerPage) || loading"
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
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const loading = ref(true)
const payments = ref<any[]>([])
const totalCount = ref(0)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 20
const offset = computed(() => (currentPage.value - 1) * itemsPerPage)

const fetchPayments = async () => {
  loading.value = true
  try {
    const response = await $fetch<{ payments: any[], total: number }>('/api/admin/payments', {
      query: {
        limit: itemsPerPage,
        offset: offset.value,
        search: searchQuery.value
      }
    })
    
    payments.value = response.payments
    totalCount.value = response.total
  } catch (err) {
    console.error('Error fetching payments:', err)
  } finally {
    loading.value = false
  }
}

const totalRevenue = computed(() => {
  return payments.value
    .filter(p => p.status === 'success')
    .reduce((acc, p) => acc + p.amount, 0)
})

const successRate = computed(() => {
  if (payments.value.length === 0) return 0
  const success = payments.value.filter(p => p.status === 'success').length
  return Math.round((success / payments.value.length) * 100)
})

const nextPage = () => {
  if (currentPage.value < Math.ceil(totalCount.value / itemsPerPage)) {
    currentPage.value++
    fetchPayments()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchPayments()
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'success': 
      return 'bg-[#DBEDDB] text-[#1C3829] dark:bg-[#1C3829] dark:text-[#DBEDDB]'
    case 'failed': 
      return 'bg-[#FFE2DD] text-[#5D1715] dark:bg-[#5D1715] dark:text-[#FFE2DD]'
    default: 
      return 'bg-[#FDECC8] text-[#402C1B] dark:bg-[#402C1B] dark:text-[#FDECC8]'
  }
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

watch(searchQuery, () => {
  currentPage.value = 1
  fetchPayments()
})

onMounted(() => {
  fetchPayments()
})
</script>
