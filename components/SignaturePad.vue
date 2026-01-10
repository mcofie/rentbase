<template>
  <div class="signature-pad-container">
    <div class="flex items-center justify-between mb-3">
      <label class="text-xs font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">
        {{ label }}
      </label>
      <button 
        v-if="hasSignature"
        type="button"
        @click="clear"
        class="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1"
      >
        <UIcon name="i-lucide-eraser" class="w-3 h-3" />
        Clear
      </button>
    </div>
    
    <div 
      class="signature-canvas-wrapper relative rounded-2xl border-2 border-dashed overflow-hidden transition-all"
      :class="[
        hasSignature 
          ? 'border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-900' 
          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50'
      ]"
    >
      <!-- Signature line -->
      <div class="absolute bottom-8 left-6 right-6 border-b border-stone-300 dark:border-stone-600 pointer-events-none"></div>
      <div class="absolute bottom-4 left-6 text-[10px] text-stone-400 uppercase tracking-widest pointer-events-none">
        Sign above
      </div>
      
      <!-- Canvas -->
      <canvas
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        class="cursor-crosshair touch-none"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart.prevent="handleTouchStart"
        @touchmove.prevent="handleTouchMove"
        @touchend.prevent="stopDrawing"
      />
      
      <!-- Placeholder text -->
      <div 
        v-if="!hasSignature && !isDrawing"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div class="text-center">
          <UIcon name="i-lucide-pen-tool" class="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
          <p class="text-sm text-stone-400 dark:text-stone-500">Draw your signature here</p>
        </div>
      </div>
    </div>
    
    <!-- Validation message -->
    <p v-if="required && !hasSignature" class="text-xs text-stone-400 mt-2">
      * Signature required
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  required?: boolean
  modelValue?: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'signed': [value: string]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const hasSignature = ref(false)
const lastX = ref(0)
const lastY = ref(0)

const canvasWidth = 400
const canvasHeight = 150

let ctx: CanvasRenderingContext2D | null = null

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = '#1f2937'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
    
    // Load existing signature if provided
    if (props.modelValue) {
      loadSignature(props.modelValue)
    }
  }
})

function loadSignature(dataUrl: string) {
  if (!ctx || !canvasRef.value) return
  
  const img = new Image()
  img.onload = () => {
    ctx!.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx!.drawImage(img, 0, 0)
    hasSignature.value = true
  }
  img.src = dataUrl
}

function getCoordinates(e: MouseEvent | Touch): { x: number; y: number } {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  
  if ('clientX' in e) {
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }
  return { x: 0, y: 0 }
}

function startDrawing(e: MouseEvent) {
  if (!ctx) return
  isDrawing.value = true
  const { x, y } = getCoordinates(e)
  lastX.value = x
  lastY.value = y
  ctx.beginPath()
  ctx.moveTo(x, y)
}

function draw(e: MouseEvent) {
  if (!isDrawing.value || !ctx) return
  
  const { x, y } = getCoordinates(e)
  
  ctx.beginPath()
  ctx.moveTo(lastX.value, lastY.value)
  ctx.lineTo(x, y)
  ctx.stroke()
  
  lastX.value = x
  lastY.value = y
  hasSignature.value = true
}

function handleTouchStart(e: TouchEvent) {
  if (!ctx || e.touches.length === 0) return
  
  isDrawing.value = true
  const touch = e.touches[0]
  const canvas = canvasRef.value
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  
  lastX.value = (touch.clientX - rect.left) * scaleX
  lastY.value = (touch.clientY - rect.top) * scaleY
  
  ctx.beginPath()
  ctx.moveTo(lastX.value, lastY.value)
}

function handleTouchMove(e: TouchEvent) {
  if (!isDrawing.value || !ctx || e.touches.length === 0) return
  
  const touch = e.touches[0]
  const canvas = canvasRef.value
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  
  const x = (touch.clientX - rect.left) * scaleX
  const y = (touch.clientY - rect.top) * scaleY
  
  ctx.beginPath()
  ctx.moveTo(lastX.value, lastY.value)
  ctx.lineTo(x, y)
  ctx.stroke()
  
  lastX.value = x
  lastY.value = y
  hasSignature.value = true
}

function stopDrawing() {
  if (isDrawing.value && hasSignature.value) {
    saveSignature()
  }
  isDrawing.value = false
}

function saveSignature() {
  if (!canvasRef.value) return
  const dataUrl = canvasRef.value.toDataURL('image/png')
  emit('update:modelValue', dataUrl)
  emit('signed', dataUrl)
}

function clear() {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  hasSignature.value = false
  emit('update:modelValue', null)
}

// Expose methods for parent component
defineExpose({
  clear,
  hasSignature: () => hasSignature.value,
  getSignature: () => canvasRef.value?.toDataURL('image/png') || null
})
</script>

<style scoped>
.signature-canvas-wrapper {
  aspect-ratio: 8 / 3;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
