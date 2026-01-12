<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-4xl font-black text-stone-900 dark:text-white tracking-tighter uppercase">Overview</h1>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="(stat, index) in stats" :key="index" class="bg-white dark:bg-stone-900 p-8 rounded-[32px] border border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-none">
         <div class="flex items-start justify-between mb-6">
           <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :class="stat.bgClass">
             <UIcon :name="stat.icon" class="w-6 h-6" :class="stat.textClass" />
           </div>
           <span class="text-3xl font-black text-stone-900 dark:text-white">{{ stat.value }}</span>
         </div>
         <p class="font-bold text-stone-400 uppercase tracking-widest text-xs">{{ stat.label }}</p>
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

const stats = ref([
  { label: 'Total Reviews', value: '0', icon: 'i-lucide-message-square', bgClass: 'bg-emerald-100 dark:bg-emerald-900/20', textClass: 'text-emerald-500' },
  { label: 'Contracts Generated', value: '0', icon: 'i-lucide-file-text', bgClass: 'bg-blue-100 dark:bg-blue-900/20', textClass: 'text-blue-500' },
  { label: 'Deposits Reports', value: '0', icon: 'i-lucide-camera', bgClass: 'bg-orange-100 dark:bg-orange-900/20', textClass: 'text-orange-500' }
])

onMounted(async () => {
    // Parallel Fetch Stats
    const [reviews, contracts, reports] = await Promise.all([
        client.from('reviews').select('*', { count: 'exact', head: true }),
        client.from('contracts').select('*', { count: 'exact', head: true }),
        client.from('condition_reports').select('*', { count: 'exact', head: true })
    ])
    
    stats.value[0].value = reviews.count?.toString() || '0'
    stats.value[1].value = contracts.count?.toString() || '0'
    stats.value[2].value = reports.count?.toString() || '0'
})
</script>
