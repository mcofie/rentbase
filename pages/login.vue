<template>
  <main class="my-10 max-w-3/4 mx-auto">
    <div class="flex justify-center">

      <div class="w-1/3  bg-gray-100 rounded-3xl flex flex-col py-16 space-y-5 text-center items-center">
        <h1 class="font-extrabold text-3xl">RentBase</h1>
        <UInput size="xl" placeholder="Phone number"/>
        <UPinInput color="neutral" highlight placeholder="○"/>
        <NuxtLink to="/dashboard/">
          <UButton size="xl" block>Login</UButton>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">

</script>

<style scoped>

</style>