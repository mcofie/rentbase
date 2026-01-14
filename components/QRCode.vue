<template>
  <div class="inline-flex flex-col items-center">
    <!-- QR Code -->
    <div 
      :class="['bg-white p-3 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700', containerClass]"
    >
      <div v-if="loading" class="animate-pulse bg-stone-100 rounded" :style="{ width: `${size}px`, height: `${size}px` }"></div>
      <img 
        v-else-if="qrDataUrl" 
        :src="qrDataUrl" 
        :alt="`QR Code for ${value}`"
        :width="size"
        :height="size"
        class="rounded"
      />
      <div v-else class="flex items-center justify-center text-stone-400" :style="{ width: `${size}px`, height: `${size}px` }">
        <UIcon name="i-lucide-qr-code" class="w-8 h-8" />
      </div>
    </div>
    
    <!-- Label -->
    <p v-if="label" class="text-xs text-stone-500 dark:text-stone-400 mt-2 text-center">
      {{ label }}
    </p>
    
    <!-- Code Display -->
    <p v-if="showCode && code" class="font-mono font-bold text-sm text-stone-900 dark:text-white mt-1 tracking-wider">
      {{ code }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { generateQRCode } from '~/utils/qrcode'

const props = defineProps<{
  value: string
  size?: number
  label?: string
  code?: string
  showCode?: boolean
  containerClass?: string
}>()

const loading = ref(true)
const qrDataUrl = ref<string | null>(null)

const size = computed(() => props.size || 150)

onMounted(async () => {
  if (props.value) {
    try {
      qrDataUrl.value = await generateQRCode(props.value, size.value)
    } catch (err) {
      console.error('Failed to generate QR code:', err)
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})

// Watch for value changes
watch(() => props.value, async (newValue) => {
  if (newValue) {
    loading.value = true
    try {
      qrDataUrl.value = await generateQRCode(newValue, size.value)
    } catch (err) {
      console.error('Failed to generate QR code:', err)
    } finally {
      loading.value = false
    }
  }
})
</script>
