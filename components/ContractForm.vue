<template>
  <form @submit.prevent="$emit('submit', formData)" class="space-y-6 sm:space-y-8">
    <!-- Section: Landlord Information -->
    <div class="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800 transition-colors">
      <h3 class="text-lg font-black mb-6 flex items-center gap-2 text-stone-900 dark:text-white uppercase tracking-tighter">
        <span class="text-2xl">🏠</span>
        Landlord
      </h3>
      
      <div class="grid sm:grid-cols-2 gap-4">
        <UFormField label="Full Name" required>
          <UInput v-model="formData.landlord_name" placeholder="Enter landlord's full name" size="lg" />
        </UFormField>
        
        <UFormField label="Phone Number" required>
          <UInput v-model="formData.landlord_phone" placeholder="024 XXX XXXX" type="tel" size="lg" />
        </UFormField>
      </div>
      
      <div class="grid sm:grid-cols-2 gap-4 mt-4">
        <UFormField label="ID Type" required>
          <USelect 
            v-model="formData.landlord_id_type" 
            :items="idTypes" 
            placeholder="Select ID type"
            size="lg"
          />
        </UFormField>
        
        <UFormField label="ID Number" required>
          <UInput v-model="formData.landlord_id_number" placeholder="Enter ID number" size="lg" />
        </UFormField>
      </div>
    </div>
    
    <!-- Section: Tenant Information -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
        <span class="text-2xl">👤</span>
        Tenant Information
      </h3>
      
      <div class="grid sm:grid-cols-2 gap-4">
        <UFormField label="Full Name" required>
          <UInput v-model="formData.tenant_name" placeholder="Enter tenant's full name" size="lg" />
        </UFormField>
        
        <UFormField label="Phone Number" required>
          <UInput v-model="formData.tenant_phone" placeholder="024 XXX XXXX" type="tel" size="lg" />
        </UFormField>
      </div>
      
      <div class="grid sm:grid-cols-2 gap-4 mt-4">
        <UFormField label="ID Type" required>
          <USelect 
            v-model="formData.tenant_id_type" 
            :items="idTypes" 
            placeholder="Select ID type"
            size="lg"
          />
        </UFormField>
        
        <UFormField label="ID Number" required>
          <UInput v-model="formData.tenant_id_number" placeholder="Enter ID number" size="lg" />
        </UFormField>
      </div>
    </div>
    
    <!-- Section: Property Details -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
        <span class="text-2xl">🏢</span>
        Property Details
      </h3>
      
      <div class="space-y-4">
        <UFormField label="Property Address" required>
          <UInput v-model="formData.property_address" placeholder="Enter full property address" size="lg" />
        </UFormField>
        
        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Property Type" required>
            <USelect 
              v-model="formData.property_type" 
              :items="propertyTypes" 
              placeholder="Select property type"
              size="lg"
            />
          </UFormField>
          
          <UFormField label="Number of Bedrooms">
            <UInputNumber v-model="roomCount" :min="0" size="lg" />
          </UFormField>
        </div>
        
        <UFormField label="Property Description">
          <UTextarea 
            v-model="formData.property_description" 
            placeholder="Describe the property (rooms, amenities, etc.)"
            :rows="3"
            size="lg"
          />
        </UFormField>
      </div>
    </div>
    
    <!-- Section: Rental Terms -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
        <span class="text-2xl">💰</span>
        Rental Terms
      </h3>
      
      <div class="grid sm:grid-cols-2 gap-4">
        <UFormField label="Rent Amount" required>
          <div class="flex gap-2">
            <USelect 
              v-model="formData.rent_currency" 
              :items="currencies" 
              class="w-24"
              size="lg"
            />
            <UInputNumber 
              v-model="formData.rent_amount" 
              :min="0" 
              placeholder="0.00"
              class="flex-1"
              size="lg"
            />
          </div>
        </UFormField>
        
        <UFormField label="Payment Frequency" required>
          <USelect 
            v-model="formData.payment_frequency" 
            :items="paymentFrequencies" 
            size="lg"
          />
        </UFormField>
      </div>
      
      <div class="grid sm:grid-cols-2 gap-4 mt-4">
        <UFormField label="Security Deposit" required>
          <UInputNumber 
            v-model="formData.security_deposit" 
            :min="0" 
            placeholder="0.00"
            size="lg"
          />
        </UFormField>
        
        <UFormField label="Lease Start Date" required>
          <UInput 
            v-model="formData.lease_start_date" 
            type="date"
            size="lg"
          />
        </UFormField>
      </div>
      
      <div class="mt-4">
        <UFormField label="Lease Duration (Months)" required>
          <UInputNumber 
            v-model="formData.lease_duration_months" 
            :min="1" 
            :max="120"
            size="lg"
          />
        </UFormField>
      </div>
    </div>
    
    <!-- Section: Utilities -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
        <span class="text-2xl">⚡</span>
        Utilities Included
      </h3>
      
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <UCheckbox 
          v-for="utility in allUtilities" 
          :key="utility"
          :label="utility"
          :model-value="formData.utilities_included.includes(utility)"
          @update:model-value="toggleUtility(utility)"
        />
      </div>
    </div>
    
    <!-- Section: Special Terms -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
        <span class="text-2xl">📝</span>
        Special Terms & Conditions
      </h3>
      
      <UFormField label="Additional terms (optional)">
        <UTextarea 
          v-model="formData.special_terms" 
          placeholder="Enter any additional terms, rules, or agreements..."
          :rows="4"
          size="lg"
        />
      </UFormField>
    </div>
    
    <!-- Submit Button -->
    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4">
      <UButton
        type="button"
        variant="ghost"
        color="neutral"
        size="lg"
        class="order-2 sm:order-1"
        @click="$emit('cancel')"
      >
        Cancel
      </UButton>
      <UButton
        type="submit"
        size="lg"
        :loading="loading"
        icon="i-lucide-eye"
        class="order-1 sm:order-2"
      >
        Preview Agreement
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { ContractDetails } from '~/types'

