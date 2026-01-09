<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Minimalist Navbar -->
      <nav class="max-w-5xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-stone-900 dark:bg-white rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <span class="text-white dark:text-stone-900 text-xl font-black">⚡</span>
          </div>
          <span class="text-2xl font-black text-stone-900 dark:text-white tracking-tighter">RentBase</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <ColorSchemeButton />
          <UserDropdown />
        </div>
      </nav>

      <main class="max-w-5xl w-full mx-auto px-6 py-12">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 animate-fade-in">
           <div>
             <p class="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-4">User Protocol</p>
             <h1 class="text-4xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tighter leading-none">
                {{ userPhone || 'Dashboard' }}
             </h1>
           </div>
           <div class="flex gap-3">
             <NuxtLink to="/contract/new" class="px-6 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-sm font-black rounded-full hover:scale-105 transition-transform">
               New Contract
             </NuxtLink>
             <NuxtLink to="/deposit/new" class="px-6 py-3 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white text-sm font-black rounded-full hover:scale-105 transition-transform border border-stone-200 dark:border-stone-700">
               Secure Deposit
             </NuxtLink>
           </div>
        </div>

        <!-- Stats Grid (Center Focused) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fade-in delay-100">
           <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-stone-900 p-8 rounded-[40px] border border-stone-100 dark:border-stone-800 text-center group hover:border-emerald-500/30 transition-all">
             <p class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 group-hover:text-emerald-500 transition-colors">{{ stat.label }}</p>
             <p class="text-4xl font-black text-stone-900 dark:text-white">{{ stat.value }}</p>
           </div>
        </div>

        <!-- Recent Documents (Straightforward List) -->
        <div class="animate-fade-in delay-200">
           <div class="flex items-center justify-between mb-8">
             <h2 class="text-xl font-black text-stone-900 dark:text-white tracking-tighter uppercase">Recent Records</h2>
             <div class="h-px flex-grow mx-6 bg-stone-200 dark:bg-stone-800"></div>
             <span class="text-[10px] font-black text-stone-400 uppercase tracking-widest">{{ documents.length }} total</span>
           </div>

           <div v-if="loading" class="space-y-4">
             <div v-for="i in 3" :key="i" class="h-24 bg-stone-100 dark:bg-stone-900 rounded-[32px] animate-pulse"></div>
           </div>

           <div v-else-if="documents.length > 0" class="space-y-4">
              <div v-for="doc in documents" :key="doc.id" 
                class="group bg-white dark:bg-stone-900 p-6 rounded-[32px] border border-stone-100 dark:border-stone-800 flex items-center justify-between hover:border-emerald-500/50 transition-all cursor-pointer"
                @click="navigateToDoc(doc)"
              >
                <div class="flex items-center gap-6">
                  <div class="w-14 h-14 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {{ doc.type === 'contract' ? '📜' : '🛡️' }}
                  </div>
                  <div>
                    <h4 class="text-lg font-black text-stone-900 dark:text-white tracking-tighter leading-tight">{{ doc.title }}</h4>
                    <p class="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">{{ doc.date }} • {{ doc.type }}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-4">
                  <div class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest"
                    :class="doc.status === 'final' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-stone-100 text-stone-400 dark:bg-stone-800'"
                  >
                    {{ doc.status }}
                  </div>
                  <UIcon name="i-lucide-chevron-right" class="w-5 h-5 text-stone-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
           </div>

           <div v-else class="py-20 text-center bg-white dark:bg-stone-900 rounded-[40px] border border-stone-200 dark:border-stone-800 border-dashed">
              <p class="text-stone-400 font-bold mb-4">No records found on protocol.</p>
              <NuxtLink to="/contract/new" class="text-emerald-500 font-black uppercase tracking-widest text-xs hover:underline">Start First Agreement</NuxtLink>
           </div>
        </div>
      </main>

      <footer class="py-12 border-t border-stone-200 dark:border-stone-800 mt-auto opacity-40">
         <div class="max-w-5xl mx-auto px-6 flex items-center justify-between">
            <span class="font-bold text-stone-900 dark:text-white tracking-widest text-[10px] uppercase">RentBase</span>
            <p class="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em]">Account Protocol 1.0</p>
         </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPhoneDisplay } from '~/utils/formatPhone'

const { user } = useAuth()
const supabase = useSupabaseClient()
const router = useRouter()

const loading = ref(true)
const userPhone = computed(() => user.value?.phone ? formatPhoneDisplay(user.value.phone) : '')
const documents = ref<any[]>([])

const stats = ref([
  { label: 'Contracts', value: 0 },
  { label: 'Reports', value: 0 },
  { label: 'Verified', value: 0 },
  { label: 'Reviews', value: 0 }
])

async function fetchDashboardData() {
  if (!user.value) return
  loading.value = true
  
  try {
    // Fetch contracts
    const { data: contracts } = await supabase
      .from('contracts')
      .select('*')
      .eq('owner_id', user.value.id)
      .order('created_at', { ascending: false })

    // Fetch reports
    const { data: reports } = await supabase
      .from('condition_reports')
      .select('*')
      .eq('owner_id', user.value.id)
      .order('created_at', { ascending: false })

    // Fetch reviews by user (optional, if we track it)
    const { data: reviews } = await supabase
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

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
</style>
