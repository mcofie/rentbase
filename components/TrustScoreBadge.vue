<template>
  <div 
    v-if="level"
    class="inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all"
    :class="[
      level === 'green' ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400' :
      level === 'yellow' ? 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400' :
      'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400'
    ]"
  >
    <span class="text-base">{{ emoji }}</span>
    <span class="text-xs font-black uppercase tracking-widest">{{ label }}</span>
    <span v-if="showScore && score !== undefined" class="ml-2 font-black border-l pl-2 opacity-50 text-[10px]">{{ score.toFixed(1) }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  level: 'green' | 'yellow' | 'red' | null
  score?: number
  showScore?: boolean
}>()

const emoji = computed(() => {
  if (props.level === 'green') return '✅'
  if (props.level === 'yellow') return '⚠️'
  return '🚫'
})

const label = computed(() => {
  if (props.level === 'green') return 'Trusted'
  if (props.level === 'yellow') return 'Caution'
  return 'High Risk'
})
</script>
