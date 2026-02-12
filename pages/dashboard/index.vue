<template>
  <div class="relative">
    <!-- Sophisticated Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-notion-blue/5 dark:bg-notion-blue/10 blur-[120px] rounded-full"></div>
      <div class="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] rounded-full"></div>
    </div>

    <div class="max-w-6xl w-full mx-auto px-6 py-16 relative z-10">
        <!-- Header Section: High Impact -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20 animate-fade-in">
           <div class="space-y-2">
             <div class="inline-flex items-center gap-2 px-3 py-1 bg-notion-blue/10 dark:bg-notion-blue/20 rounded-full border border-notion-blue/20 mb-2">
               <div class="w-1.5 h-1.5 bg-notion-blue rounded-full animate-pulse"></div>
               <span class="text-[10px] font-black text-notion-blue uppercase tracking-widest">
                 {{ profile?.role === 'agent' ? 'Agent Protocol 1.0' : 'Member Protocol' }}
               </span>
             </div>
             <h1 class="text-5xl sm:text-6xl font-black text-notion-text dark:text-white tracking-tighter leading-none font-serif">
                {{ profile?.role === 'agent' ? 'Dashboard' : (profile?.full_name || 'My Portal') }}
             </h1>
             <p class="text-notion-text-secondary dark:text-stone-400 font-medium text-lg max-w-md">
                Manage your rental ecosystem, secure deposits, and verify identities from a single command center.
             </p>
           </div>
           
           <div class="flex flex-wrap gap-4">
              <NuxtLink to="/contract/new" class="group relative px-8 py-4 bg-notion-text dark:bg-white text-white dark:text-notion-text rounded-2xl overflow-hidden active:scale-95 transition-all shadow-xl shadow-notion-text/10">
                <div class="absolute inset-0 bg-gradient-to-r from-notion-blue to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span class="relative z-10 font-bold tracking-tight">New Contract</span>
              </NuxtLink>
              <NuxtLink to="/deposit/new" class="px-8 py-4 bg-white dark:bg-stone-900 text-notion-text dark:text-white rounded-2xl border border-notion-border dark:border-stone-800 hover:border-notion-blue dark:hover:border-notion-blue hover:shadow-lg active:scale-95 transition-all">
                <span class="font-bold tracking-tight">Secure Deposit</span>
              </NuxtLink>
           </div>
        </div>

        <!-- Stats Grid: Elegant Minimalism -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24 animate-fade-in delay-100">
           <div v-for="stat in stats" :key="stat.label" 
             class="relative bg-white dark:bg-stone-900/50 p-8 rounded-[32px] border border-notion-border/40 dark:border-stone-800/40 backdrop-blur-sm group hover:border-notion-blue/50 dark:hover:border-notion-blue/50 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-notion-blue/5"
           >
             <div class="absolute top-4 right-4 text-notion-border dark:text-stone-800 group-hover:text-notion-blue transition-colors">
               <UIcon :name="stat.icon" class="w-6 h-6 opacity-20 group-hover:opacity-100" />
             </div>
             
             <div class="space-y-4">
               <h3 class="text-[10px] font-black text-notion-text-secondary dark:text-stone-500 uppercase tracking-widest">{{ stat.label }}</h3>
               <div class="flex items-baseline gap-2">
                 <span class="text-5xl font-black text-notion-text dark:text-white tracking-tighter">{{ stat.value }}</span>
                 <div class="w-2 h-2 rounded-full" :class="stat.value > 0 ? 'bg-emerald-500' : 'bg-notion-border dark:bg-stone-800'"></div>
               </div>
             </div>
           </div>
        </div>

        <!-- Main Content Area -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-fade-in delay-200">
          <!-- Documents List (Left) -->
          <div class="xl:col-span-2 space-y-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <h2 class="text-2xl font-black text-notion-text dark:text-white tracking-tighter uppercase">Recent Records</h2>
                <div class="px-2 py-0.5 bg-notion-gray dark:bg-stone-800 rounded text-[10px] font-bold text-notion-text-secondary">{{ documents.length }}</div>
              </div>
              <div class="h-px flex-grow mx-8 bg-notion-border/30 dark:bg-stone-800/30"></div>
              <button class="text-[10px] font-black text-notion-blue uppercase tracking-widest hover:underline">View Archive</button>
            </div>

            <div v-if="loading" class="space-y-6">
              <div v-for="i in 3" :key="i" class="h-28 bg-notion-gray/50 dark:bg-stone-900/50 rounded-[28px] animate-pulse border border-notion-border/20 dark:border-stone-800/20"></div>
            </div>

            <div v-else-if="documents.length > 0" class="grid gap-4">
               <div v-for="doc in documents" :key="doc.id" 
                 class="group bg-notion-gray/30 dark:bg-stone-900/30 p-6 rounded-[28px] border border-transparent hover:border-notion-blue/30 hover:bg-white dark:hover:bg-stone-900 flex items-center justify-between transition-all cursor-pointer hover:shadow-2xl hover:shadow-notion-blue/5"
                 @click="navigateToDoc(doc)"
               >
                 <div class="flex items-center gap-6">
                   <div class="w-16 h-16 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-notion-border/10 dark:border-stone-700/10 group-hover:rotate-3 group-hover:scale-110 transition-all duration-500">
                     {{ doc.type === 'contract' ? '📜' : '🛡️' }}
                   </div>
                   <div class="space-y-1">
                     <h4 class="text-xl font-black text-notion-text dark:text-white tracking-tighter leading-tight">{{ doc.title }}</h4>
                     <div class="flex items-center gap-3">
                       <span class="text-[10px] font-black text-notion-text-secondary dark:text-stone-500 uppercase tracking-widest">{{ doc.date }}</span>
                       <div class="w-1 h-1 rounded-full bg-notion-border dark:bg-stone-800"></div>
                       <span class="text-[10px] font-black text-notion-blue uppercase tracking-widest">{{ doc.type }}</span>
                     </div>
                   </div>
                 </div>
                 
                 <div class="flex items-center gap-4">
                   <div class="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
                     :class="doc.status === 'final' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-notion-blue/10 text-notion-blue dark:bg-notion-blue/20'"
                   >
                     {{ doc.status }}
                   </div>
                   <div class="w-10 h-10 rounded-full flex items-center justify-center border border-notion-border/50 dark:border-stone-800 opacity-0 group-hover:opacity-100 transition-all">
                     <UIcon name="i-lucide-arrow-right" class="w-5 h-5 text-notion-text dark:text-white" />
                   </div>
                 </div>
               </div>
            </div>

            <div v-else class="py-24 text-center bg-notion-gray/20 dark:bg-stone-900/20 rounded-[40px] border-2 border-dashed border-notion-border dark:border-stone-800">
               <div class="w-20 h-20 bg-notion-gray dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
                 <UIcon name="i-lucide-folder-open" class="w-10 h-10 text-notion-border dark:text-stone-700" />
               </div>
               <h3 class="text-xl font-black text-notion-text dark:text-white mb-2">No records found on protocol</h3>
               <p class="text-notion-text-secondary dark:text-stone-500 mb-8 max-w-xs mx-auto">All verified agreements and condition reports will appear here.</p>
               <NuxtLink to="/contract/new" class="inline-flex items-center gap-2 px-6 py-3 bg-notion-blue text-white rounded-full font-bold text-sm shadow-xl shadow-notion-blue/20 hover:scale-105 active:scale-95 transition-all">
                 Generate First Contract
               </NuxtLink>
            </div>
          </div>

          <!-- Sidebar/Quick Actions (Right) -->
          <div class="space-y-8">
            <div class="bg-notion-text dark:bg-white p-8 rounded-[32px] text-white dark:text-notion-text shadow-2xl shadow-notion-text/20">
               <h3 class="text-sm font-black uppercase tracking-widest mb-4 opacity-70">Identity Status</h3>
               <div class="flex items-center gap-4 mb-6">
                 <div class="w-12 h-12 bg-white/20 dark:bg-notion-text/5 rounded-full flex items-center justify-center">
                    <UIcon name="i-lucide-user-check" class="w-6 h-6" />
                 </div>
                 <div>
                   <p class="text-2xl font-black tracking-tighter">{{ profile?.role === 'agent' ? 'Verified Agent' : 'Platinum User' }}</p>
                   <p class="text-xs font-bold opacity-60 tracking-wider">Level 1 Protocol Active</p>
                 </div>
               </div>
               <div class="h-px bg-white/10 dark:bg-notion-text/5 mb-6"></div>
               <button class="w-full py-4 bg-white dark:bg-notion-text text-notion-text dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                 Account Settings
               </button>
            </div>

            <div class="bg-white dark:bg-stone-900 p-8 rounded-[32px] border border-notion-border dark:border-stone-800">
               <h3 class="text-xs font-black uppercase tracking-widest mb-6 text-notion-text-secondary dark:text-stone-500">Global Search</h3>
               <div class="relative group">
                 <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UIcon name="i-lucide-search" class="w-4 h-4 text-notion-border group-focus-within:text-notion-blue transition-colors" />
                 </div>
                 <input type="text" placeholder="Search ID or Phone..." class="w-full pl-11 pr-4 py-4 bg-notion-gray/50 dark:bg-stone-950/50 border border-notion-border/50 dark:border-stone-800 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-notion-blue/20 focus:border-notion-blue transition-all" />
               </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPhoneDisplay } from '~/utils/formatPhone'

