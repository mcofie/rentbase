<template>
  <div class="space-y-6">
    
    <!-- Page Header -->
    <div class="group relative mb-8">
      <div class="mb-4 text-6xl">
        📜
      </div>
      <h1 class="text-4xl font-bold text-[#37352F] dark:text-[#FFFFFF] font-serif mb-2">Legal Contracts</h1>
      <p class="text-[#787774] dark:text-[#9B9B9B]">Manage and track generated tenancy agreements.</p>
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
            placeholder="Search contracts..."
            class="pl-9 pr-4 py-1.5 bg-transparent border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-sm text-[#37352F] dark:text-[#D4D4D4] focus:outline-none focus:ring-1 focus:ring-[#2EAADC] focus:border-[#2EAADC] transition-all w-64"
          />
        </div>
      </div>
    </div>

    <!-- Contracts Table -->
    <div class="border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-md overflow-hidden bg-white dark:bg-[#191919]">
      <table class="w-full text-sm">
        <thead class="bg-[#F7F7F5] dark:bg-[#202020] border-b border-[#E1E1E1] dark:border-[#2F2F2F]">
          <tr>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-64">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-user" class="w-3.5 h-3.5" />
                Tenant / Email
              </div>
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-building" class="w-3.5 h-3.5" />
                Property
              </div>
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-40">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-tag" class="w-3.5 h-3.5" />
                Status
              </div>
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] w-40">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                Date
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#E1E1E1] dark:divide-[#2F2F2F]">
          <tr v-if="loading">
            <td colspan="4" class="px-4 py-12 text-center text-[#91918E]">
              <UIcon name="i-lucide-loader-2" class="w-5 h-5 animate-spin mx-auto mb-2" />
              Loading contracts...
            </td>
          </tr>
          <tr v-else-if="contracts.length === 0">
            <td colspan="4" class="px-4 py-12 text-center text-[#91918E]">
              No contracts found
            </td>
          </tr>
          <tr 
            v-for="contract in contracts" 
            :key="contract.id"
            class="group hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer"
            @click="navigateTo(`/contract/preview/${contract.id}`, { external: true, open: { target: '_blank' } })"
          >
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="font-medium text-[#37352F] dark:text-[#D4D4D4] mb-0.5">{{ contract.details?.tenant_name || 'Linked Account' }}</div>
              <div class="text-[10px] text-[#91918E] truncate">{{ contract.customer_email || 'No email' }}</div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="text-[#37352F] dark:text-[#D4D4D4] line-clamp-1">{{ contract.details?.property_address || 'Reference set' }}</div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="flex items-center gap-2">
                <span :class="['w-2 h-2 rounded-full', getStatusDotClass(contract)]"></span>
                <span class="text-xs text-[#37352F] dark:text-[#D4D4D4] whitespace-nowrap">{{ getStatusLabel(contract) }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-between">
                <span class="text-[#787774] dark:text-[#9B9B9B] whitespace-nowrap">{{ formatDate(contract.created_at) }}</span>
                <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-[#E1E1E1] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div v-if="totalCount > itemsPerPage" class="px-3 py-2 border-t border-[#E1E1E1] dark:border-[#2F2F2F] bg-[#F7F7F5] dark:bg-[#202020] flex items-center justify-between text-xs text-[#787774]">
        <span>Page {{ currentPage }} of {{ Math.ceil(totalCount / itemsPerPage) }}</span>
        <div class="flex items-center gap-1">
          <button 
            @click.stop="prevPage" 
            :disabled="currentPage === 1 || loading"
            class="p-1 hover:bg-[#E1E1E1] dark:hover:bg-[#464646] rounded disabled:opacity-30"
          >
            <UIcon name="i-lucide-chevron-left" class="w-4 h-4" />
          </button>
          <button 
            @click.stop="nextPage" 
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
const contracts = ref<any[]>([])
const searchQuery = ref('')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 15
const totalCount = ref(0)
const offset = computed(() => (currentPage.value - 1) * itemsPerPage)

async function fetchContracts() {
  loading.value = true
  try {
    const response = await $fetch<{ contracts: any[], total: number }>('/api/admin/contracts', {
      query: {
        limit: itemsPerPage,
        offset: offset.value,
        search: searchQuery.value
      }
    })
    
    contracts.value = response.contracts
    totalCount.value = response.total
  } catch (err) {
    console.error('Failed to fetch contracts:', err)
  } finally {
    loading.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < Math.ceil(totalCount.value / itemsPerPage)) {
    currentPage.value++
    fetchContracts()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchContracts()
  }
}

function getStatusDotClass(contract: any): string {
  if (contract.landlord_signature && contract.tenant_signature) return 'bg-[#6A9A78]'
  if (contract.landlord_signature || contract.tenant_signature) return 'bg-[#D9A066]'
  return 'bg-[#787774]'
}

function getStatusLabel(contract: any): string {
  if (contract.landlord_signature && contract.tenant_signature) return 'Fully Signed'
  if (contract.landlord_signature) return 'Landlord Signed'
  if (contract.tenant_signature) return 'Tenant Signed'
  return 'Pending'
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  })
}

watch(searchQuery, () => {
  currentPage.value = 1
  fetchContracts()
})

onMounted(() => {
  fetchContracts()
})
</script>
