<template>
  <div class="deposit-preview">
    <!-- Animated Draft Watermarks -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div 
        v-for="i in 5" 
        :key="i"
        class="absolute text-[100px] font-black text-stone-950/[0.02] dark:text-white/[0.02] select-none whitespace-nowrap rotate-[-20deg] animate-watermark"
        :style="{
          top: `${(i - 1) * 20}%`,
          left: `-10%`,
          animationDelay: `${i * 0.5}s`
        }"
      >
        DRAFT • PREVIEW • DRAFT • PREVIEW • DRAFT • PREVIEW
      </div>
    </div>
    
    <div class="relative z-10 space-y-6">
      <!-- Report Header -->
      <div class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800 overflow-hidden relative">
        <!-- DRAFT Badge -->
        <div class="absolute top-4 right-4">
          <span class="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-bold uppercase tracking-widest rounded-md border border-stone-200 dark:border-stone-700">
            Draft Preview
          </span>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-[#0075DE] to-[#005BAB] rounded-lg flex items-center justify-center shadow-sm">
            <UIcon name="i-lucide-shield-check" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-stone-900 dark:text-white tracking-tight">Property Condition Report</h3>
            <p class="text-xs text-stone-500 font-medium">Deposit Shield - Move-In Snapshot</p>
          </div>
        </div>

        <!-- Report Info -->
        <div class="grid sm:grid-cols-3 gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div class="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-100 dark:border-stone-800">
            <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Report ID</p>
            <p class="font-mono text-xs text-stone-700 dark:text-stone-300 truncate">{{ reportId.slice(0, 8) }}...</p>
          </div>
          <div class="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-100 dark:border-stone-800">
            <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Photos</p>
            <p class="font-bold text-sm text-stone-900 dark:text-white">{{ photos.length }} documented</p>
          </div>
          <div class="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-100 dark:border-stone-800">
            <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Date</p>
            <p class="font-bold text-sm text-stone-900 dark:text-white">{{ formatDate(new Date().toISOString()) }}</p>
          </div>
        </div>

        <!-- Property Address (if provided) -->
        <div v-if="propertyAddress" class="pt-6">
          <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Property Address</p>
          <p class="font-bold text-stone-900 dark:text-white">{{ propertyAddress }}</p>
        </div>
      </div>

      <!-- Photos Grid -->
      <div class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800">
        <div class="flex items-center justify-between mb-6">
          <h4 class="text-base font-bold text-stone-900 dark:text-white tracking-tight">Documented Conditions</h4>
          <span class="text-xs text-stone-400">{{ photos.length }} photos</span>
        </div>

        <div v-if="photos.length === 0" class="text-center py-12">
          <UIcon name="i-lucide-image-off" class="w-10 h-10 text-stone-300 mx-auto mb-4" />
          <p class="text-sm text-stone-400">No photos uploaded yet</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div 
            v-for="(photo, index) in photos" 
            :key="index"
            class="group relative rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
          >
            <img 
              :src="photo.url" 
              :alt="`Photo ${index + 1}`"
              class="w-full h-32 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <div>
                <span class="text-white text-xs font-bold">Photo {{ index + 1 }}</span>
                <p v-if="photo.description" class="text-white/80 text-[10px] truncate">{{ photo.description }}</p>
              </div>
            </div>
            <!-- Photo number badge -->
            <div class="absolute top-2 left-2 w-5 h-5 bg-black/50 backdrop-blur-sm rounded-md flex items-center justify-center">
              <span class="text-white text-[9px] font-bold">{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Retention Info Card -->
      <div class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-lg flex items-center justify-center border border-stone-100 dark:border-stone-700">
            <UIcon name="i-lucide-database" class="w-5 h-5 text-stone-900 dark:text-white" />
          </div>
          <div>
            <h4 class="text-base font-bold text-stone-900 dark:text-white">Data Retention & Access</h4>
            <p class="text-stone-500 text-xs">Your photos are securely stored</p>
          </div>
        </div>

        <div class="space-y-3">
          <!-- Storage Duration -->
          <div class="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-950/30 rounded-lg border border-stone-100 dark:border-stone-800">
            <div class="w-8 h-8 bg-white dark:bg-stone-800 rounded-md flex items-center justify-center flex-shrink-0 border border-stone-200 dark:border-stone-700">
              <UIcon name="i-lucide-calendar" class="w-4 h-4 text-[#0075DE]" />
            </div>
            <div>
              <h5 class="font-bold text-sm text-stone-900 dark:text-white mb-0.5">2 Years Storage</h5>
              <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Your condition report and all photos are securely stored for <strong>2 years</strong> from the date of creation.
              </p>
            </div>
          </div>

          <!-- How to Retrieve -->
          <div class="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-950/30 rounded-lg border border-stone-100 dark:border-stone-800">
            <div class="w-8 h-8 bg-white dark:bg-stone-800 rounded-md flex items-center justify-center flex-shrink-0 border border-stone-200 dark:border-stone-700">
              <UIcon name="i-lucide-download" class="w-4 h-4 text-[#0075DE]" />
            </div>
            <div>
              <h5 class="font-bold text-sm text-stone-900 dark:text-white mb-0.5">Easy Retrieval</h5>
              <p class="text-xs text-stone-600 dark:text-stone-400 mb-2">
                After payment, you'll receive an email. You can also access it via:
              </p>
              <ul class="space-y-1 text-xs text-stone-500 dark:text-stone-400">
                <li class="flex items-start gap-2">
                  <UIcon name="i-lucide-check" class="w-3 h-3 text-[#0075DE] mt-0.5 flex-shrink-0" />
                  Your unique report ID
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-lucide-check" class="w-3 h-3 text-[#0075DE] mt-0.5 flex-shrink-0" />
                  Searching with your email address
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-lucide-check" class="w-3 h-3 text-[#0075DE] mt-0.5 flex-shrink-0" />
                  Accessing from your RentBase dashboard
                </li>
              </ul>
            </div>
          </div>

          <!-- Legal Validity -->
          <div class="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-950/30 rounded-lg border border-stone-100 dark:border-stone-800">
            <div class="w-8 h-8 bg-white dark:bg-stone-800 rounded-md flex items-center justify-center flex-shrink-0 border border-stone-200 dark:border-stone-700">
              <UIcon name="i-lucide-scale" class="w-4 h-4 text-[#0075DE]" />
            </div>
            <div>
              <h5 class="font-bold text-sm text-stone-900 dark:text-white mb-0.5">Legally Timestamped</h5>
              <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Cryptographically timestamped at upload for indisputable proof of condition.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- What's Included Card -->
      <div class="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800">
        <h4 class="text-base font-bold text-stone-900 dark:text-white mb-4">What You'll Receive</h4> 
        
        <div class="grid sm:grid-cols-2 gap-3">
          <div class="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-800/30 rounded-lg border border-stone-100 dark:border-stone-800">
            <div class="w-8 h-8 bg-white dark:bg-stone-800 rounded-md flex items-center justify-center flex-shrink-0 border border-stone-200 dark:border-stone-700">
              <UIcon name="i-lucide-file-text" class="w-4 h-4 text-stone-500" />
            </div>
            <div>
              <h5 class="font-bold text-stone-900 dark:text-white text-xs">Official PDF Report</h5>
              <p class="text-[10px] text-stone-500 mt-0.5">Downloadable & printable</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-800/30 rounded-lg border border-stone-100 dark:border-stone-800">
             <div class="w-8 h-8 bg-white dark:bg-stone-800 rounded-md flex items-center justify-center flex-shrink-0 border border-stone-200 dark:border-stone-700">
              <UIcon name="i-lucide-mail" class="w-4 h-4 text-stone-500" />
            </div>
            <div>
              <h5 class="font-bold text-stone-900 dark:text-white text-xs">Email Confirmation</h5>
              <p class="text-[10px] text-stone-500 mt-0.5">Sent directly to you</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-800/30 rounded-lg border border-stone-100 dark:border-stone-800">
             <div class="w-8 h-8 bg-white dark:bg-stone-800 rounded-md flex items-center justify-center flex-shrink-0 border border-stone-200 dark:border-stone-700">
              <UIcon name="i-lucide-clock" class="w-4 h-4 text-stone-500" />
            </div>
            <div>
              <h5 class="font-bold text-stone-900 dark:text-white text-xs">Timestamp Proof</h5>
              <p class="text-[10px] text-stone-500 mt-0.5">Cryptographic validation</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-800/30 rounded-lg border border-stone-100 dark:border-stone-800">
             <div class="w-8 h-8 bg-white dark:bg-stone-800 rounded-md flex items-center justify-center flex-shrink-0 border border-stone-200 dark:border-stone-700">
              <UIcon name="i-lucide-cloud" class="w-4 h-4 text-stone-500" />
            </div>
            <div>
              <h5 class="font-bold text-stone-900 dark:text-white text-xs">Cloud Backup</h5>
              <p class="text-[10px] text-stone-500 mt-0.5">2-year secure storage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  reportId: string
  photos: { url: string; description: string }[]
  propertyAddress?: string
}>()

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<style scoped>
@keyframes watermark-drift {
  0%, 100% { 
    opacity: 0.02;
    transform: translateX(-5%) rotate(-20deg);
  }
  50% { 
    opacity: 0.04;
    transform: translateX(5%) rotate(-20deg);
  }
}

.animate-watermark {
  animation: watermark-drift 10s ease-in-out infinite;
}
</style>
