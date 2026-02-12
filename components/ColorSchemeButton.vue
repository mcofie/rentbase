<template>
  <button
    class="flex items-center justify-center p-2.5 rounded-xl bg-white dark:bg-stone-900/50 border border-notion-border/50 dark:border-stone-800/50 hover:border-notion-blue transition-all active:scale-90 shadow-sm group"
    aria-label="Toggle Color Mode"
    @click="toggleColorMode"
  >
    <UIcon
      :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
      class="w-4 h-4 text-notion-text-secondary dark:text-stone-400 group-hover:text-notion-blue group-hover:rotate-12 transition-all duration-300"
    />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
