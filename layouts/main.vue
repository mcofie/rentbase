<template>
  <main class="my-10 max-w-3/4 mx-auto">
    <div class="bg-gray-100 rounded-xl w-full flex h-16">
      <UNavigationMenu color="primary" variant="pill" :items="items" class="w-full"/>
    </div>

    <slot/>

    <div class="bg-gray-100 rounded-xl w-full flex h-26 justify-center items-center">
      <small>&copy; 2025</small>
    </div>

  </main>
</template>
<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Home',
      icon: 'i-lucide-book-open',
      to: '/dashboard'
    },
    {
      label: 'Listings',
      icon: 'i-lucide-database',
      to: '/dashboard/listings'
    },
    {
      label: 'Applications',
      icon: 'i-lucide-box',
      to: '/dashboard/applications',
      active: true
    },
    {
      label: 'Money',
      icon: 'i-lucide-box',
      to: '/dashboard/money',
      active: true
    }
  ],
  [
    {
      label: 'Profile',
      icon: 'i-simple-icons-github',
      to: '/dashboard/profile'
    }
  ]
])
</script>

<style scoped>

</style>