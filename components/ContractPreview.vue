<template>
  <div class="contract-preview-container relative">
    <!-- Watermark Overlay -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
      <div class="watermark-pattern">
        <span 
          v-for="i in 6" 
          :key="i" 
          class="watermark-text"
          :style="{ animationDelay: `${i * 0.1}s` }"
        >
          DRAFT
        </span>
      </div>
    </div>

    <!-- Document Container -->
    <div class="bg-white dark:bg-stone-900 rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-stone-200/50 dark:shadow-none border border-stone-200 dark:border-stone-800 overflow-hidden relative">
      
      <!-- Document Header -->
      <div class="p-6 sm:p-8 border-b-2 border-stone-900 dark:border-white bg-stone-50 dark:bg-stone-800/30">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-stone-900 dark:bg-white rounded-xl flex items-center justify-center">
              <UIcon name="i-lucide-box" class="w-5 h-5 text-white dark:text-stone-900" />
            </div>
            <span class="text-xs font-black text-stone-500 uppercase tracking-[0.2em]">RentBase Protocol</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/30">
            <span class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span class="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase">Unpaid Draft</span>
          </div>
        </div>
        
        <h1 class="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white text-center tracking-tight uppercase">
          Residential Tenancy Agreement
        </h1>
        <p class="text-center text-sm text-stone-500 mt-2">Made pursuant to the Rent Act, 1963 (Act 220) of Ghana</p>
      </div>

      <!-- Document Body - Legal Content -->
      <div class="p-6 sm:p-8 space-y-8 text-stone-800 dark:text-stone-200 leading-relaxed relative legal-content">
        
        <!-- Preamble -->
        <section class="legal-section">
          <p class="text-sm">
            <strong class="text-stone-900 dark:text-white">THIS TENANCY AGREEMENT</strong> is made on this 
            <span class="underline decoration-dotted">{{ formatDate(new Date().toISOString()) }}</span>
          </p>
        </section>

        <!-- Parties -->
        <section class="legal-section">
          <h3 class="legal-heading">BETWEEN</h3>
          
          <div class="space-y-4 text-sm">
            <p>
              <strong class="text-stone-900 dark:text-white">{{ details.landlord_name.toUpperCase() }}</strong>,
              holder of {{ details.landlord_id_type }} No. <span class="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">{{ details.landlord_id_number }}</span>,
              contactable at <span class="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">{{ details.landlord_phone }}</span>
              <br/>
              (hereinafter referred to as <strong>"THE LANDLORD"</strong>, which expression shall where the context so admits, include his/her heirs, executors, administrators and assigns)
            </p>
            
            <p class="text-center font-bold text-stone-900 dark:text-white">AND</p>
            
            <p>
              <strong class="text-stone-900 dark:text-white">{{ details.tenant_name.toUpperCase() }}</strong>,
              holder of {{ details.tenant_id_type }} No. <span class="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">{{ details.tenant_id_number }}</span>,
              contactable at <span class="font-mono bg-stone-100 dark:bg-stone-800 px-1 rounded">{{ details.tenant_phone }}</span>
              <br/>
              (hereinafter referred to as <strong>"THE TENANT"</strong>, which expression shall where the context so admits, include his/her heirs, executors, administrators and assigns)
            </p>
          </div>
        </section>

        <!-- Recitals -->
        <section class="legal-section">
          <h3 class="legal-heading">WHEREAS</h3>
          <ol class="list-alpha space-y-2 text-sm pl-6">
            <li>The Landlord is the owner and/or has the right to let the property described herein.</li>
            <li>The Tenant desires to rent the said property as a residential dwelling.</li>
            <li>Both parties have agreed to enter into this tenancy agreement on the terms and conditions set out below.</li>
          </ol>
        </section>

        <!-- Operative Part -->
        <section class="legal-section">
          <h3 class="legal-heading">NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:</h3>
        </section>

        <!-- Clause 1: The Premises -->
        <section class="legal-section">
          <h4 class="clause-heading">1. THE PREMISES</h4>
          <p class="text-sm">
            The Landlord hereby lets and the Tenant hereby takes as tenant the property known and described as:
          </p>
          <div class="my-4 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
            <p class="font-bold text-stone-900 dark:text-white">{{ details.property_address }}</p>
            <p class="text-sm text-stone-600 dark:text-stone-400 mt-1">
              Property Type: {{ details.property_type }}
              <span v-if="details.property_description"> • {{ details.property_description }}</span>
            </p>
          </div>
          <p class="text-sm">
            (hereinafter referred to as <strong>"THE PREMISES"</strong>)
          </p>
        </section>

        <!-- Clause 2: Term -->
        <section class="legal-section">
          <h4 class="clause-heading">2. TERM OF TENANCY</h4>
          <p class="text-sm">
            The tenancy shall be for a period of <strong class="text-emerald-600 dark:text-emerald-400">{{ details.lease_duration_months }} ({{ numberToWords(details.lease_duration_months) }}) months</strong>, 
            commencing on <strong class="text-emerald-600 dark:text-emerald-400">{{ formatDateFull(details.lease_start_date) }}</strong> 
            and expiring on <strong class="text-emerald-600 dark:text-emerald-400">{{ formatDateFull(calculateEndDate(details.lease_start_date, details.lease_duration_months)) }}</strong>,
            unless terminated earlier or renewed in accordance with the terms of this Agreement.
          </p>
        </section>

        <!-- Clause 3: Rent -->
        <section class="legal-section">
          <h4 class="clause-heading">3. RENT</h4>
          <div class="text-sm space-y-3">
            <p>
              3.1 The Tenant shall pay to the Landlord a rent of 
              <strong class="text-lg text-emerald-600 dark:text-emerald-400">{{ details.rent_currency }} {{ formatNumber(details.rent_amount) }}</strong>
              ({{ details.rent_currency }} {{ numberToWords(details.rent_amount) }}) 
              payable <strong>{{ details.payment_frequency }}</strong>.
            </p>
            <p>
              3.2 Rent shall be paid in advance on or before the {{ getOrdinal(1) }} day of each {{ getPaymentPeriod(details.payment_frequency) }}.
            </p>
            <p>
              3.3 All payments shall be made via mobile money, bank transfer, or any other method mutually agreed upon by both parties.
            </p>
          </div>
        </section>

        <!-- Clause 4: Security Deposit -->
        <section class="legal-section">
          <h4 class="clause-heading">4. SECURITY DEPOSIT</h4>
          <div class="text-sm space-y-3">
            <p>
              4.1 The Tenant shall pay a security deposit of 
              <strong class="text-lg text-blue-600 dark:text-blue-400">{{ details.rent_currency }} {{ formatNumber(details.security_deposit) }}</strong>
              ({{ details.rent_currency }} {{ numberToWords(details.security_deposit) }})
              upon execution of this Agreement.
            </p>
            <p>
              4.2 The security deposit shall be refunded to the Tenant within thirty (30) days of the termination of this Agreement, 
              subject to deductions for any unpaid rent, damages to the Premises beyond normal wear and tear, or other charges owed by the Tenant.
            </p>
          </div>
        </section>

        <!-- Clause 5: Utilities -->
        <section class="legal-section" v-if="details.utilities_included && details.utilities_included.length > 0">
          <h4 class="clause-heading">5. UTILITIES AND SERVICES</h4>
          <div class="text-sm space-y-3">
            <p>
              5.1 The following utilities and services are <strong>INCLUDED</strong> in the rent:
            </p>
            <div class="flex flex-wrap gap-2 my-3">
              <span 
                v-for="utility in details.utilities_included" 
                :key="utility"
                class="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800/30"
              >
                ✓ {{ utility }}
              </span>
            </div>
            <p>
              5.2 All other utilities not listed above shall be the responsibility of the Tenant.
            </p>
          </div>
        </section>

        <!-- Clause 6: Obligations -->
        <section class="legal-section">
          <h4 class="clause-heading">{{ details.utilities_included?.length > 0 ? '6' : '5' }}. TENANT'S OBLIGATIONS</h4>
          <div class="text-sm space-y-2">
            <p>The Tenant hereby covenants and agrees:</p>
            <ol class="list-alpha space-y-2 pl-6">
              <li>To pay rent promptly on the due date;</li>
              <li>To keep the Premises in good and clean condition;</li>
              <li>To use the Premises only for residential purposes;</li>
              <li>Not to assign, sublet, or part with possession of the Premises without prior written consent of the Landlord;</li>
              <li>Not to make any structural alterations to the Premises without the Landlord's written consent;</li>
              <li>To permit the Landlord or authorized agents to enter the Premises for inspection with reasonable notice;</li>
              <li>To comply with all applicable laws, regulations, and rules of the building or community.</li>
            </ol>
          </div>
        </section>

        <!-- Special Terms -->
        <section class="legal-section" v-if="details.special_terms">
          <h4 class="clause-heading">SPECIAL TERMS AND CONDITIONS</h4>
          <div class="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800/30">
            <p class="text-sm whitespace-pre-wrap">{{ details.special_terms }}</p>
          </div>
        </section>

        <!-- Clause: Governing Law -->
        <section class="legal-section">
          <h4 class="clause-heading">GOVERNING LAW</h4>
          <p class="text-sm">
            This Agreement shall be governed by and construed in accordance with the laws of the Republic of Ghana, 
            particularly the Rent Act, 1963 (Act 220) and any amendments thereto.
          </p>
        </section>

        <!-- Execution -->
        <section class="legal-section mt-12">
          <h3 class="legal-heading">IN WITNESS WHEREOF</h3>
          <p class="text-sm mb-8">
            The parties hereto have executed this Agreement on the day and year first above written.
          </p>

          <!-- Signature Blocks -->
          <div class="grid sm:grid-cols-2 gap-8 mt-8">
            <!-- Landlord Signature -->
            <div class="signature-block p-6 bg-stone-50 dark:bg-stone-800/30 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-600">
              <p class="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">The Landlord</p>
              <div class="space-y-6">
                <div>
                  <div class="h-16 border-b-2 border-stone-400 dark:border-stone-500 mb-1 flex items-end justify-center">
                    <span class="text-stone-300 dark:text-stone-600 text-sm">Sign here</span>
                  </div>
                  <p class="text-xs text-stone-500">Signature</p>
                </div>
                <div>
                  <p class="font-bold text-stone-900 dark:text-white">{{ details.landlord_name }}</p>
                  <p class="text-xs text-stone-500">Name (Print)</p>
                </div>
                <div>
                  <div class="h-8 border-b border-stone-300 dark:border-stone-600 mb-1"></div>
                  <p class="text-xs text-stone-500">Date</p>
                </div>
              </div>
            </div>

            <!-- Tenant Signature -->
            <div class="signature-block p-6 bg-stone-50 dark:bg-stone-800/30 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-600">
              <p class="text-xs font-black text-stone-400 uppercase tracking-widest mb-4">The Tenant</p>
              <div class="space-y-6">
                <div>
                  <div class="h-16 border-b-2 border-stone-400 dark:border-stone-500 mb-1 flex items-end justify-center">
                    <span class="text-stone-300 dark:text-stone-600 text-sm">Sign here</span>
                  </div>
                  <p class="text-xs text-stone-500">Signature</p>
                </div>
                <div>
                  <p class="font-bold text-stone-900 dark:text-white">{{ details.tenant_name }}</p>
                  <p class="text-xs text-stone-500">Name (Print)</p>
                </div>
                <div>
                  <div class="h-8 border-b border-stone-300 dark:border-stone-600 mb-1"></div>
                  <p class="text-xs text-stone-500">Date</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Witness Section -->
          <div class="mt-8 pt-8 border-t border-stone-200 dark:border-stone-700">
            <p class="text-xs font-black text-stone-400 uppercase tracking-widest mb-6">Witnesses (Optional)</p>
            <div class="grid sm:grid-cols-2 gap-8">
              <div class="witness-block">
                <p class="text-xs text-stone-500 mb-2">Witness for Landlord:</p>
                <div class="h-10 border-b border-stone-300 dark:border-stone-600 mb-1"></div>
                <div class="flex justify-between text-xs text-stone-400">
                  <span>Name & Signature</span>
                  <span>Date</span>
                </div>
              </div>
              <div class="witness-block">
                <p class="text-xs text-stone-500 mb-2">Witness for Tenant:</p>
                <div class="h-10 border-b border-stone-300 dark:border-stone-600 mb-1"></div>
                <div class="flex justify-between text-xs text-stone-400">
                  <span>Name & Signature</span>
                  <span>Date</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Document Footer -->
      <div class="p-4 bg-stone-100 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-700">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-shield-check" class="w-4 h-4 text-stone-400" />
            <span class="text-[10px] text-stone-400">Document generated by RentBase Protocol</span>
          </div>
          <span class="text-[10px] text-stone-400 font-mono">Draft ID: {{ generateDraftId() }}</span>
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

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateFull(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleDateString('en-GB', { month: 'long' })
  const year = date.getFullYear()
  return `${getOrdinal(day)} day of ${month}, ${year}`
}

