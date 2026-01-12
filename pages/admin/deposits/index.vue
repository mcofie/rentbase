<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-black text-stone-900 dark:text-white tracking-tighter uppercase mb-2">Deposit Reports</h1>
        <p class="text-stone-500 font-medium">Condition reports for move-in/out</p>
      </div>
    </div>

    <div class="bg-white dark:bg-stone-900 rounded-[32px] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-xl shadow-stone-200/50 dark:shadow-none">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-stone-50 dark:bg-stone-950/50 border-b border-stone-100 dark:border-stone-800">
            <tr>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Date</th>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Property</th>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Type</th>
               <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-for="report in reports" :key="report.id" class="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
              <td class="p-6">
                 <span class="font-bold font-mono text-sm text-stone-900 dark:text-white">{{ new Date(report.report_date).toLocaleDateString() }}</span>
              </td>
              <td class="p-6">
                 <p class="font-bold text-sm text-stone-900 dark:text-white">{{ report.property_address || 'No Address' }}</p>
                 <p class="text-[10px] text-stone-400">{{ report.customer_email || 'Linked Account' }}</p>
              </td>
              <td class="p-6">
                 <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    <span class="text-[10px] font-black uppercase tracking-widest">{{ report.report_type }}</span>
                 </div>
              </td>
              <td class="p-6">
                  <span class="text-xs font-bold" :class="report.is_finalized ? 'text-emerald-500' : 'text-stone-400'">
                      {{ report.is_finalized ? 'Finalized' : 'Draft' }}
                  </span>
              </td>
              <td class="p-6 text-right">
                <button class="p-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors" title="View Report">
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
       <!-- Empty State -->
      <div v-if="reports.length === 0" class="p-12 text-center text-stone-400">
        <UIcon name="i-lucide-camera-off" class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p class="font-bold uppercase tracking-widest text-xs">No reports found</p>
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
const reports = ref<any[]>([])

onMounted(async () => {
  const { data } = await client
    .from('condition_reports')
    .select('*')
    .order('report_date', { ascending: false })
  
  if (data) reports.value = data
})
</script>
