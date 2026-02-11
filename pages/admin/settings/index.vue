<template>
  <div class="space-y-6">
    
    <!-- Page Header (Notion Style) -->
    <div class="group relative mb-8">
      <div class="mb-4 text-6xl">
        ⚙️
      </div>
      <h1 class="text-4xl font-bold text-[#37352F] dark:text-[#FFFFFF] font-serif mb-2">Settings</h1>
      <p class="text-[#787774] dark:text-[#9B9B9B]">Manage service prices and global platform configurations.</p>
    </div>

    <!-- Main Content -->
    <div class="max-w-2xl">
      <div v-if="loading" class="p-12 text-center">
        <UIcon name="i-lucide-loader-2" class="w-5 h-5 animate-spin text-[#91918E] mx-auto mb-2" />
        <p class="text-sm text-[#91918E]">Loading configuration...</p>
      </div>

      <div v-else class="space-y-8">
        <!-- Service Pricing Section -->
        <section class="bg-white dark:bg-[#191919] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-[#E1E1E1] dark:border-[#2F2F2F] bg-[#F7F7F5] dark:bg-[#202020]">
            <h3 class="text-sm font-bold text-[#37352F] dark:text-[#D4D4D4] uppercase tracking-wider">Service Pricing (GHS)</h3>
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Contract Price -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label class="block text-sm font-medium text-[#37352F] dark:text-white mb-1">Tenancy Agreement (Contract)</label>
                <p class="text-xs text-[#787774] dark:text-[#9B9B9B]">Price charged for generating a legal contract.</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-[#91918E]">GHS</span>
                <input 
                  v-model.number="prices.price_contract"
                  type="number"
                  class="w-24 px-3 py-1.5 bg-white dark:bg-stone-900 border border-[#E1E1E1] dark:border-stone-700 rounded text-sm text-[#37352F] dark:text-white focus:ring-1 focus:ring-[#0075DE] outline-none transition-all"
                />
              </div>
            </div>

            <div class="h-px bg-[#E1E1E1] dark:bg-[#2F2F2F]"></div>

            <!-- Condition Report Price -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label class="block text-sm font-medium text-[#37352F] dark:text-white mb-1">Condition Report (Deposit Shield)</label>
                <p class="text-xs text-[#787774] dark:text-[#9B9B9B]">Price charged for generating a condition report with photos.</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-[#91918E]">GHS</span>
                <input 
                  v-model.number="prices.price_condition_report"
                  type="number"
                  class="w-24 px-3 py-1.5 bg-white dark:bg-stone-900 border border-[#E1E1E1] dark:border-stone-700 rounded text-sm text-[#37352F] dark:text-white focus:ring-1 focus:ring-[#0075DE] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Save button -->
        <div class="flex justify-end pt-4">
          <button 
            @click="saveSettings"
            :disabled="saving"
            class="px-6 py-2 bg-[#37352F] dark:bg-white text-white dark:text-[#37352F] rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <UIcon v-if="saving" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
            <UIcon v-else name="i-lucide-save" class="w-4 h-4" />
            {{ saving ? 'Saving Changes...' : 'Save Settings' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const toast = useToast()
const loading = ref(true)
const saving = ref(false)

const prices = ref({
  price_contract: 40,
  price_condition_report: 25
})

onMounted(async () => {
  await fetchSettings()
})

async function fetchSettings() {
  loading.value = true
  try {
    const { settings } = await $fetch<{ settings: any[] }>('/api/admin/settings')
    
    // Map settings to our reactive object
    settings.forEach(s => {
      if (s.key === 'price_contract') prices.value.price_contract = s.value.amount
      if (s.key === 'price_condition_report') prices.value.price_condition_report = s.value.amount
    })
  } catch (err) {
    console.error('Failed to load settings:', err)
  } finally {
    loading.value = false
  }
}

async function saveSettings() {
  saving.value = true
  try {
    await $fetch('/api/admin/settings', {
      method: 'PATCH',
      body: {
        settings: [
          { key: 'price_contract', value: { amount: prices.value.price_contract, currency: 'GHS' } },
          { key: 'price_condition_report', value: { amount: prices.value.price_condition_report, currency: 'GHS' } }
        ]
      }
    })
    
    toast.add({
      title: 'Settings saved',
      description: 'Platform prices have been updated successfully.',
      color: 'success'
    })
  } catch (err: any) {
    toast.add({
      title: 'Failed to save settings',
      description: err.data?.message || 'Please try again.',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}
</script>