const props = defineProps<{
  loading?: boolean
  initialData?: ContractDetails | null
}>()

defineEmits<{
  'submit': [data: ContractDetails]
  'cancel': []
}>()

const idTypes = ['Ghana Card', 'Passport', 'Voter ID', 'Driver License']
const propertyTypes = ['Apartment', 'House', 'Studio', 'Chamber & Hall', 'Single Room', 'Townhouse']
const currencies = ['GHS', 'USD']
const paymentFrequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]
const allUtilities = ['Water', 'Electricity', 'Internet', 'Gas', 'Security', 'Trash Collection', 'Parking']

const roomCount = ref(1)

// Initialize with provided data or defaults
const formData = reactive<ContractDetails>({
  landlord_name: props.initialData?.landlord_name || '',
  landlord_phone: props.initialData?.landlord_phone || '',
  landlord_id_type: props.initialData?.landlord_id_type || '',
  landlord_id_number: props.initialData?.landlord_id_number || '',
  tenant_name: props.initialData?.tenant_name || '',
  tenant_phone: props.initialData?.tenant_phone || '',
  tenant_id_type: props.initialData?.tenant_id_type || '',
  tenant_id_number: props.initialData?.tenant_id_number || '',
  property_address: props.initialData?.property_address || '',
  property_type: props.initialData?.property_type || '',
  property_description: props.initialData?.property_description || '',
  rent_amount: props.initialData?.rent_amount || 0,
  rent_currency: props.initialData?.rent_currency || 'GHS',
  payment_frequency: props.initialData?.payment_frequency || 'monthly',
  security_deposit: props.initialData?.security_deposit || 0,
  lease_start_date: props.initialData?.lease_start_date || '',
  lease_duration_months: props.initialData?.lease_duration_months || 12,
  utilities_included: props.initialData?.utilities_included || [],
  special_terms: props.initialData?.special_terms || '',
})

// Watch for changes to initialData and update form
watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(formData, newData)
  }
}, { deep: true })

function toggleUtility(utility: string) {
  const index = formData.utilities_included.indexOf(utility)
  if (index === -1) {
    formData.utilities_included.push(utility)
  } else {
    formData.utilities_included.splice(index, 1)
  }
}
</script>

