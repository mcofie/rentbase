<template>
  <div class="contract-summary-card bg-notion-text dark:bg-stone-900 rounded-[24px] p-6 text-white overflow-hidden relative shadow-lg shadow-stone-300 dark:shadow-none">
    <!-- Background subtle texture -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E');"></div>
    </div>

    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-notion-pastel-blue rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-calculator" class="w-4 h-4 text-notion-blue" />
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-stone-400">Total Obligation</span>
        </div>
        <span class="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-stone-300">{{ details.rent_currency }}</span>
      </div>

      <!-- Total Rent -->
      <div class="mb-8">
        <p class="text-[11px] text-stone-400 mb-1">Estimated Commitment ({{ details.lease_duration_months }} Months)</p>
        <p class="text-4xl font-black tracking-tighter">
          {{ formatNumber(totalRent) }}
          <span class="text-base font-normal text-stone-500">{{ details.rent_currency }}</span>
        </p>
      </div>

      <!-- Breakdown -->
      <div class="space-y-3 mb-8">
        <div class="flex items-center justify-between py-2.5 border-b border-white/10">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-home" class="w-4 h-4 text-stone-500" />
            <span class="text-xs text-stone-300">{{ paymentFrequencyLabel }} Base Rent</span>
          </div>
          <span class="text-sm font-bold">{{ formatNumber(details.rent_amount) }}</span>
        </div>
        
        <div class="flex items-center justify-between py-2.5 border-b border-white/10">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-shield" class="w-4 h-4 text-stone-500" />
            <span class="text-xs text-stone-300">Security Deposit</span>
          </div>
          <span class="text-sm font-bold">{{ formatNumber(details.security_deposit) }}</span>
        </div>

        <div class="flex items-center justify-between py-2.5 border-b border-white/10">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-stone-500" />
            <span class="text-xs text-stone-300">Commission/Fees</span>
          </div>
          <span class="text-sm font-bold text-emerald-400">Free</span>
        </div>

        <div class="flex items-center justify-between pt-4">
          <span class="text-[11px] font-black uppercase tracking-widest text-stone-400">First Payment Amount</span>
          <span class="text-2xl font-black text-emerald-400 tracking-tight">{{ formatNumber(moveInCost) }}</span>
        </div>
      </div>

      <!-- Key Dates -->
      <div class="bg-white/5 rounded-2xl p-4 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar-days" class="w-4 h-4 text-blue-400" />
            <span class="text-[10px] uppercase font-bold text-stone-400">Lease window</span>
          </div>
          <span class="text-xs font-bold">{{ formatDate(details.lease_start_date) }} — {{ formatDate(leaseEndDate) }}</span>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-clock-rewind" class="w-4 h-4 text-amber-400" />
            <span class="text-[10px] uppercase font-bold text-stone-400">Total Span</span>
          </div>
          <span class="text-xs font-bold">{{ details.lease_duration_months }} Months</span>
        </div>
      </div>

      <!-- Parties Summary -->
      <div class="mt-8 pt-6 border-t border-white/10">
        <div class="flex items-center justify-between">
          <div class="flex -space-x-3 overflow-hidden">
            <div class="inline-block h-8 w-8 rounded-full ring-2 ring-notion-text bg-blue-500 flex items-center justify-center text-[10px] font-bold">L</div>
            <div class="inline-block h-8 w-8 rounded-full ring-2 ring-notion-text bg-emerald-500 flex items-center justify-center text-[10px] font-bold">T</div>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-stone-400 uppercase font-black tracking-widest leading-none">Parties</p>
            <p class="text-[11px] font-bold text-stone-300">{{ details.landlord_name.split(' ')[0] }} & {{ details.tenant_name.split(' ')[0] }}</p>
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
