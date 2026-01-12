<template>
  <div class="max-w-6xl mx-auto px-6 py-24 animate-fade-in">
    <div class="grid md:grid-cols-12 gap-12">
      <!-- Sidebar Navigation -->
      <div class="hidden md:block md:col-span-3">
         <div class="sticky top-24 space-y-1">
           <h4 class="text-[10px] font-bold text-[#999999] uppercase tracking-widest mb-4">Contents</h4>
           <a href="#acceptance" class="block text-sm text-[#050505] dark:text-white font-medium hover:text-[#0075DE] transition-colors py-1">1. Acceptance</a>
           <a href="#services" class="block text-sm text-[#666666] hover:text-[#050505] dark:hover:text-white transition-colors py-1">2. Services</a>
           <a href="#responsibilities" class="block text-sm text-[#666666] hover:text-[#050505] dark:hover:text-white transition-colors py-1">3. Responsibilities</a>
           <a href="#liability" class="block text-sm text-[#666666] hover:text-[#050505] dark:hover:text-white transition-colors py-1">4. Liability</a>
         </div>
      </div>
      
      <!-- Content -->
      <div class="col-span-12 md:col-span-9">
        <div class="mb-12 border-b border-[#E1E1E1] dark:border-stone-800 pb-8">
          <p class="text-[10px] font-bold text-[#0075DE] uppercase tracking-widest mb-4">Terms of Use</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-[#050505] dark:text-white tracking-tight font-serif mb-6">Terms of Service</h1>
          <p class="text-[#666666]">Last updated: January 12, 2026</p>
        </div>
        
        <div class="prose prose-stone dark:prose-invert max-w-none">
           <p class="lead text-xl text-[#050505] dark:text-white leading-relaxed mb-12">
             These Terms of Service govern your use of RentBase. By accessing or using our platform, you agree to be bound by these terms.
           </p>
           
           <h3 id="acceptance" class="text-2xl font-bold text-[#050505] dark:text-white mt-12 mb-6 scroll-mt-24">1. Acceptance of Terms</h3>
           <p class="text-[#666666] leading-relaxed mb-8">By assessing or using our services, you confirm that you can form a binding contract with RentBase, and that you accept these Terms and all applicable laws.</p>

           <h3 id="services" class="text-2xl font-bold text-[#050505] dark:text-white mt-12 mb-6 scroll-mt-24">2. Services Provided</h3>
           <p class="text-[#666666] leading-relaxed mb-8">RentBase provides tools for rental verification, contract generation, and deposit management. We are not a real estate agency or a law firm. The documents generated are templates and should be reviewed by legal counsel if necessary.</p>

           <h3 id="responsibilities" class="text-2xl font-bold text-[#050505] dark:text-white mt-12 mb-6 scroll-mt-24">3. User Responsibilities</h3>
           <p class="text-[#666666] leading-relaxed mb-8">You agree to provide accurate, current, and complete information during the registration and verification process. You are responsible for safeguarding your account access codes.</p>
           
           <h3 id="liability" class="text-2xl font-bold text-[#050505] dark:text-white mt-12 mb-6 scroll-mt-24">4. Limitation of Liability</h3>
           <div class="bg-[#F7F7F5] dark:bg-stone-900 border border-[#E1E1E1] dark:border-stone-800 p-6 rounded-lg">
             <p class="text-[#666666] italic">RentBase shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
