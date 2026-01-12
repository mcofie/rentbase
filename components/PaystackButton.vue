<template>
  <UButton
    :loading="loading"
    :disabled="disabled"
    size="lg"
    block
    class="rounded-lg font-medium bg-[#0075DE] text-white border-0 transition-all duration-200 hover:bg-[#005BAB] active:scale-[0.99]"
    @click="handlePayment"
  >
    <template #leading>
      <UIcon name="i-lucide-credit-card" class="w-5 h-5" />
    </template>
    <slot>
      Pay GH₵ {{ amount }}
    </slot>
  </UButton>
</template>

<script setup lang="ts">
import type { FeatureType } from '~/types'

const props = defineProps<{
  featureType: FeatureType
  email: string
  itemId: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'success': [reference: string]
  'close': []
}>()

const { loading, error, payForContract, payForDepositReport, PRICING } = usePaystack()

const amount = computed(() => {
  return props.featureType === 'contract' 
    ? PRICING.CONTRACT.amount 
    : PRICING.DEPOSIT_REPORT.amount
})

const toast = useToast()

watch(error, (newError) => {
  if (newError) {
    console.error('PaystackButton Error:', newError)
    toast.add({
      title: 'Payment Failed',
      description: newError,
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
})

async function handlePayment() {
  if (props.featureType === 'contract') {
    await payForContract(
      props.email,
      props.itemId,
      (reference) => emit('success', reference),
      () => emit('close')
    )
  } else {
    await payForDepositReport(
      props.email,
      props.itemId,
      (reference) => emit('success', reference),
      () => emit('close')
    )
  }
}
</script>
