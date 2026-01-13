<template>
  <form @submit.prevent="$emit('submit', formData)" class="space-y-6 sm:space-y-8">
    <!-- Section: Landlord Information -->
    <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 transition-colors shadow-sm">
      <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div class="w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-white">
           <UIcon name="i-lucide-home" class="w-4 h-4" />
        </div>
        <h3 class="text-lg font-bold text-stone-900 dark:text-white font-serif">Landlord Details</h3>
      </div>
      
      <div class="grid sm:grid-cols-2 gap-4">
        <UFormField label="Full Name" required>
          <UInput v-model="formData.landlord_name" placeholder="Enter landlord's full name" size="lg" class="input-minimal" />
        </UFormField>
        
        <UFormField label="Phone Number" required>
          <UInput v-model="formData.landlord_phone" placeholder="024 XXX XXXX" type="tel" size="lg" class="input-minimal" />
        </UFormField>
      </div>
      
      <div class="grid sm:grid-cols-2 gap-4 mt-4">
        <UFormField label="ID Type" required>
          <USelect 
            v-model="formData.landlord_id_type" 
            :items="idTypes" 
            placeholder="Select ID type"
            size="lg"
            class="input-minimal"
          />
        </UFormField>
        
        <UFormField label="ID Number" required>
          <UInput v-model="formData.landlord_id_number" placeholder="Enter ID number" size="lg" class="input-minimal" />
        </UFormField>
      </div>
    </div>
    
    <!-- Section: Tenant Information -->
    <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 transition-colors shadow-sm">
      <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div class="w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-white">
           <UIcon name="i-lucide-user" class="w-4 h-4" />
        </div>
        <h3 class="text-lg font-bold text-stone-900 dark:text-white font-serif">Tenant Details</h3>
      </div>
      
      <div class="grid sm:grid-cols-2 gap-4">
        <UFormField label="Full Name" required>
          <UInput v-model="formData.tenant_name" placeholder="Enter tenant's full name" size="lg" class="input-minimal" />
        </UFormField>
        
        <UFormField label="Phone Number" required>
          <UInput v-model="formData.tenant_phone" placeholder="024 XXX XXXX" type="tel" size="lg" class="input-minimal" />
        </UFormField>
      </div>

      <div class="mt-4">
        <UFormField label="Email Address">
          <UInput v-model="formData.tenant_email" placeholder="tenant@example.com" type="email" size="lg" class="input-minimal" />
          <template #hint>
            <span class="text-xs text-stone-400">Optional - For sending signing link via email</span>
          </template>
        </UFormField>
      </div>
      
      <div class="grid sm:grid-cols-2 gap-4 mt-4">
        <UFormField label="ID Type" required>
          <USelect 
            v-model="formData.tenant_id_type" 
            :items="idTypes" 
            placeholder="Select ID type"
            size="lg"
            class="input-minimal"
          />
        </UFormField>
        
        <UFormField label="ID Number" required>
          <UInput v-model="formData.tenant_id_number" placeholder="Enter ID number" size="lg" class="input-minimal" />
        </UFormField>
      </div>
    </div>
    
    <!-- Section: Property Details -->
    <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 transition-colors shadow-sm">
      <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div class="w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-white">
           <UIcon name="i-lucide-building-2" class="w-4 h-4" />
        </div>
        <h3 class="text-lg font-bold text-stone-900 dark:text-white font-serif">Property Details</h3>
      </div>
      
      <div class="space-y-4">
        <UFormField label="Property Address" required>
          <UInput v-model="formData.property_address" placeholder="Enter full property address" size="lg" class="input-minimal" />
        </UFormField>
        
        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField label="Property Type" required>
            <USelect 
              v-model="formData.property_type" 
              :items="propertyTypes" 
              placeholder="Select property type"
              size="lg"
              class="input-minimal"
            />
          </UFormField>
          
          <UFormField label="Number of Bedrooms">
            <UInputNumber v-model="roomCount" :min="0" size="lg" class="input-minimal" />
          </UFormField>
        </div>
        
        <UFormField label="Property Description">
          <UTextarea 
            v-model="formData.property_description" 
            placeholder="Describe the property (rooms, amenities, etc.)"
            :rows="3"
            size="lg"
            class="input-minimal"
          />
        </UFormField>
      </div>
    </div>
    
    <!-- Section: Rental Terms -->
    <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 transition-colors shadow-sm">
      <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div class="w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-white">
           <UIcon name="i-lucide-banknote" class="w-4 h-4" />
        </div>
        <h3 class="text-lg font-bold text-stone-900 dark:text-white font-serif">Rental Terms</h3>
      </div>
      
      <div class="grid sm:grid-cols-2 gap-4">
        <UFormField label="Rent Amount" required>
          <div class="flex gap-2">
            <USelect 
              v-model="formData.rent_currency" 
              :items="currencies" 
              class="w-24 input-minimal"
              size="lg"
            />
            <UInputNumber 
              v-model="formData.rent_amount" 
              :min="0" 
              placeholder="0.00"
              class="flex-1 input-minimal"
              size="lg"
            />
          </div>
        </UFormField>
        
        <UFormField label="Payment Frequency" required>
          <USelect 
            v-model="formData.payment_frequency" 
            :items="paymentFrequencies" 
            size="lg"
            class="input-minimal"
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
            class="input-minimal"
          />
        </UFormField>
        
        <UFormField label="Lease Start Date" required>
          <DatePicker 
            v-model="formData.lease_start_date"
            placeholder="Select start date"
            :allow-past="false"
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
            class="input-minimal"
          />
        </UFormField>
      </div>
    </div>
    
    <!-- Section: Utilities -->
    <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 transition-colors shadow-sm">
      <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div class="w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-white">
           <UIcon name="i-lucide-plug" class="w-4 h-4" />
        </div>
        <h3 class="text-lg font-bold text-stone-900 dark:text-white font-serif">Utilities Included</h3>
      </div>
      
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
    <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 transition-colors shadow-sm">
      <div class="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div class="w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-white">
           <UIcon name="i-lucide-scroll" class="w-4 h-4" />
        </div>
        <h3 class="text-lg font-bold text-stone-900 dark:text-white font-serif">Special Terms & Conditions</h3>
      </div>
      
      <UFormField label="Additional terms (optional)">
        <UTextarea 
          v-model="formData.special_terms" 
          placeholder="Enter any additional terms, rules, or agreements..."
          :rows="4"
          size="lg"
          class="input-minimal"
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
  tenant_email: props.initialData?.tenant_email || '',
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

