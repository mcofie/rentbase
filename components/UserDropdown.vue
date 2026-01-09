<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
    <button class="flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors border border-stone-200 dark:border-stone-700 shadow-sm">
      <div class="w-6 h-6 bg-stone-900 dark:bg-white rounded-lg flex items-center justify-center">
        <span class="text-[10px] text-white dark:text-stone-900 font-black">RB</span>
      </div>
      <span class="text-xs font-black text-stone-900 dark:text-white uppercase tracking-widest hidden sm:inline">{{ formattedPhone }}</span>
      <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-stone-400" />
    </button>

    <template #item="{ item }">
      <div class="flex items-center gap-3 w-full px-1 py-0.5">
        <UIcon :name="item.icon" class="w-4 h-4 text-stone-400 group-hover:text-emerald-500 transition-colors" />
        <span class="text-xs font-bold text-stone-600 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">{{ item.label }}</span>
      </div>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
import { formatPhoneDisplay } from '~/utils/formatPhone'

const { user, signOut } = useAuth()
const router = useRouter()
const toast = useToast()

const formattedPhone = computed(() => {
  if (!user.value?.phone) return '0XX XXX XXXX'
  return formatPhoneDisplay(user.value.phone)
})

const items = [
  [
    {
      label: 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      click: () => router.push('/dashboard')
    },
    {
      label: 'New Contract',
      icon: 'i-lucide-file-text',
      click: () => router.push('/contract/new')
    }
  ],
  [
    {
      label: 'Copy Number',
      icon: 'i-lucide-copy',
      click: () => {
        if (user.value?.phone) {
          navigator.clipboard.writeText(user.value.phone)
          toast.add({ title: 'Line Copied', color: 'success' })
        }
      }
    }
  ],
  [
    {
      label: 'Sign Out',
      icon: 'i-lucide-log-out',
      click: async () => {
        await signOut()
        router.push('/')
        toast.add({ title: 'Signed out', color: 'neutral' })
      }
    }
  ]
]
</script>
