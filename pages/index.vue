<template>
  <main class="my-10 max-w-3/4 mx-auto">
    <div class="buttons flex flex-row space-x-1 pb-5 justify-between">
      <div>
        <h3>RentBase</h3>
      </div>
      <div class="flex flex-row space-x-1">
        <NuxtLink to="/login">
          <UButton icon="i-lucide-rocket" size="md" color="primary" variant="solid">Login</UButton>
        </NuxtLink>
        <UButton icon="i-lucide-rocket" size="md" color="secondary" variant="solid">Register</UButton>
      </div>
    </div>

    <div class="jumbo bg-gray-100 rounded-3xl h-96"></div>

    <div class="grid grid-cols-3 my-5 spa gap-5 content-stretch">
      <div v-for="i in 6" class="w-full h-56 border-gray-200 border rounded-3xl "></div>
    </div>


    <div class="footer flex bg-gray-100 w-full rounded-3xl h-80">

    </div>


  </main>
</template>

<script setup>

const func = () => {

}

</script>

<style scoped>

</style>
