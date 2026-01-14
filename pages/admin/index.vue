<template>
  <div class="space-y-8 max-w-[1200px] mx-auto">
    <!-- Page Header -->
    <div class="mb-8 group">
      <div class="text-6xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity cursor-default">🏡</div>
      <h1 class="text-4xl font-bold text-[#37352F] dark:text-[#FFFFFF] font-serif tracking-tight">Overview</h1>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div 
        v-for="(stat, index) in stats" 
        :key="index" 
        class="bg-white dark:bg-[#202020] p-4 rounded-lg border border-[#E1E1E1] dark:border-[#2F2F2F] hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer group"
        @click="stat.link && navigateTo(stat.link)"
      >
         <div class="flex flex-col h-full justify-between">
           <div class="flex items-start justify-between mb-2">
             <span class="text-[14px] font-medium text-[#787774] dark:text-[#9B9B9B]">{{ stat.label }}</span>
             <UIcon :name="stat.icon" class="w-4 h-4 text-[#91918E] group-hover:text-[#37352F] transition-colors" />
           </div>
           
           <div class="flex items-end gap-2">
             <span v-if="!loading" class="text-2xl font-semibold text-[#37352F] dark:text-white font-serif">{{ stat.value }}</span>
             <div v-else class="h-8 w-16 bg-[#F7F7F5] dark:bg-[#37352F] rounded animate-pulse"></div>
           </div>
         </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Recent Activity -->
      <div class="lg:col-span-2">
        <h2 class="text-lg font-semibold text-[#37352F] dark:text-[#D4D4D4] mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-history" class="w-4 h-4 text-[#91918E]" />
          Recent Activity
        </h2>
        
        <div class="bg-white dark:bg-[#202020] rounded-lg border border-[#E1E1E1] dark:border-[#2F2F2F] overflow-hidden">
          <div v-if="loading" class="p-4 space-y-4">
            <div v-for="i in 4" :key="i" class="h-10 bg-[#F7F7F5] dark:bg-[#2C2C2C] rounded animate-pulse"></div>
          </div>
          
          <div v-else-if="recentActivity.length === 0" class="p-12 text-center text-[#91918E]">
            No recent activity
          </div>
          
          <div v-else class="divide-y divide-[#E1E1E1] dark:divide-[#2F2F2F]">
            <div 
              v-for="activity in recentActivity" 
              :key="activity.id"
              class="px-4 py-3 hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] transition-colors cursor-pointer flex items-center gap-4 group"
              @click="activity.link && navigateTo(activity.link)"
            >
              <div class="w-8 h-8 rounded flex items-center justify-center text-lg bg-[#F7F7F5] dark:bg-[#2C2C2C] group-hover:bg-white dark:group-hover:bg-[#191919] border border-transparent group-hover:border-[#E1E1E1] dark:group-hover:border-[#37352F] transition-all">
                {{ activity.emoji || '📄' }}
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-[#37352F] dark:text-[#D4D4D4] truncate">{{ activity.title }}</p>
                <p class="text-xs text-[#91918E] truncate">{{ activity.subtitle }}</p>
              </div>
              
              <span class="text-xs text-[#91918E] whitespace-nowrap font-mono">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-8">
        
        <!-- Review Status Breakdown -->
        <div>
          <h2 class="text-lg font-semibold text-[#37352F] dark:text-[#D4D4D4] mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-pie-chart" class="w-4 h-4 text-[#91918E]" />
            Status
          </h2>
          
          <div class="bg-white dark:bg-[#202020] rounded-lg border border-[#E1E1E1] dark:border-[#2F2F2F] p-4 text-sm">
            <div v-for="status in reviewStatuses" :key="status.name" class="py-2 first:pt-0 last:pb-0">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[#37352F] dark:text-[#D4D4D4]">{{ status.name }}</span>
                <span class="font-mono text-[#91918E]">{{ status.count }}</span>
              </div>
              <div class="h-1.5 bg-[#F7F7F5] dark:bg-[#2C2C2C] rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full"
                  :class="status.colorClass"
                  :style="{ width: `${status.percentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div>
          <h2 class="text-lg font-semibold text-[#37352F] dark:text-[#D4D4D4] mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-zap" class="w-4 h-4 text-[#91918E]" />
            Actions
          </h2>
          
          <div class="space-y-2">
            <NuxtLink 
              v-for="action in quickActions" 
              :key="action.label"
              :to="action.link"
              class="flex items-center gap-3 px-3 py-2 bg-white dark:bg-[#202020] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] transition-colors text-sm text-[#37352F] dark:text-[#D4D4D4]"
            >
              <UIcon :name="action.icon" class="w-4 h-4 text-[#91918E]" />
              <span>{{ action.label }}</span>
            </NuxtLink>
          </div>
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
const loading = ref(true)

const stats = ref([
  { label: 'Total Reviews', value: '0', icon: 'i-lucide-message-square', link: '/admin/reviews' },
  { label: 'Pending Reviews', value: '0', icon: 'i-lucide-clock', link: '/admin/reviews' },
  { label: 'Agent Claims', value: '0', icon: 'i-lucide-user-check', link: '/admin/agents/claims' },
  { label: 'Contracts', value: '0', icon: 'i-lucide-file-text', link: '/admin/contracts' }
])

const reviewStatuses = ref([
  { name: 'Approved', count: 0, percentage: 0, colorClass: 'bg-[#6A9A78]' }, // Muted Green
  { name: 'Pending', count: 0, percentage: 0, colorClass: 'bg-[#E3B341]' }, // Muted Yellow
  { name: 'Rejected', count: 0, percentage: 0, colorClass: 'bg-[#D27C7C]' }, // Muted Red
])

const recentActivity = ref<any[]>([])

const quickActions = [
  { label: 'Moderate Reviews', link: '/admin/reviews', icon: 'i-lucide-shield-check' },
  { label: 'Review Agent Claims', link: '/admin/agents/claims', icon: 'i-lucide-user-check' },
  { label: 'View Contracts', link: '/admin/contracts', icon: 'i-lucide-file-text' },
]

onMounted(async () => {
  await fetchDashboardData()
})

async function fetchDashboardData() {
  loading.value = true
  
  try {
    // Fetch counts
    const [reviews, contracts, reports] = await Promise.all([
      client.from('reviews').select('*', { count: 'exact', head: true }),
      client.from('contracts').select('*', { count: 'exact', head: true }),
      client.from('condition_reports').select('*', { count: 'exact', head: true })
    ])

    stats.value[0].value = (reviews.count || 0).toString()
    stats.value[3].value = (contracts.count || 0).toString()

    // Fetch pending reviews count
    const { count: pendingCount } = await client
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .or('status.is.null,status.eq.pending')

    stats.value[1].value = (pendingCount || 0).toString()

    // Fetch pending agent claims count
    try {
      const { claims } = await $fetch<{ claims: any[] }>('/api/admin/agents/claims?status=pending')
      stats.value[2].value = (claims?.length || 0).toString()
    } catch (e) {
      stats.value[2].value = '0'
    }

    // Fetch review status breakdown
    const { data: allReviews } = await client
      .from('reviews')
      .select('status') as { data: { status: string | null }[] | null }

    if (allReviews) {
      const approved = allReviews.filter(r => r.status === 'approved').length
      const rejected = allReviews.filter(r => r.status === 'rejected').length
      const pending = allReviews.filter(r => !r.status || r.status === 'pending').length
      const total = allReviews.length || 1

      reviewStatuses.value = [
        { name: 'Approved', count: approved, percentage: (approved / total) * 100, colorClass: 'bg-[#6A9A78]' },
        { name: 'Pending', count: pending, percentage: (pending / total) * 100, colorClass: 'bg-[#E3B341]' },
        { name: 'Rejected', count: rejected, percentage: (rejected / total) * 100, colorClass: 'bg-[#D27C7C]' },
      ]
    }

    // Fetch recent activity
    const { data: recentContracts } = await client
      .from('contracts')
      .select('id, created_at, details')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: recentReports } = await client
      .from('condition_reports')
      .select('id, created_at, property_address')
      .order('created_at', { ascending: false })
      .limit(5)

    const activities: any[] = []

    ;(recentContracts || []).forEach((c: any) => {
      activities.push({
        id: `c-${c.id}`,
        title: c.details?.tenant_name ? `Contract for ${c.details.tenant_name}` : 'New Contract',
        subtitle: c.details?.property_address || 'No address',
        time: formatRelativeTime(c.created_at),
        emoji: '📄',
        link: `/contract/preview/${c.id}`,
        date: new Date(c.created_at)
      })
    })

    ;(recentReports || []).forEach((r: any) => {
      activities.push({
        id: `r-${r.id}`,
        title: 'Depsoit Report',
        subtitle: r.property_address || 'No address',
        time: formatRelativeTime(r.created_at),
        emoji: '📷',
        link: `/deposit/view/${r.id}`,
        date: new Date(r.created_at)
      })
    })

    recentActivity.value = activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 8)

  } catch (err) {
    console.error('Dashboard fetch error:', err)
  } finally {
    loading.value = false
  }
}

function formatRelativeTime(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
</script>