function formatNumber(num: number): string {
  if (!num) return '0'
  return new Intl.NumberFormat('en-GH').format(num)
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function numberToWords(num: number): string {
  if (num === 0) return 'zero'
  
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
                'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
                'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const scales = ['', 'thousand', 'million', 'billion']
  
  function convertHundreds(n: number): string {
    let str = ''
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' hundred '
      n %= 100
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' '
      n %= 10
    }
    if (n > 0) {
      str += ones[n] + ' '
    }
    return str.trim()
  }
  
  if (num < 0) return 'negative ' + numberToWords(-num)
  if (num < 1000) return convertHundreds(num)
  
  let result = ''
  let scaleIndex = 0
  
  while (num > 0) {
    const chunk = num % 1000
    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk)
      result = chunkWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + result
    }
    num = Math.floor(num / 1000)
    scaleIndex++
  }
  
  return result.trim()
}

function calculateEndDate(startDate: string, months: number): string {
  if (!startDate) return ''
  const date = new Date(startDate)
  date.setMonth(date.getMonth() + months)
  return date.toISOString()
}

function getPaymentPeriod(frequency: string): string {
  switch (frequency) {
    case 'monthly': return 'month'
    case 'quarterly': return 'quarter'
    case 'yearly': return 'year'
    default: return 'period'
  }
}

function generateDraftId(): string {
  return 'RB-' + Date.now().toString(36).toUpperCase()
}
</script>

<style scoped>
.watermark-pattern {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 100px;
  transform: rotate(-35deg);
  opacity: 0.04;
}

.watermark-text {
  font-size: 80px;
  font-weight: 900;
  letter-spacing: 0.4em;
  color: currentColor;
  white-space: nowrap;
  animation: watermark-fade 3s ease-in-out infinite alternate;
}

@keyframes watermark-fade {
  0% { opacity: 0.3; }
  100% { opacity: 0.7; }
}

.dark .watermark-pattern {
  opacity: 0.06;
}

.legal-content {
  font-family: "Georgia", "Times New Roman", serif;
}

.legal-section {
  padding-bottom: 0.5rem;
}

.legal-heading {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1f2937;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.dark .legal-heading {
  color: #f9fafb;
  border-bottom-color: #374151;
}

.clause-heading {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.dark .clause-heading {
  color: #f9fafb;
}

.list-alpha {
  list-style-type: lower-alpha;
}

.signature-block {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.signature-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
}
</style>
