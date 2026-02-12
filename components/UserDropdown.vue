<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
    <button class="flex items-center gap-2 group px-3 py-2 bg-white dark:bg-stone-900/50 rounded-xl hover:bg-notion-gray dark:hover:bg-stone-800 transition-all border border-notion-border/50 dark:border-stone-800/50 hover:border-notion-blue shadow-sm active:scale-95">
      <div class="relative">
        <div class="w-8 h-8 bg-notion-text dark:bg-white rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform">
          <span class="text-[10px] text-white dark:text-notion-text font-black">RB</span>
        </div>
        <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full"></div>
      </div>
      <div class="flex flex-col items-start pr-1 hidden sm:flex">
        <span class="text-[10px] font-black text-notion-text dark:text-white uppercase tracking-tighter leading-none mb-0.5">{{ formattedPhone }}</span>
        <span class="text-[8px] font-bold text-notion-text-secondary dark:text-stone-500 uppercase tracking-widest leading-none">{{ profile?.role || 'User' }}</span>
      </div>
      <UIcon name="i-lucide-chevron-down" class="w-3.5 h-3.5 text-notion-border group-hover:text-notion-blue transition-colors" />
    </button>

    <template #item="{ item }">
      <div class="flex items-center gap-3 w-full px-2 py-1.5 transition-colors group">
        <UIcon :name="item.icon" class="w-4 h-4 text-notion-text-secondary group-hover:text-notion-blue transition-colors" />
        <span class="text-[11px] font-black text-notion-text dark:text-stone-300 uppercase tracking-widest group-hover:text-notion-blue transition-colors">{{ item.label }}</span>
      </div>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
import { formatPhoneDisplay } from '~/utils/formatPhone'

const { user, profile, signOut } = useAuth()
const router = useRouter()
const toast = useToast()

const formattedPhone = computed(() => {
  if (!user.value?.phone) return '0XX XXX XXXX'
  return formatPhoneDisplay(user.value.phone)
})

const items = computed(() => [
  [
    {
      label: profile.value?.role === 'admin' ? 'Admin Portal' : 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      click: () => router.push(profile.value?.role === 'admin' ? '/admin' : '/dashboard')
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
])
</script>
