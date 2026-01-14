<template>
  <div class="space-y-6">
    
    <!-- Page Header (Notion Style) -->
    <div class="group relative mb-8">
      <div class="mb-4 text-6xl">
        👤
      </div>
      <h1 class="text-4xl font-bold text-[#37352F] dark:text-[#FFFFFF] font-serif mb-2">Agent Claims</h1>
      <p class="text-[#787774] dark:text-[#9B9B9B]">Review and manage agent registration requests.</p>
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
            placeholder="Search by name or phone..."
            class="pl-9 pr-4 py-1.5 bg-transparent border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-sm text-[#37352F] dark:text-[#D4D4D4] focus:outline-none focus:ring-1 focus:ring-[#2EAADC] focus:border-[#2EAADC] transition-all w-64"
          />
        </div>
        
        <button 
          @click="fetchClaims"
          class="px-3 py-1.5 text-sm font-medium text-[#37352F] dark:text-[#D4D4D4] hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] rounded transition-colors flex items-center gap-2"
        >
          <UIcon name="i-lucide-refresh-cw" class="w-4 h-4 text-[#91918E]" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Claims Table -->
    <div class="border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-md overflow-hidden bg-white dark:bg-[#191919]">
      <!-- Loading -->
      <div v-if="loading" class="p-12 text-center">
        <UIcon name="i-lucide-loader-2" class="w-5 h-5 animate-spin text-[#91918E] mx-auto mb-2" />
        <p class="text-sm text-[#91918E]">Loading claims...</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredClaims.length === 0" class="p-12 text-center">
        <span class="text-4xl block mb-2">📭</span>
        <h3 class="font-medium text-[#37352F] dark:text-[#D4D4D4] mb-1">No claims found</h3>
        <p class="text-sm text-[#91918E]">
          {{ currentTab === 'pending' ? 'No pending agent claims to review.' : 'No claims match your filters.' }}
        </p>
      </div>
      
      <!-- Table -->
      <table v-else class="w-full text-sm">
        <thead class="bg-[#F7F7F5] dark:bg-[#202020] border-b border-[#E1E1E1] dark:border-[#2F2F2F]">
          <tr>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-48">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-user" class="w-3.5 h-3.5" />
                Name
              </div>
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-40">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-phone" class="w-3.5 h-3.5" />
                Phone
              </div>
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-36">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-building" class="w-3.5 h-3.5" />
                Agency
              </div>
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-32">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-map-pin" class="w-3.5 h-3.5" />
                Location
              </div>
            </th>
            <th class="px-4 py-2 text-left font-normal text-[#787774] dark:text-[#9B9B9B] border-r border-[#E1E1E1] dark:border-[#2F2F2F] w-28">
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
          <tr 
            v-for="claim in paginatedClaims" 
            :key="claim.id"
            class="group hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] transition-colors"
          >
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="font-medium text-[#37352F] dark:text-[#D4D4D4]">
                {{ claim.full_name }}
              </div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="text-[#37352F] dark:text-[#D4D4D4] font-mono text-xs">
                {{ formatPhone(claim.phone) }}
              </div>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <span class="text-[#787774] dark:text-[#9B9B9B]">
                {{ claim.agency_name || '—' }}
              </span>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <span class="text-[#37352F] dark:text-[#D4D4D4] capitalize">
                {{ claim.location?.replace('-', ' ') || '—' }}
              </span>
            </td>
            <td class="px-4 py-3 border-r border-[#E1E1E1] dark:border-[#2F2F2F]">
              <span 
                :class="['inline-flex items-center px-2 py-0.5 rounded text-xs whitespace-nowrap', getStatusBadgeClass(claim.status)]"
              >
                {{ claim.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-between">
                <span class="text-[#787774] dark:text-[#9B9B9B] whitespace-nowrap">
                  {{ formatDate(claim.created_at) }}
                </span>
                
                <!-- Actions -->
                <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button 
                    v-if="claim.status === 'pending'"
                    @click="openReviewModal(claim, 'approve')"
                    class="p-1.5 hover:bg-[#DBEDDB] dark:hover:bg-emerald-900/30 rounded text-[#6A9A78]"
                    title="Approve"
                  >
                    <UIcon name="i-lucide-check" class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="claim.status === 'pending'"
                    @click="openReviewModal(claim, 'reject')"
                    class="p-1.5 hover:bg-[#FFE2DD] dark:hover:bg-red-900/30 rounded text-[#D27C7C]"
                    title="Reject"
                  >
                    <UIcon name="i-lucide-x" class="w-4 h-4" />
                  </button>
                  <button 
                    @click="viewClaimDetails(claim)"
                    class="p-1.5 hover:bg-[#EFEFEF] dark:hover:bg-[#464646] rounded text-[#91918E]"
                    title="View Details"
                  >
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
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

    <!-- Review Modal -->
    <UModal v-model:open="showReviewModal">
      <template #content>
        <div v-if="selectedClaim" class="p-6">
          <div class="flex items-center gap-3 mb-6">
            <div 
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center',
                reviewAction === 'approve' ? 'bg-[#DBEDDB]' : 'bg-[#FFE2DD]'
              ]"
            >
              <UIcon 
                :name="reviewAction === 'approve' ? 'i-lucide-check-circle' : 'i-lucide-x-circle'" 
                :class="[
                  'w-6 h-6',
                  reviewAction === 'approve' ? 'text-[#6A9A78]' : 'text-[#D27C7C]'
                ]"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-[#37352F] dark:text-white">
                {{ reviewAction === 'approve' ? 'Approve' : 'Reject' }} Agent Claim
              </h3>
              <p class="text-sm text-[#787774] dark:text-[#9B9B9B]">
                {{ selectedClaim.full_name }}
              </p>
            </div>
          </div>

          <!-- Claim Details -->
          <div class="bg-[#F7F7F5] dark:bg-stone-800 rounded-lg p-4 mb-6">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-[#91918E] text-xs uppercase tracking-wider mb-1">Phone</p>
                <p class="font-medium text-[#37352F] dark:text-white font-mono">
                  {{ formatPhone(selectedClaim.phone) }}
                </p>
              </div>
              <div>
                <p class="text-[#91918E] text-xs uppercase tracking-wider mb-1">Location</p>
                <p class="font-medium text-[#37352F] dark:text-white capitalize">
                  {{ selectedClaim.location ? selectedClaim.location.replace('-', ' ') : '—' }}
                </p>
              </div>
              <div v-if="selectedClaim.agency_name" class="col-span-2">
                <p class="text-[#91918E] text-xs uppercase tracking-wider mb-1">Agency</p>
                <p class="font-medium text-[#37352F] dark:text-white">
                  {{ selectedClaim.agency_name }}
                </p>
              </div>
            </div>
          </div>

          <!-- Admin Notes -->
          <div class="mb-6">
            <label class="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2 block">
              Admin Notes (Optional)
            </label>
            <textarea
              v-model="adminNotes"
              :placeholder="reviewAction === 'approve' ? 'Any notes for internal reference...' : 'Reason for rejection (internal)...'"
              rows="3"
              class="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-sm text-[#37352F] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all resize-none"
            ></textarea>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button
              @click="showReviewModal = false"
              class="flex-1 px-4 py-2.5 border border-[#E1E1E1] dark:border-stone-700 text-[#37352F] dark:text-white rounded-lg hover:bg-[#F7F7F5] dark:hover:bg-stone-800 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              @click="submitReview"
              :disabled="submitting"
              :class="[
                'flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2',
                reviewAction === 'approve' 
                  ? 'bg-[#6A9A78] hover:bg-[#5a8a68] text-white' 
                  : 'bg-[#D27C7C] hover:bg-[#c26c6c] text-white'
              ]"
            >
              <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-else>{{ reviewAction === 'approve' ? 'Approve Claim' : 'Reject Claim' }}</span>
            </button>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Details Modal -->
    <UModal v-model:open="showDetailsModal">
      <template #content>
        <div v-if="selectedClaim" class="p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-[#D3E5EF] rounded-full flex items-center justify-center">
              <UIcon name="i-lucide-user" class="w-6 h-6 text-[#0075DE]" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-[#37352F] dark:text-white">
                {{ selectedClaim.full_name }}
              </h3>
              <span 
                :class="['inline-flex items-center px-2 py-0.5 rounded text-xs', getStatusBadgeClass(selectedClaim.status)]"
              >
                {{ selectedClaim.status }}
              </span>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-[#91918E] text-xs uppercase tracking-wider mb-1">Phone</p>
                <p class="font-medium text-[#37352F] dark:text-white font-mono">
                  {{ formatPhone(selectedClaim.phone) }}
                </p>
              </div>
              <div>
                <p class="text-[#91918E] text-xs uppercase tracking-wider mb-1">Location</p>
                <p class="font-medium text-[#37352F] dark:text-white capitalize">
                  {{ selectedClaim.location ? selectedClaim.location.replace('-', ' ') : '—' }}
                </p>
              </div>
              <div>
                <p class="text-[#91918E] text-xs uppercase tracking-wider mb-1">Agency</p>
                <p class="font-medium text-[#37352F] dark:text-white">
                  {{ selectedClaim.agency_name || '—' }}
                </p>
              </div>
              <div>
                <p class="text-[#91918E] text-xs uppercase tracking-wider mb-1">Submitted</p>
                <p class="font-medium text-[#37352F] dark:text-white">
                  {{ formatDate(selectedClaim.created_at) }}
                </p>
              </div>
            </div>

            <div v-if="selectedClaim.admin_notes">
              <p class="text-[#91918E] text-xs uppercase tracking-wider mb-1">Admin Notes</p>
              <p class="text-[#37352F] dark:text-white bg-[#F7F7F5] dark:bg-stone-800 rounded-lg p-3 text-sm">
                {{ selectedClaim.admin_notes }}
              </p>
            </div>

            <div v-if="selectedClaim.reviewed_at">
              <p class="text-[#91918E] text-xs uppercase tracking-wider mb-1">Reviewed</p>
              <p class="font-medium text-[#37352F] dark:text-white">
                {{ formatDate(selectedClaim.reviewed_at) }}
              </p>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-[#E1E1E1] dark:border-stone-700">
            <button
              @click="showDetailsModal = false"
              class="w-full px-4 py-2.5 bg-[#37352F] dark:bg-white text-white dark:text-[#37352F] rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
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

interface AgentClaim {
  id: string
  phone: string
  full_name: string
  agency_name: string | null
  location: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

const toast = useToast()

const loading = ref(true)
const claims = ref<AgentClaim[]>([])
const searchQuery = ref('')
const currentTab = ref('pending')
const currentPage = ref(1)
const pageSize = 15

// Modals
const showReviewModal = ref(false)
const showDetailsModal = ref(false)
const selectedClaim = ref<AgentClaim | null>(null)
const reviewAction = ref<'approve' | 'reject'>('approve')
const adminNotes = ref('')
const submitting = ref(false)

const tabs = computed(() => [
  { value: 'all', label: 'All', count: claims.value.length },
  { value: 'pending', label: 'Pending', count: claims.value.filter(c => c.status === 'pending').length },
  { value: 'approved', label: 'Approved', count: claims.value.filter(c => c.status === 'approved').length },
  { value: 'rejected', label: 'Rejected', count: claims.value.filter(c => c.status === 'rejected').length },
])

const filteredClaims = computed(() => {
  let result = claims.value

  if (currentTab.value !== 'all') {
    result = result.filter(c => c.status === currentTab.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.full_name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      (c.agency_name || '').toLowerCase().includes(query)
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredClaims.value.length / pageSize))

const paginatedClaims = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredClaims.value.slice(start, start + pageSize)
})

watch([currentTab, searchQuery], () => {
  currentPage.value = 1
})

onMounted(async () => {
  await fetchClaims()
})

async function fetchClaims() {
  loading.value = true
  try {
    const { claims: data } = await $fetch<{ claims: AgentClaim[] }>('/api/admin/agents/claims')
    claims.value = data || []
  } catch (err) {
    console.error('Failed to fetch claims:', err)
    toast.add({ title: 'Failed to load claims', color: 'error' })
  } finally {
    loading.value = false
  }
}

function openReviewModal(claim: AgentClaim, action: 'approve' | 'reject') {
  selectedClaim.value = claim
  reviewAction.value = action
  adminNotes.value = ''
  showReviewModal.value = true
}

function viewClaimDetails(claim: AgentClaim) {
  selectedClaim.value = claim
  showDetailsModal.value = true
}

async function submitReview() {
  if (!selectedClaim.value) return
  
  submitting.value = true
  
  try {
    await $fetch(`/api/admin/agents/${selectedClaim.value.id}`, {
      method: 'PATCH',
      body: {
        status: reviewAction.value === 'approve' ? 'approved' : 'rejected',
        adminNotes: adminNotes.value || null
      }
    })
    
    // Update local state
    const claim = claims.value.find(c => c.id === selectedClaim.value?.id)
    if (claim) {
      claim.status = reviewAction.value === 'approve' ? 'approved' : 'rejected'
      claim.admin_notes = adminNotes.value || null
      claim.reviewed_at = new Date().toISOString()
    }
    
    showReviewModal.value = false
    
    toast.add({
      title: `Claim ${reviewAction.value === 'approve' ? 'approved' : 'rejected'}`,
      description: `${selectedClaim.value.full_name}'s claim has been ${reviewAction.value === 'approve' ? 'approved' : 'rejected'}.`,
      color: reviewAction.value === 'approve' ? 'success' : 'warning'
    })
  } catch (err: any) {
    toast.add({
      title: 'Failed to update claim',
      description: err.data?.message || 'Please try again.',
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'approved': 
      return 'bg-[#DBEDDB] text-[#1C3829] dark:bg-[#1C3829] dark:text-[#DBEDDB]'
    case 'rejected': 
      return 'bg-[#FFE2DD] text-[#5D1715] dark:bg-[#5D1715] dark:text-[#FFE2DD]'
    default: 
      return 'bg-[#FDECC8] text-[#402C1B] dark:bg-[#402C1B] dark:text-[#FDECC8]'
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