const { user, profile, fetchProfile } = useAuth()
const supabase = useSupabaseClient()
const router = useRouter()

const loading = ref(true)
const userPhone = computed(() => user.value?.phone ? formatPhoneDisplay(user.value.phone) : '')
const documents = ref<any[]>([])

const stats = ref([
  { label: 'Contracts', value: 0, icon: 'i-lucide-file-text' },
  { label: 'Reports', value: 0, icon: 'i-lucide-shield-check' },
  { label: 'Verified', value: 0, icon: 'i-lucide-check-circle' },
  { label: 'Reviews', value: 0, icon: 'i-lucide-star' }
])

async function fetchDashboardData() {
  if (!user.value) return
  loading.value = true
  
  try {
    // Fetch contracts
    const { data: contracts } = await (supabase as any)
      .schema('rentbase')
      .from('contracts')
      .select('*')
      .eq('owner_id', user.value.id)
      .order('created_at', { ascending: false })

    // Fetch reports
    const { data: reports } = await (supabase as any)
      .schema('rentbase')
      .from('condition_reports')
      .select('*')
      .eq('owner_id', user.value.id)
      .order('created_at', { ascending: false })

    // Fetch reviews by user (optional, if we track it)
    const { data: reviews } = await (supabase as any)
      .schema('rentbase')
      .from('reviews')
      .select('*')
      .eq('reviewer_id', user.value.id)

    stats.value[0].value = contracts?.length || 0
    stats.value[1].value = reports?.length || 0
    stats.value[3].value = reviews?.length || 0

    // Combine for recent docs
    const combined = [
      ...((contracts as any[]) || []).map(c => ({
        id: c.id,
        title: `${c.landlord_name} Agreement`,
        type: 'contract',
        status: (c as any).finalized ? 'final' : 'draft',
        date: new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      })),
      ...((reports as any[]) || []).map(r => ({
        id: r.id,
        title: `Report: ${r.property_address.split(',')[0]}`,
        type: 'deposit',
        status: 'final',
        date: new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    documents.value = combined
  } catch (err) {
    console.error('Dashboard fetch error:', err)
  } finally {
    loading.value = false
  }
}

function navigateToDoc(doc: any) {
  if (doc.type === 'contract') {
    router.push(`/contract/preview/${doc.id}`)
  } else {
    // router.push(`/deposit/preview/${doc.id}`)
  }
}

onMounted(async () => {
  await fetchProfile()
  if (!user.value) {
    router.push('/auth/login')
    return
  }
  fetchDashboardData()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
</style>
