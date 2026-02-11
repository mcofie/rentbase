<template>
  <!-- Loading state while checking auth -->
  <div v-if="checking" class="min-h-screen bg-[#F7F7F5] dark:bg-[#191919] flex items-center justify-center">
    <UIcon name="i-lucide-loader-2" class="w-6 h-6 animate-spin text-[#91918E]" />
  </div>

  <div v-else class="min-h-screen bg-[#F7F7F5] dark:bg-[#191919] flex items-center justify-center p-6 font-sans">
    <div class="w-full max-w-sm bg-white dark:bg-[#202020] p-8 rounded-xl shadow-sm border border-[#E1E1E1] dark:border-[#2F2F2F]">
      
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#F7F7F5] dark:bg-[#2C2C2C] mb-4">
          <span class="text-2xl">⚡</span>
        </div>
        <h1 class="text-2xl font-bold text-[#37352F] dark:text-[#D4D4D4] font-serif tracking-tight">RentBase Admin</h1>
        <p class="text-sm text-[#91918E] mt-1">Enter your credentials to access the workspace</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label class="text-[11px] font-semibold text-[#91918E] uppercase tracking-wide mb-1.5 block">
            Email Address
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="maxcofie@gmail.com"
            required
            class="w-full px-3 py-2.5 bg-white dark:bg-[#202020] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-[#37352F] dark:text-[#D4D4D4] font-medium focus:outline-none focus:ring-1 focus:ring-[#2EAADC] focus:border-[#2EAADC] transition-all text-sm placeholder-[#91918E]"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-[11px] font-semibold text-[#91918E] uppercase tracking-wide block">
              Password
            </label>
          </div>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-3 py-2.5 bg-white dark:bg-[#202020] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded text-[#37352F] dark:text-[#D4D4D4] font-medium focus:outline-none focus:ring-1 focus:ring-[#2EAADC] focus:border-[#2EAADC] transition-all text-sm placeholder-[#91918E]"
          />
        </div>

        <button
          type="submit"
          :disabled="loading || !email || !password"
          class="w-full py-2.5 bg-[#2EAADC] hover:bg-[#2383E2] text-white rounded font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <UIcon v-if="loading" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <span>Login to Workspace</span>
        </button>
      </form>

      <!-- Error / Dev Info -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded text-center">
        <p class="text-xs text-red-600 dark:text-red-400 font-medium break-all">{{ error }}</p>
      </div>
      
      <!-- Footer Link -->
       <div class="mt-6 text-center">
         <NuxtLink to="/" class="text-xs text-[#91918E] hover:text-[#37352F] dark:hover:text-[#D4D4D4] transition-colors">
           Return to website
         </NuxtLink>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function login() {
  loading.value = true
  error.value = null
  
  try {
    await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })
    
    router.push('/admin')
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}

const checking = ref(true)

onMounted(async () => {
  try {
    await $fetch('/api/admin/auth/me')
    router.push('/admin')
  } catch {
    // Not logged in, show form
    checking.value = false
  }
})
</script>
