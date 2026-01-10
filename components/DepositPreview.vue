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
      <div class="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800 overflow-hidden relative">
        <!-- DRAFT Badge -->
        <div class="absolute top-4 right-4">
          <span class="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-widest rounded-full">
            Draft Preview
          </span>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UIcon name="i-lucide-shield-check" class="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-black text-stone-900 dark:text-white tracking-tight">Property Condition Report</h3>
            <p class="text-sm text-stone-500">Deposit Shield - Move-In Snapshot</p>
          </div>
        </div>

        <!-- Report Info -->
        <div class="grid sm:grid-cols-3 gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
          <div class="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
            <p class="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">Report ID</p>
            <p class="font-mono text-xs text-stone-700 dark:text-stone-300 truncate">{{ reportId.slice(0, 8) }}...</p>
          </div>
          <div class="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
            <p class="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">Photos</p>
            <p class="font-bold text-stone-900 dark:text-white">{{ photos.length }} documented</p>
          </div>
          <div class="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl">
            <p class="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-1">Date</p>
            <p class="font-bold text-stone-900 dark:text-white">{{ formatDate(new Date().toISOString()) }}</p>
          </div>
        </div>

        <!-- Property Address (if provided) -->
        <div v-if="propertyAddress" class="pt-6">
          <p class="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-2">Property Address</p>
          <p class="font-bold text-stone-900 dark:text-white">{{ propertyAddress }}</p>
        </div>
      </div>

      <!-- Photos Grid -->
      <div class="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800">
        <div class="flex items-center justify-between mb-6">
          <h4 class="text-lg font-black text-stone-900 dark:text-white tracking-tight">Documented Conditions</h4>
          <span class="text-xs text-stone-400">{{ photos.length }} photos</span>
        </div>

        <div v-if="photos.length === 0" class="text-center py-12">
          <UIcon name="i-lucide-image-off" class="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p class="text-stone-400">No photos uploaded yet</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div 
            v-for="(photo, index) in photos" 
            :key="index"
            class="group relative rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800"
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
            <div class="absolute top-2 left-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span class="text-white text-[10px] font-bold">{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Retention Info Card -->
      <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] p-8 text-white overflow-hidden relative">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <UIcon name="i-lucide-database" class="w-6 h-6" />
            </div>
            <div>
              <h4 class="text-lg font-black">Data Retention & Access</h4>
              <p class="text-white/70 text-sm">Your photos are securely stored</p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Storage Duration -->
            <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-calendar" class="w-5 h-5" />
              </div>
              <div>
                <h5 class="font-bold mb-1">2 Years Storage</h5>
                <p class="text-sm text-white/80">
                  Your condition report and all photos are securely stored for <strong>2 years</strong> from the date of creation.
                </p>
              </div>
            </div>

            <!-- How to Retrieve -->
            <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-download" class="w-5 h-5" />
              </div>
              <div>
                <h5 class="font-bold mb-1">Easy Retrieval</h5>
                <p class="text-sm text-white/80">
                  After payment, you'll receive an email with your report. You can also access it anytime by:
                </p>
                <ul class="mt-2 space-y-1 text-sm text-white/80">
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-emerald-300" />
                    Using your unique report ID
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-emerald-300" />
                    Searching with your email address
                  </li>
                  <li class="flex items-center gap-2">
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-emerald-300" />
                    Accessing from your RentBase dashboard
                  </li>
                </ul>
              </div>
            </div>

            <!-- Legal Validity -->
            <div class="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-scale" class="w-5 h-5" />
              </div>
              <div>
                <h5 class="font-bold mb-1">Legally Timestamped</h5>
                <p class="text-sm text-white/80">
                  Each photo is cryptographically timestamped at the moment of upload. 
                  This provides indisputable proof of the property's condition at the time of move-in,
                  admissible in any deposit dispute.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- What's Included Card -->
      <div class="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800">
        <h4 class="text-lg font-black text-stone-900 dark:text-white mb-6 tracking-tight">What You'll Receive</h4>
        
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-file-text" class="w-4 h-4 text-white" />
            </div>
            <div>
              <h5 class="font-bold text-emerald-700 dark:text-emerald-300 text-sm">Official PDF Report</h5>
              <p class="text-xs text-emerald-600 dark:text-emerald-400">Downloadable, printable report with all photos</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-mail" class="w-4 h-4 text-white" />
            </div>
            <div>
              <h5 class="font-bold text-blue-700 dark:text-blue-300 text-sm">Email Confirmation</h5>
              <p class="text-xs text-blue-600 dark:text-blue-400">Report link sent to your email</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
            <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-clock" class="w-4 h-4 text-white" />
            </div>
            <div>
              <h5 class="font-bold text-purple-700 dark:text-purple-300 text-sm">Timestamp Proof</h5>
              <p class="text-xs text-purple-600 dark:text-purple-400">Cryptographic proof of upload time</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-cloud" class="w-4 h-4 text-white" />
            </div>
            <div>
              <h5 class="font-bold text-amber-700 dark:text-amber-300 text-sm">Cloud Backup</h5>
              <p class="text-xs text-amber-600 dark:text-amber-400">2-year secure cloud storage</p>
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
