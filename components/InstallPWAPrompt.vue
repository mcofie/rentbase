<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div 
        v-if="showPrompt && canInstall" 
        class="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 bg-white dark:bg-stone-900 border-t border-[#E1E1E1] dark:border-stone-800 shadow-lg safe-area-bottom"
      >
        <div class="max-w-lg mx-auto flex items-center gap-4">
          <!-- App Icon -->
          <div class="w-12 h-12 bg-[#0075DE] rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-white text-xl">⚡</span>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-[#050505] dark:text-white text-sm">Install RentBase</h3>
            <p class="text-xs text-[#666666] dark:text-stone-400 truncate">Add to home screen for quick access</p>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <button 
              @click="dismiss"
              class="px-3 py-2 text-sm font-medium text-[#666666] hover:text-[#050505] transition-colors"
            >
              Later
            </button>
            <button 
              @click="install"
              class="px-4 py-2 bg-[#0075DE] text-white text-sm font-medium rounded-lg hover:bg-[#005BAB] transition-colors"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// PWA install prompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const showPrompt = ref(false)
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)

const canInstall = computed(() => deferredPrompt.value !== null)

// Check if already installed
const isInstalled = computed(() => {
  if (import.meta.client) {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true
  }
  return false
})

onMounted(() => {
  // Don't show if already installed
  if (isInstalled.value) return
  
  // Check if user dismissed recently
  const dismissed = localStorage.getItem('pwa-prompt-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed, 10)
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24)
    if (daysSinceDismissed < 7) return // Don't show for 7 days after dismissal
  }
  
  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt.value = e as BeforeInstallPromptEvent
    
    // Show prompt after a short delay (don't interrupt initial experience)
    setTimeout(() => {
      showPrompt.value = true
    }, 3000)
  })
  
  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    deferredPrompt.value = null
    console.log('PWA installed successfully')
  })
})

async function install() {
  if (!deferredPrompt.value) return
  
  try {
    await deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
      dismiss()
    }
  } catch (err) {
    console.error('Error installing PWA:', err)
  }
  
  deferredPrompt.value = null
  showPrompt.value = false
}

function dismiss() {
  showPrompt.value = false
  localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
}
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
