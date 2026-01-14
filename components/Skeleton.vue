<template>
  <div class="animate-pulse" :class="containerClass">
    <!-- Card skeleton -->
    <div 
      v-if="type === 'card'"
      class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800"
    >
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-stone-200 dark:bg-stone-700 rounded-lg"></div>
        <div class="flex-1">
          <div class="h-4 bg-stone-200 dark:bg-stone-700 rounded w-1/3 mb-2"></div>
          <div class="h-3 bg-stone-100 dark:bg-stone-800 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- List item skeleton -->
    <div 
      v-else-if="type === 'list'"
      class="flex items-center gap-4 py-4"
    >
      <div class="w-10 h-10 bg-stone-200 dark:bg-stone-700 rounded-lg"></div>
      <div class="flex-1">
        <div class="h-4 bg-stone-200 dark:bg-stone-700 rounded w-2/5 mb-2"></div>
        <div class="h-3 bg-stone-100 dark:bg-stone-800 rounded w-3/5"></div>
      </div>
      <div class="w-20 h-8 bg-stone-200 dark:bg-stone-700 rounded-lg"></div>
    </div>

    <!-- Text skeleton -->
    <div 
      v-else-if="type === 'text'"
      class="space-y-2"
    >
      <div class="h-4 bg-stone-200 dark:bg-stone-700 rounded" :class="widthClass"></div>
      <div v-if="(lines || 1) > 1" class="h-4 bg-stone-200 dark:bg-stone-700 rounded w-5/6"></div>
      <div v-if="(lines || 1) > 2" class="h-4 bg-stone-200 dark:bg-stone-700 rounded w-4/6"></div>
    </div>

    <!-- Image/media skeleton -->
    <div 
      v-else-if="type === 'image'"
      class="bg-stone-200 dark:bg-stone-700 rounded-lg"
      :class="aspectClass"
    >
      <div class="flex items-center justify-center h-full">
        <svg class="w-8 h-8 text-stone-300 dark:text-stone-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Avatar skeleton -->
    <div 
      v-else-if="type === 'avatar'"
      :class="['bg-stone-200 dark:bg-stone-700 rounded-full', sizeClass]"
    ></div>

    <!-- Button skeleton -->
    <div 
      v-else-if="type === 'button'"
      class="h-10 bg-stone-200 dark:bg-stone-700 rounded-lg"
      :class="widthClass"
    ></div>

    <!-- Default/box skeleton -->
    <div 
      v-else
      class="bg-stone-200 dark:bg-stone-700 rounded"
      :class="[widthClass, heightClass]"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: 'card' | 'list' | 'text' | 'image' | 'avatar' | 'button' | 'box'
  lines?: number
  width?: 'full' | 'lg' | 'md' | 'sm' | 'xs'
  height?: 'lg' | 'md' | 'sm' | 'xs'
  aspect?: 'square' | 'video' | 'portrait' | 'landscape'
  size?: 'lg' | 'md' | 'sm'
  containerClass?: string
}>()

const widthClass = computed(() => {
  switch (props.width) {
    case 'full': return 'w-full'
    case 'lg': return 'w-3/4'
    case 'md': return 'w-1/2'
    case 'sm': return 'w-1/3'
    case 'xs': return 'w-1/4'
    default: return 'w-full'
  }
})

const heightClass = computed(() => {
  switch (props.height) {
    case 'lg': return 'h-12'
    case 'md': return 'h-8'
    case 'sm': return 'h-6'
    case 'xs': return 'h-4'
    default: return 'h-8'
  }
})

const aspectClass = computed(() => {
  switch (props.aspect) {
    case 'square': return 'aspect-square'
    case 'video': return 'aspect-video'
    case 'portrait': return 'aspect-[3/4]'
    case 'landscape': return 'aspect-[4/3]'
    default: return 'aspect-square'
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'lg': return 'w-16 h-16'
    case 'md': return 'w-10 h-10'
    case 'sm': return 'w-8 h-8'
    default: return 'w-10 h-10'
  }
})
</script>
