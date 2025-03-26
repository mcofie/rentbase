<template>
  <div class="py-10 grid grid-cols-3 gap-4">
    <div class="bg-gray-100 rounded-2xl border border-gray-100 h-fit w-fit p-2" v-for="i in 10 ">
      <!--      <UCarousel v-slot="{ item }" dots :items="items" class="w-full max-w-xs mx-auto">-->
      <img :src="items[0]" width="320" height="320" class="">
      <!--      </UCarousel>-->
      <div class="flex flex-col">
        <h4 class="text-lg text-gray-950">The something is</h4>
        <p class="text-sm">Nothing says, “Thank you,” to a loved one like a day of relaxation and pampering.</p>
        <h4 class="font-bold">GHS 290</h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

const items = [
  'https://picsum.photos/640/640?random=1',
  'https://picsum.photos/640/640?random=2',
  'https://picsum.photos/640/640?random=3',
  'https://picsum.photos/640/640?random=4',
  'https://picsum.photos/640/640?random=5',
  'https://picsum.photos/640/640?random=6'
]

</script>
<style scoped>

</style>