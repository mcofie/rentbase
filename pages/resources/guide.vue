<template>
  <div class="max-w-4xl mx-auto px-6 py-24 animate-fade-in">
    <!-- Notion Header -->
    <div class="mb-16 group">
      <div class="h-24 w-24 bg-gradient-to-br from-[#F7F7F5] to-[#E1E1E1] rounded-xl flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
        📚
      </div>
      <h1 class="text-4xl sm:text-5xl font-bold text-[#050505] dark:text-white tracking-tight font-serif mb-4">User Guide</h1>
      <p class="text-lg text-[#666666] max-w-2xl">Master the RentBase protocol. Learn how to verify agents, secure deposits, and manage your rental portfolio.</p>
    </div>

    <!-- Quick Start Grids -->
    <div class="grid md:grid-cols-2 gap-6 mb-16">
      <div class="p-6 rounded-xl border border-[#E1E1E1] dark:border-stone-800 hover:bg-[#F7F7F5] dark:hover:bg-stone-900 transition-colors cursor-pointer group">
        <div class="flex items-center gap-3 mb-3">
          <UIcon name="i-lucide-play-circle" class="w-5 h-5 text-[#0075DE]" />
          <h3 class="font-bold text-[#050505] dark:text-white">Quick Start</h3>
        </div>
        <p class="text-sm text-[#666666] mb-4">Set up your account and verify your identity in under 5 minutes.</p>
        <div class="flex items-center gap-2 text-xs font-bold text-[#999999] uppercase tracking-widest group-hover:text-[#0075DE] transition-colors">
          <span>Start Tutorial</span>
          <UIcon name="i-lucide-arrow-right" class="w-3 h-3" />
        </div>
      </div>

      <div class="p-6 rounded-xl border border-[#E1E1E1] dark:border-stone-800 hover:bg-[#F7F7F5] dark:hover:bg-stone-900 transition-colors cursor-pointer group">
        <div class="flex items-center gap-3 mb-3">
          <UIcon name="i-lucide-shield" class="w-5 h-5 text-[#0075DE]" />
          <h3 class="font-bold text-[#050505] dark:text-white">Safety First</h3>
        </div>
        <p class="text-sm text-[#666666] mb-4">How to spot red flags and avoid rental scams in Accra.</p>
        <div class="flex items-center gap-2 text-xs font-bold text-[#999999] uppercase tracking-widest group-hover:text-[#0075DE] transition-colors">
          <span>Read Guide</span>
          <UIcon name="i-lucide-arrow-right" class="w-3 h-3" />
        </div>
      </div>
    </div>

    <!-- Notion Callout Block -->
    <div class="bg-[#F7F7F5] dark:bg-stone-900 rounded-lg p-6 flex gap-4 border border-[#E1E1E1] dark:border-stone-800 mb-16">
      <span class="text-2xl">💡</span>
      <div>
        <h4 class="font-bold text-[#050505] dark:text-white mb-1">Pro Tip: Use the Condition Report</h4>
        <p class="text-sm text-[#666666]">Taking photos before you move in is the #1 way to ensure you get your deposit back. Use our tool to timestamp and archive them.</p>
      </div>
    </div>

    <!-- Core Documentation List -->
    <div>
      <h3 class="font-bold text-[#999999] uppercase tracking-widest text-xs mb-6 px-1">Core Documentation</h3>
      <div class="space-y-1">
        <div v-for="item in docs" :key="item" class="flex items-center gap-3 p-3 hover:bg-[#F7F7F5] dark:hover:bg-stone-900 rounded-lg cursor-pointer transition-colors group">
          <UIcon name="i-lucide-file-text" class="w-4 h-4 text-[#999999] group-hover:text-[#050505]" />
          <span class="text-[#050505] dark:text-white border-b border-transparent group-hover:border-[#050505] pb-0.5 transition-all">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const docs = [
  'How to Verify an Agent Phone Number',
  'Understanding the Standard Tenancy Agreement',
  'Process for Recovering a Security Deposit',
  'Reporting Suspicious Activity',
  'Exporting Your Rental History'
]

definePageMeta({
  title: 'User Guide'
})
</script>
