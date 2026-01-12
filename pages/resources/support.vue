<template>
  <div class="max-w-3xl mx-auto px-6 py-24 animate-fade-in">
    <!-- Hero with Search -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center justify-center p-3 rounded-full bg-[#E6F3FE] mb-6">
        <UIcon name="i-lucide-help-circle" class="w-8 h-8 text-[#0075DE]" />
      </div>
      <h1 class="text-4xl sm:text-5xl font-bold text-[#050505] dark:text-white tracking-tight font-serif mb-4">How can we help?</h1>
      <p class="text-lg text-[#666666] mb-8">Search our knowledge base or get in touch with our team.</p>
      
      <div class="max-w-md mx-auto relative">
         <UIcon name="i-lucide-search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
         <input type="text" placeholder="Search for answers..." class="w-full pl-12 pr-4 py-3 bg-white dark:bg-stone-900 border border-[#E1E1E1] dark:border-stone-800 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] outline-none transition-all placeholder-[#999999]" />
      </div>
    </div>
    
    <!-- Contact Options Grid -->
    <div class="grid md:grid-cols-2 gap-6">
       <!-- Email Card -->
       <div class="p-8 rounded-xl border border-[#E1E1E1] dark:border-stone-800 hover:shadow-lg transition-shadow bg-white dark:bg-stone-900 group">
         <div class="w-10 h-10 bg-[#F7F7F5] dark:bg-stone-800 rounded-lg flex items-center justify-center mb-6 group-hover:text-[#0075DE] transition-colors">
            <UIcon name="i-lucide-mail" class="w-5 h-5" />
         </div>
         <h3 class="font-bold text-lg text-[#050505] dark:text-white mb-2">Email Support</h3>
         <p class="text-sm text-[#666666] mb-4">For general inquiries, account issues, and contract reviews.</p>
         <a href="mailto:support@rentbase.app" class="text-sm font-bold text-[#0075DE] hover:underline flex items-center gap-2">
           support@rentbase.app <UIcon name="i-lucide-arrow-up-right" class="w-3 h-3" />
         </a>
       </div>
       
       <!-- WhatsApp Card -->
       <div class="p-8 rounded-xl border border-[#E1E1E1] dark:border-stone-800 hover:shadow-lg transition-shadow bg-white dark:bg-stone-900 group">
         <div class="w-10 h-10 bg-[#F7F7F5] dark:bg-stone-800 rounded-lg flex items-center justify-center mb-6 group-hover:text-[#25D366] transition-colors">
            <UIcon name="i-lucide-message-circle" class="w-5 h-5" />
         </div>
         <h3 class="font-bold text-lg text-[#050505] dark:text-white mb-2">WhatsApp Chat</h3>
         <p class="text-sm text-[#666666] mb-4">Quick responses for urgent matters. Available Mon-Fri, 9am-5pm.</p>
         <a href="#" class="text-sm font-bold text-[#0075DE] hover:underline flex items-center gap-2">
           Start Chat <UIcon name="i-lucide-arrow-up-right" class="w-3 h-3" />
         </a>
       </div>
    </div>
    
    <!-- FAQ Section Callout -->
    <div class="mt-12 text-center p-8 bg-[#F7F7F5] dark:bg-stone-900 rounded-xl border border-[#E1E1E1] dark:border-stone-800">
      <h4 class="font-bold text-[#050505] dark:text-white mb-2">Looking for quick answers?</h4>
      <p class="text-sm text-[#666666] mb-6">Check out our frequently asked questions about contracts, deposits, and verification.</p>
      <NuxtLink to="/resources/guide" class="inline-flex items-center justify-center px-6 py-2 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-sm font-bold text-[#050505] dark:text-white hover:bg-[#F7F7F5] transition-colors shadow-sm">
        View FAQ Database
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
