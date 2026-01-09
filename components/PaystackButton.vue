<template>
  <UButton
    :loading="loading"
    :disabled="disabled"
    size="lg"
    class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
    @click="handlePayment"
  >
    <template #leading>
      <span class="text-lg">💳</span>
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
