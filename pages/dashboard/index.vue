<template>
  <div class="flex space-x-3 my-4">
    <div class="w-1/3 bg-gray-50 border border-gray-100 rounded-xl h-56 flex flex-col items-center justify-center" v-for="i in 3">
      <h1 class="text-8xl font-extrabold">{{ i }}</h1>
      <small>Something Data</small>
    </div>
  </div>

  <div class="bg-gray-50 border-gray-100  rounded-xl">
    <UTable :data="data" :columns="columns" class="flex-1"/>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import {h, resolveComponent} from 'vue'
import type {TableColumn} from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')

type Payment = {
  id: string
  date: string
  status: 'paid' | 'failed' | 'refunded'
  email: string
  amount: number
}

const data = ref<Payment[]>([
  {
    id: '4600',
    date: '2024-03-11T15:30:00',
    status: 'paid',
    email: 'james.anderson@example.com',
    amount: 594
  },
  {
    id: '4599',
    date: '2024-03-11T10:10:00',
    status: 'failed',
    email: 'mia.white@example.com',
    amount: 276
  },
  {
    id: '4598',
    date: '2024-03-11T08:50:00',
    status: 'refunded',
    email: 'william.brown@example.com',
    amount: 315
  },
  {
    id: '4597',
    date: '2024-03-10T19:45:00',
    status: 'paid',
    email: 'emma.davis@example.com',
    amount: 529
  },
  {
    id: '4596',
    date: '2024-03-10T15:55:00',
    status: 'paid',
    email: 'ethan.harris@example.com',
    amount: 639
  }
])

const columns: TableColumn<Payment>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({row}) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({row}) => {
      return new Date(row.getValue('date')).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => {
      const color = {
        paid: 'success' as const,
        failed: 'error' as const,
        refunded: 'neutral' as const
      }[row.getValue('status') as string]

      return h(UBadge, {class: 'capitalize', variant: 'subtle', color}, () =>
          row.getValue('status')
      )
    }
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'amount',
    header: () => h('div', {class: 'text-right'}, 'Amount'),
    cell: ({row}) => {
      const amount = Number.parseFloat(row.getValue('amount'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)

      return h('div', {class: 'text-right font-medium'}, formatted)
    }
  }
]

</script>

<style scoped>

</style>