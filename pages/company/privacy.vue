<template>
  <div class="max-w-6xl mx-auto px-6 py-24 animate-fade-in">
    <div class="grid md:grid-cols-12 gap-12">
      <!-- Sidebar Navigation -->
      <div class="hidden md:block md:col-span-3">
         <div class="sticky top-24 space-y-1">
           <h4 class="text-[10px] font-bold text-[#999999] uppercase tracking-widest mb-4">Contents</h4>
           <a href="#collection" class="block text-sm text-[#050505] dark:text-white font-medium hover:text-[#0075DE] transition-colors py-1">1. Information Collection</a>
           <a href="#usage" class="block text-sm text-[#666666] hover:text-[#050505] dark:hover:text-white transition-colors py-1">2. Data Usage</a>
           <a href="#protection" class="block text-sm text-[#666666] hover:text-[#050505] dark:hover:text-white transition-colors py-1">3. Data Protection</a>
           <a href="#contact" class="block text-sm text-[#666666] hover:text-[#050505] dark:hover:text-white transition-colors py-1">4. Contact Us</a>
         </div>
      </div>
      
      <!-- Content -->
      <div class="col-span-12 md:col-span-9">
        <div class="mb-12 border-b border-[#E1E1E1] dark:border-stone-800 pb-8">
          <p class="text-[10px] font-bold text-[#0075DE] uppercase tracking-widest mb-4">Legal Protocol</p>
          <h1 class="text-4xl sm:text-5xl font-bold text-[#050505] dark:text-white tracking-tight font-serif mb-6">Privacy Policy</h1>
          <p class="text-[#666666]">Last updated: January 12, 2026</p>
        </div>
        
        <div class="prose prose-stone dark:prose-invert max-w-none">
           <p class="lead text-xl text-[#050505] dark:text-white leading-relaxed mb-12">
             At RentBase, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our services.
           </p>
           
           <h3 id="collection" class="text-2xl font-bold text-[#050505] dark:text-white mt-12 mb-6 scroll-mt-24">1. Information We Collect</h3>
           <p class="text-[#666666] leading-relaxed mb-4">We collect information you provide directly to us, such as when you create an account, generate a contract, or submit an agent review. This may include:</p>
           <ul class="list-disc pl-5 space-y-2 text-[#666666] mb-8">
             <li>Name and contact information (phone number, email)</li>
             <li>Identity verification documents (Ghana Card)</li>
             <li>Property details and transaction history</li>
           </ul>

           <h3 id="usage" class="text-2xl font-bold text-[#050505] dark:text-white mt-12 mb-6 scroll-mt-24">2. How We Use Your Information</h3>
           <p class="text-[#666666] leading-relaxed mb-4">We use your information to:</p>
           <ul class="list-disc pl-5 space-y-2 text-[#666666] mb-8">
             <li>Facilitate rental agreements and transactions</li>
             <li>Verify the identity of agents and landlords</li>
             <li>Improve our platform and prevent fraud</li>
             <li>Comply with legal obligations</li>
           </ul>

           <h3 id="protection" class="text-2xl font-bold text-[#050505] dark:text-white mt-12 mb-6 scroll-mt-24">3. Data Protection</h3>
           <p class="text-[#666666] leading-relaxed mb-8">We implement robust security measures to protect your data. All sensitive documents (contracts, IDs) are encrypted at rest and in transit.</p>
           
           <h3 id="contact" class="text-2xl font-bold text-[#050505] dark:text-white mt-12 mb-6 scroll-mt-24">4. Contact Us</h3>
           <div class="bg-[#F7F7F5] dark:bg-stone-900 border border-[#E1E1E1] dark:border-stone-800 p-6 rounded-lg">
             <p class="text-[#666666] mb-2">If you have any questions about this Privacy Policy, please contact us at:</p>
             <a href="mailto:privacy@rentbase.app" class="text-[#0075DE] font-bold hover:underline">privacy@rentbase.app</a>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
