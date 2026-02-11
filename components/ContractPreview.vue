<template>
  <div class="contract-preview-container relative">
    <!-- Document Container -->
    <div class="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 sm:p-16 min-h-[1000px] relative">
      
      <!-- Letter Watermark -->
      <div v-if="true" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <div class="rotate-[-45deg] scale-150">
          <p class="text-[120px] font-black tracking-[0.2em] text-stone-900 dark:text-stone-100">DRAFT</p>
        </div>
      </div>

      <!-- Formal Header -->
      <div class="text-center mb-16 relative border-stone-900 dark:border-stone-100">
        <div class="inline-block p-4 border-2 border-stone-900 dark:border-stone-100 mb-8">
           <div class="w-12 h-12 bg-stone-900 dark:bg-white flex items-center justify-center shadow-lg mx-auto mb-2">
              <UIcon name="i-lucide-box" class="w-6 h-6 text-white dark:text-stone-900" />
           </div>
           <p class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900 dark:text-stone-100">RentBase Protocol</p>
        </div>

        <div>
          <h1 class="text-3xl font-serif font-bold text-stone-900 dark:text-white uppercase tracking-widest border-b-2 border-stone-900 dark:border-stone-100 pb-4 inline-block mb-6">
            Tenancy Agreement
          </h1>
        </div>
        
        <div class="flex flex-col items-center gap-1 text-stone-500 uppercase tracking-widest text-[10px] font-bold">
          <span>Pursuant to the Rent Act, 1963 (Act 220)</span>
          <span>Republic of Ghana</span>
        </div>
      </div>

      <!-- Formal Body -->
      <div class="space-y-12 font-serif text-stone-800 dark:text-stone-200 leading-[1.8] letter-body">
        
        <!-- Opening -->
        <p class="text-sm">
          <strong>THIS TENANCY AGREEMENT</strong> is formally entered into this 
          <span class="border-b border-stone-400 border-dotted px-2">{{ formatDate(new Date().toISOString()) }}</span>.
        </p>

        <!-- The Parties -->
        <section class="space-y-6">
          <p class="text-[10px] font-black uppercase tracking-widest border-l-4 border-stone-900 dark:border-stone-100 pl-4">The Parties</p>
          
          <div class="grid gap-8 pl-4">
            <div class="space-y-3">
              <p class="text-sm uppercase font-bold tracking-tight">1. The Landlord</p>
              <div class="pl-4 border-l border-stone-200 dark:border-stone-700 space-y-1">
                <p class="text-base font-bold text-stone-900 dark:text-white underline decoration-stone-300">{{ details.landlord_name.toUpperCase() }}</p>
                <p class="text-xs text-stone-500">ID: {{ details.landlord_id_type }} #{{ details.landlord_id_number }}</p>
                <p class="text-xs text-stone-500">TEL: {{ details.landlord_phone }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <p class="text-sm uppercase font-bold tracking-tight">2. The Tenant</p>
              <div class="pl-4 border-l border-stone-200 dark:border-stone-700 space-y-1">
                <p class="text-base font-bold text-stone-900 dark:text-white underline decoration-stone-300">{{ details.tenant_name.toUpperCase() }}</p>
                <p class="text-xs text-stone-500">ID: {{ details.tenant_id_type }} #{{ details.tenant_id_number }}</p>
                <p class="text-xs text-stone-500">TEL: {{ details.tenant_phone }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Terms -->
        <section class="space-y-8">
          <p class="text-[10px] font-black uppercase tracking-widest border-l-4 border-stone-900 dark:border-stone-100 pl-4">Terms and Particulars</p>
          
          <div class="pl-4 space-y-6">
            <div class="space-y-2">
               <p class="text-sm font-bold uppercase underline">The Premises</p>
               <p class="text-sm">{{ details.property_address }} (Categorized as {{ details.property_type }})</p>
            </div>

            <div class="grid grid-cols-2 gap-12">
              <div class="space-y-1">
                 <p class="text-[10px] text-stone-400 uppercase font-black tracking-widest">Lease Duration</p>
                 <p class="text-lg font-bold">{{ details.lease_duration_months }} Months</p>
                 <p class="text-[10px] text-stone-500">From {{ formatDate(details.lease_start_date) }}</p>
              </div>
              <div class="space-y-1">
                 <p class="text-[10px] text-stone-400 uppercase font-black tracking-widest">Rent & Frequency</p>
                 <p class="text-lg font-bold text-emerald-700 dark:text-emerald-400">{{ details.rent_currency }} {{ formatNumber(details.rent_amount) }}</p>
                 <p class="text-[10px] text-stone-500">Payable {{ details.payment_frequency }}</p>
              </div>
            </div>

            <div class="p-4 border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/20 text-sm">
                <span class="font-bold uppercase tracking-widest text-[10px] mr-4">Security Deposit</span>
                <span class="font-bold">{{ details.rent_currency }} {{ formatNumber(details.security_deposit) }}</span>
            </div>
          </div>
        </section>

        <!-- Obligations Table -->
        <section class="space-y-4">
           <p class="text-[10px] font-black uppercase tracking-widest border-l-4 border-stone-900 dark:border-stone-100 pl-4">Standard Covenants</p>
           <div class="pl-4">
             <table class="w-full text-sm border-collapse">
               <tbody>
                 <tr v-for="(item, idx) in [
                   'Timely payment of rent through specified channels',
                   'Maintenance of the property in tenantable repair',
                   'Adherence to peaceful enjoyment and community rules',
                   'Strict prohibition of unauthorized structural modifications',
                   'Requirement of written consent for any subletting'
                 ]" :key="idx" class="border-b border-stone-100 dark:border-stone-800">
                    <td class="py-3 pr-4 font-bold text-stone-400 w-8">{{ (idx + 1).toString().padStart(2, '0') }}</td>
                    <td class="py-3">{{ item }}</td>
                 </tr>
               </tbody>
             </table>
           </div>
        </section>

        <!-- Signature Section -->
        <section class="pt-20">
          <div class="grid grid-cols-2 gap-16">
            <div class="space-y-12">
               <div class="h-16 border-b border-stone-900 dark:border-stone-100 flex items-end pb-2">
                 <p class="text-[10px] text-stone-300 font-mono tracking-widest uppercase">Digital Signature Pending</p>
               </div>
               <div class="text-xs uppercase tracking-widest font-bold">
                 <p class="mb-1">{{ details.landlord_name }}</p>
                 <p class="text-stone-400">The Landlord</p>
               </div>
            </div>
            <div class="space-y-12">
               <div class="h-16 border-b border-stone-900 dark:border-stone-100 flex items-end pb-2">
                 <p class="text-[10px] text-stone-300 font-mono tracking-widest uppercase">Digital Signature Pending</p>
               </div>
               <div class="text-xs uppercase tracking-widest font-bold">
                 <p class="mb-1">{{ details.tenant_name }}</p>
                 <p class="text-stone-400">The Tenant</p>
               </div>
            </div>
          </div>
        </section>

        <!-- Footer Note -->
        <footer class="pt-24 opacity-30 text-center space-y-2">
           <p class="text-[10px] uppercase tracking-[0.4em] font-black">Verified RentBase Protocol Agreement</p>
           <p class="text-[8px] font-mono uppercase">RB-HASH: {{ generateDraftId() }}-5592-X9</p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContractDetails } from '~/types'

const props = defineProps<{
  details: ContractDetails
}>()

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatNumber(num: number): string {
  if (!num) return '0'
  return new Intl.NumberFormat('en-GH').format(num)
}

function generateDraftId(): string {
  return 'RB-' + Date.now().toString(36).toUpperCase()
}
</script>

<style scoped>
.letter-body {
  font-family: 'Times New Roman', Times, serif;
}

@media print {
  .bg-stone-50 { background-color: transparent !important; }
}
</style>
