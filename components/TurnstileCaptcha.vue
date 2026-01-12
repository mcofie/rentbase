<template>
  <div class="turnstile-wrapper">
    <!-- Turnstile Widget Container - Only show if site key is properly configured -->
    <div 
      v-if="shouldShowTurnstile"
      ref="turnstileContainer"
      class="cf-turnstile"
      :data-sitekey="siteKey"
      :data-theme="theme"
      :data-size="size"
      :data-callback="callbackName"
      :data-error-callback="errorCallbackName"
    ></div>
    
    <!-- Silent honeypot protection (always active, invisible to users) -->
    <div class="sr-only" aria-hidden="true">
      <label>Leave this empty</label>
      <input 
        type="text" 
        :name="honeypotFieldName" 
        v-model="honeypotValue"
        tabindex="-1"
        autocomplete="off"
      />
    </div>
    
    <!-- Hidden timestamp field for timing validation -->
    <input type="hidden" :name="timestampFieldName" :value="formLoadTime" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  honeypotFieldName?: string
  timestampFieldName?: string
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'auto',
  size: 'normal',
  honeypotFieldName: '_hp',
  timestampFieldName: '_ts'
})

const emit = defineEmits<{
  'verified': [token: string]
  'error': [error: string]
  'expired': []
}>()

const config = useRuntimeConfig()
const siteKey = computed(() => config.public.turnstileSiteKey)

// Only show Turnstile widget if site key is configured and not empty
// This prevents "Invalid domain" errors during local development
const shouldShowTurnstile = computed(() => {
  const key = siteKey.value
  return key && key.length > 10 && !key.includes('placeholder')
})

const turnstileContainer = ref<HTMLElement | null>(null)
const honeypotValue = ref('')
const formLoadTime = ref(Date.now().toString())
const widgetId = ref<string | null>(null)

// Generate unique callback names
const instanceId = Math.random().toString(36).substring(7)
const callbackName = `turnstileCallback_${instanceId}`
const errorCallbackName = `turnstileError_${instanceId}`

// Expose values for parent form
const token = ref('')
const getAntiSpamData = () => ({
  _hp: honeypotValue.value,
  _ts: formLoadTime.value,
  _captcha: token.value || undefined // Only include if we have a token
})

defineExpose({
  token,
  getAntiSpamData,
  reset: () => {
    token.value = ''
    formLoadTime.value = Date.now().toString() // Reset timestamp too
    if (widgetId.value && window.turnstile) {
      window.turnstile.reset(widgetId.value)
    }
  }
})

// Setup callbacks on mount
onMounted(() => {
  // Register global callbacks for Turnstile
  (window as any)[callbackName] = (responseToken: string) => {
    token.value = responseToken
    emit('verified', responseToken)
  }
  
  (window as any)[errorCallbackName] = (error: string) => {
    // Don't log or show error for common domain issues in development
    if (error === 'invalid-domain' || error === 'missing-input-response') {
      console.log('[Turnstile] Widget not available - using honeypot protection only')
      return
    }
    console.error('Turnstile error:', error)
    emit('error', error)
  }

  // Load Turnstile script only if we should show it
  if (shouldShowTurnstile.value && !document.querySelector('script[src*="turnstile"]')) {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  delete (window as any)[callbackName]
  delete (window as any)[errorCallbackName]
})

// TypeScript declaration for Turnstile
declare global {
  interface Window {
    turnstile?: {
      reset: (widgetId: string) => void
      render: (container: HTMLElement, options: any) => string
    }
  }
}
</script>

<style scoped>
.turnstile-wrapper {
  /* Container for anti-spam elements - no visible styling needed */
  display: contents;
}

/* Screen reader only - honeypot field */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
