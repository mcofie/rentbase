<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
    <!-- Dot Pattern Background -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-[0.4] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"></div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Header -->
      <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-4 sticky top-0 z-50">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center transform -rotate-6 shadow-sm">
              <span class="text-lg">⚡</span>
            </div>
            <span class="font-bold text-gray-900 dark:text-white tracking-tighter text-lg">RentBase</span>
          </NuxtLink>
          
          <div class="flex items-center gap-3">
            <ColorSchemeButton />
            <UButton 
              variant="ghost"
              color="neutral"
              icon="i-lucide-arrow-left" 
              size="sm"
              class="rounded-full hidden sm:flex"
              @click="$router.back()"
            >
              Back
            </UButton>
            <div v-if="user" class="sm:ml-2">
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="px-4 py-8 sm:py-12">
        <div class="max-w-3xl mx-auto">
          <!-- Page Header -->
          <div class="text-center mb-10">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-uni-50 dark:bg-uni-900/20 rounded-[20px] sm:rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-uni-100 dark:border-uni-900/30">
              <span class="text-3xl sm:text-4xl text-uni-600 dark:text-uni-400">📜</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Pocket Lawyer
            </h1>
            <p class="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-medium">
              Create professional tenancy agreements in minutes
            </p>
          </div>
          
          <!-- Progress Indicator (Responsive) -->
          <div class="flex items-center justify-center gap-2 sm:gap-4 mb-12">
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div class="w-8 h-8 bg-uni-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-uni-500/30">
                1
              </div>
              <span class="text-[10px] sm:text-sm font-bold text-gray-900 dark:text-white">Details</span>
            </div>
            <div class="w-6 sm:w-12 h-px bg-gray-200 dark:bg-gray-800"></div>
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div class="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span class="text-[10px] sm:text-sm font-medium text-gray-400 dark:text-gray-600">Preview</span>
            </div>
            <div class="w-6 sm:w-12 h-px bg-gray-200 dark:bg-gray-800"></div>
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div class="w-8 h-8 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span class="text-[10px] sm:text-sm font-medium text-gray-400 dark:text-gray-600">Finalize</span>
            </div>
          </div>

          <!-- Contract Form -->
          <ContractForm 
            :loading="loading"
            @submit="handleSubmit"
            @cancel="$router.push('/')"
          />
          
          <!-- Error Alert -->
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :description="error"
            icon="i-lucide-alert-circle"
            class="mt-6"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContractDetails } from '~/types'

const { user } = useAuth()
definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const { loading, error, createDraft } = useContractGenerator()

async function handleSubmit(data: ContractDetails) {
  const contract = await createDraft(data)
  
  if (contract) {
    // Navigate to preview page
    router.push(`/contract/preview/${contract.id}`)
  }
}
</script>
