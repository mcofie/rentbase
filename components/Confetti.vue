<template>
  <div 
    ref="confettiContainer"
    class="fixed inset-0 pointer-events-none z-[200]"
    aria-hidden="true"
  >
    <canvas ref="canvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup lang="ts">
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

const props = defineProps<{
  active?: boolean
  particleCount?: number
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'complete'): void
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const particles = ref<Particle[]>([])
let animationFrame: number | null = null

const colors = [
  '#10b981', // emerald
  '#6366f1', // indigo
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#06b6d4', // cyan
]

function createParticles() {
  const count = props.particleCount || 100
  const newParticles: Particle[] = []
  
  for (let i = 0; i < count; i++) {
    newParticles.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    })
  }
  
  particles.value = newParticles
}

function animate() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx || !canvas.value) return
  
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  let activeParticles = 0
  
  particles.value.forEach(particle => {
    // Update
    particle.vy += 0.1 // gravity
    particle.x += particle.vx
    particle.y += particle.vy
    particle.rotation += particle.rotationSpeed
    particle.vx *= 0.99 // air resistance
    
    // Draw
    if (particle.y < window.innerHeight + 50) {
      activeParticles++
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)
      ctx.fillStyle = particle.color
      ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2)
      ctx.restore()
    }
  })
  
  if (activeParticles > 0) {
    animationFrame = requestAnimationFrame(animate)
  } else {
    emit('complete')
  }
}

function start() {
  if (!canvas.value) return
  
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  
  createParticles()
  animate()
  
  // Auto-stop after duration
  setTimeout(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      emit('complete')
    }
  }, props.duration || 3000)
}

watch(() => props.active, (newVal) => {
  if (newVal) {
    start()
  }
}, { immediate: true })

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>
