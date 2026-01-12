<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-black text-stone-900 dark:text-white tracking-tighter uppercase mb-2">Legal Contracts</h1>
        <p class="text-stone-500 font-medium">Generated Tenancy Agreements</p>
      </div>
    </div>

    <div class="bg-white dark:bg-stone-900 rounded-[32px] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-xl shadow-stone-200/50 dark:shadow-none">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-stone-50 dark:bg-stone-950/50 border-b border-stone-100 dark:border-stone-800">
            <tr>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Date</th>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Customer</th>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-for="contract in contracts" :key="contract.id" class="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
              <td class="p-6">
                 <span class="font-bold font-mono text-sm text-stone-900 dark:text-white">{{ new Date(contract.created_at).toLocaleDateString() }}</span>
              </td>
              <td class="p-6">
                 <p class="font-bold text-sm text-stone-900 dark:text-white">{{ contract.customer_email || 'Linked Account' }}</p>
                 <p class="text-[10px] text-stone-400 font-mono">{{ contract.id.slice(0, 8) }}...</p>
              </td>
              <td class="p-6">
                 <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg" :class="contract.is_fully_signed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'">
                    <UIcon :name="contract.is_fully_signed ? 'i-lucide-check-circle-2' : 'i-lucide-clock'" class="w-3 h-3" />
                    <span class="text-[10px] font-black uppercase tracking-widest">{{ contract.is_fully_signed ? 'Signed' : 'Pending' }}</span>
                 </div>
              </td>
              <td class="p-6 text-right">
                <button class="p-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors" title="View Details">
                    <UIcon name="i-lucide-eye" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
       <!-- Empty State -->
      <div v-if="contracts.length === 0" class="p-12 text-center text-stone-400">
        <UIcon name="i-lucide-file-x" class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p class="font-bold uppercase tracking-widest text-xs">No contracts generated yet</p>
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
const contracts = ref<any[]>([])

onMounted(async () => {
  const { data } = await client
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (data) contracts.value = data
})
</script>
