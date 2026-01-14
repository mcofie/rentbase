<template>
  <div class="space-y-6">
    
    <!-- Stats & Filters -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="text-sm">
          <span class="text-stone-500">Total:</span>
          <span class="font-bold text-stone-900 dark:text-white ml-1">{{ contracts.length }}</span>
        </div>
        <div class="text-sm">
          <span class="text-stone-500">Signed:</span>
          <span class="font-bold text-emerald-600 ml-1">{{ signedCount }}</span>
        </div>
      </div>
      
      <input 
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or address..."
        class="flex-1 max-w-xs px-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent"
      />
    </div>

    <!-- Contracts Table -->
    <div class="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-stone-400 mx-auto" />
      </div>
      
      <div v-else-if="filteredContracts.length === 0" class="p-8 text-center">
        <UIcon name="i-lucide-file-text" class="w-10 h-10 text-stone-200 dark:text-stone-700 mx-auto mb-3" />
        <p class="text-sm text-stone-500">No contracts found</p>
      </div>
      
      <table v-else class="w-full">
        <thead class="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800">
          <tr>
            <th class="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Tenant</th>
            <th class="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Property</th>
            <th class="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Status</th>
            <th class="px-5 py-3 text-left text-xs font-bold text-stone-500 uppercase tracking-wider">Created</th>
            <th class="px-5 py-3 text-right text-xs font-bold text-stone-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
          <tr 
            v-for="contract in filteredContracts" 
            :key="contract.id"
            class="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
          >
            <td class="px-5 py-4">
              <p class="font-medium text-stone-900 dark:text-white text-sm">{{ contract.details?.tenant_name || 'Unknown' }}</p>
              <p class="text-xs text-stone-500">{{ contract.customer_email || 'No email' }}</p>
            </td>
            <td class="px-5 py-4">
              <p class="text-sm text-stone-600 dark:text-stone-300 max-w-xs truncate">{{ contract.details?.property_address || 'No address' }}</p>
            </td>
            <td class="px-5 py-4">
              <span :class="['inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium', getStatusClass(contract)]">
                <span :class="['w-1.5 h-1.5 rounded-full', getStatusDotClass(contract)]"></span>
                {{ getStatusLabel(contract) }}
              </span>
            </td>
            <td class="px-5 py-4 text-sm text-stone-500">
              {{ formatDate(contract.created_at) }}
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center justify-end gap-2">

                <NuxtLink 
                  :to="`/contract/preview/${contract.id}`"
                  class="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  title="View"
                  target="_blank"
                >
                  <UIcon name="i-lucide-external-link" class="w-4 h-4" />
                </NuxtLink>
                <button 
                  @click="copyCode(contract)"
                  class="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                  title="Copy Code"
                >
                  <UIcon name="i-lucide-copy" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination placeholder -->
    <div v-if="contracts.length > 20" class="flex justify-center">
      <p class="text-sm text-stone-400">Showing {{ filteredContracts.length }} of {{ contracts.length }} contracts</p>
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
const config = useRuntimeConfig()

const loading = ref(true)
const contracts = ref<any[]>([])
const searchQuery = ref('')

const signedCount = computed(() => 
  contracts.value.filter(c => c.landlord_signature && c.tenant_signature).length
)

const filteredContracts = computed(() => {
  if (!searchQuery.value) return contracts.value
  
  const query = searchQuery.value.toLowerCase()
  return contracts.value.filter(c => 
    c.details?.tenant_name?.toLowerCase().includes(query) ||
    c.details?.landlord_name?.toLowerCase().includes(query) ||
    c.details?.property_address?.toLowerCase().includes(query) ||
    c.customer_email?.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  await fetchContracts()
})

async function fetchContracts() {
  loading.value = true
  try {
    const { data, error } = await useFetch('/api/admin/contracts')

    if (error.value) throw error.value
    contracts.value = data.value || []
  } catch (err) {
    console.error('Failed to fetch contracts:', err)
  } finally {
    loading.value = false
  }
}

function getStatusClass(contract: any): string {
  if (contract.landlord_signature && contract.tenant_signature) {
    return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
  }
  if (contract.landlord_signature || contract.tenant_signature) {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
  }
  return 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
}

function getStatusDotClass(contract: any): string {
  if (contract.landlord_signature && contract.tenant_signature) return 'bg-emerald-500'
  if (contract.landlord_signature || contract.tenant_signature) return 'bg-amber-500'
  return 'bg-stone-400'
}

function getStatusLabel(contract: any): string {
  if (contract.landlord_signature && contract.tenant_signature) return 'Fully Signed'
  if (contract.landlord_signature) return 'Landlord Signed'
  if (contract.tenant_signature) return 'Tenant Signed'
  return 'Pending'
}

function copyCode(contract: any) {
  const code = contract.landlord_short_code || contract.id.slice(0, 8).toUpperCase()
  navigator.clipboard.writeText(code)
  toast.add({ title: 'Code copied', description: code, color: 'success' })
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
