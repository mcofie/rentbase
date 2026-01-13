<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
    <div class="text-center">
      <div v-if="loading" class="space-y-4">
        <div class="w-8 h-8 border-2 border-stone-800 dark:border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-stone-500 dark:text-stone-400 text-sm">Loading signing page...</p>
      </div>
      
      <div v-else-if="error" class="space-y-4 p-8">
        <div class="w-12 h-12 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto">
          <UIcon name="i-lucide-alert-circle" class="w-6 h-6 text-red-500" />
        </div>
        <h2 class="text-lg font-bold text-stone-900 dark:text-white">Invalid Link</h2>
        <p class="text-stone-500 dark:text-stone-400 text-sm max-w-xs">{{ error }}</p>
        <NuxtLink to="/" class="inline-block mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800">
          Go Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Short URL redirect for contract signing
 * Supports both:
 * - Short codes (8 chars): /s/AbC12345 -> looks up short_code
 * - Full UUIDs (36 chars): /s/abc-123-... -> looks up sign_token
 */

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const code = route.params.token as string
  
  if (!code) {
    error.value = 'No signing code provided.'
    loading.value = false
    return
  }

  try {
    // Check if it's a short code (8 chars) or full UUID (36 chars)
    const isShortCode = code.length <= 12 && !code.includes('-')

    let signToken: string | null = null

    if (isShortCode) {
      // Look up by short code (check both landlord and tenant)
      const { data: landlordMatch } = await (supabase
        .from('contracts') as any)
        .select('landlord_sign_token')
        .eq('landlord_short_code', code)
        .single()

      if (landlordMatch) {
        signToken = landlordMatch.landlord_sign_token
      } else {
        // Try tenant short code
        const { data: tenantMatch } = await (supabase
          .from('contracts') as any)
          .select('tenant_sign_token')
          .eq('tenant_short_code', code)
          .single()

        if (tenantMatch) {
          signToken = tenantMatch.tenant_sign_token
        }
      }
    } else {
      // It's a full UUID, use directly
      signToken = code
    }

    if (signToken) {
      // Redirect to full signing page
      router.replace(`/contract/sign/${signToken}`)
    } else {
      error.value = 'This signing link is invalid or has expired.'
      loading.value = false
    }
  } catch (e: any) {
    console.error('Short code lookup error:', e)
    error.value = 'Failed to load signing page. Please try again.'
    loading.value = false
  }
})
</script>
