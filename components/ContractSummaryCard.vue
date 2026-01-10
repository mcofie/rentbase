<template>
  <div class="contract-summary-card bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-800 dark:to-stone-900 rounded-[24px] p-6 text-white overflow-hidden relative">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
    </div>

    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-calculator" class="w-4 h-4 text-white" />
          </div>
          <span class="text-xs font-black uppercase tracking-widest text-stone-400">Summary</span>
        </div>
        <span class="text-xs font-mono text-stone-500">{{ details.rent_currency }}</span>
      </div>

      <!-- Total Rent -->
      <div class="mb-6">
        <p class="text-xs text-stone-400 mb-1">Total Rent for {{ details.lease_duration_months }} months</p>
        <p class="text-3xl font-black tracking-tight">
          {{ formatNumber(totalRent) }}
          <span class="text-base font-normal text-stone-400">{{ details.rent_currency }}</span>
        </p>
      </div>

      <!-- Breakdown -->
      <div class="space-y-3 mb-6">
        <div class="flex items-center justify-between py-2 border-b border-stone-700/50">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-home" class="w-4 h-4 text-stone-400" />
            <span class="text-sm text-stone-300">{{ paymentFrequencyLabel }} Rent</span>
          </div>
          <span class="font-bold">{{ formatNumber(details.rent_amount) }}</span>
        </div>
        
        <div class="flex items-center justify-between py-2 border-b border-stone-700/50">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-shield" class="w-4 h-4 text-stone-400" />
            <span class="text-sm text-stone-300">Security Deposit</span>
          </div>
          <span class="font-bold">{{ formatNumber(details.security_deposit) }}</span>
        </div>

        <div class="flex items-center justify-between py-2 border-b border-stone-700/50">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-stone-400" />
            <span class="text-sm text-stone-300">Agreement Fee</span>
          </div>
          <span class="font-bold text-emerald-400">40</span>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-sm font-bold text-white">Move-in Cost</span>
          <span class="text-xl font-black text-emerald-400">{{ formatNumber(moveInCost) }}</span>
        </div>
      </div>

      <!-- Key Dates -->
      <div class="bg-stone-800/50 rounded-xl p-4 space-y-3">
        <p class="text-xs font-black uppercase tracking-widest text-stone-500 mb-3">Key Dates</p>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar-plus" class="w-4 h-4 text-emerald-400" />
            <span class="text-xs text-stone-400">Lease Starts</span>
          </div>
          <span class="text-sm font-bold">{{ formatDate(details.lease_start_date) }}</span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar-x" class="w-4 h-4 text-rose-400" />
            <span class="text-xs text-stone-400">Lease Ends</span>
          </div>
          <span class="text-sm font-bold">{{ formatDate(leaseEndDate) }}</span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-clock" class="w-4 h-4 text-amber-400" />
            <span class="text-xs text-stone-400">Duration</span>
          </div>
          <span class="text-sm font-bold">{{ details.lease_duration_months }} months</span>
        </div>
      </div>

      <!-- Parties Summary -->
      <div class="mt-4 pt-4 border-t border-stone-700/50">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-user" class="w-3 h-3 text-blue-400" />
            </div>
            <span class="text-stone-400 truncate max-w-[80px]">{{ details.landlord_name.split(' ')[0] }}</span>
          </div>
          <UIcon name="i-lucide-arrow-left-right" class="w-4 h-4 text-stone-600" />
          <div class="flex items-center gap-2">
            <span class="text-stone-400 truncate max-w-[80px]">{{ details.tenant_name.split(' ')[0] }}</span>
            <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <UIcon name="i-lucide-user-check" class="w-3 h-3 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContractDetails } from '~/types'

const props = defineProps<{
  details: ContractDetails
}>()

const paymentFrequencyLabel = computed(() => {
  switch (props.details.payment_frequency) {
    case 'monthly': return 'Monthly'
    case 'quarterly': return 'Quarterly'
    case 'yearly': return 'Yearly'
    default: return 'Periodic'
  }
})

const paymentsPerYear = computed(() => {
  switch (props.details.payment_frequency) {
    case 'monthly': return 12
    case 'quarterly': return 4
    case 'yearly': return 1
    default: return 12
  }
})

const totalRent = computed(() => {
  const monthlyEquiv = props.details.rent_amount * (paymentsPerYear.value / 12)
  return monthlyEquiv * props.details.lease_duration_months
})

const moveInCost = computed(() => {
  // First payment + deposit + agreement fee
  return props.details.rent_amount + props.details.security_deposit + 40
})

const leaseEndDate = computed(() => {
  if (!props.details.lease_start_date) return ''
  const date = new Date(props.details.lease_start_date)
  date.setMonth(date.getMonth() + props.details.lease_duration_months)
  return date.toISOString()
})

function formatNumber(num: number): string {
  if (!num) return '0'
  return new Intl.NumberFormat('en-GH').format(num)
}

function formatDate(dateString: string): string {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.contract-summary-card {
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
</style>
