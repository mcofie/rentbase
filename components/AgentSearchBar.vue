<template>
  <div class="w-full max-w-[480px] mx-auto">
    <!-- Minimalist Input Box -->
    <div class="bg-white dark:bg-stone-900 rounded-[32px] p-2 border border-stone-200 dark:border-stone-800 shadow-sm">
      <form @submit.prevent="handleSearch" class="relative">
        <!-- Phone Input -->
        <div class="bg-stone-50 dark:bg-stone-950/50 rounded-[28px] p-6 focus-within:bg-white dark:focus-within:bg-stone-950 transition-all">
          <label class="block text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] mb-3 ml-1 text-center">Enter Line Number</label>
          <input
            v-model="searchPhone"
            placeholder="0XX XXX XXXX"
            type="tel"
            class="block w-full bg-transparent border-none p-0 text-3xl sm:text-4xl font-black text-stone-900 dark:text-white placeholder-stone-200 dark:placeholder-stone-800 focus:ring-0 text-center tracking-tight"
          />
        </div>

        <!-- Action Button -->
        <div class="mt-2">
          <button
            type="submit"
            :disabled="!searchPhone || loading"
            class="w-full py-5 rounded-[28px] text-lg font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :class="!searchPhone ? 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-700' : 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 hover:scale-[1.01] active:scale-[0.99]'"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <UIcon name="i-lucide-loader-2" class="animate-spin" />
              Verifying...
            </span>
            <span v-else>Verify Agent</span>
          </button>
        </div>
      </form>
    </div>
    
    <!-- Search Results (Minimalist) -->
    <div v-if="hasSearched" class="mt-4 animate-fade-in relative z-10">
      <div 
        v-if="agentData"
        class="bg-white dark:bg-stone-900 rounded-[32px] p-6 border border-stone-200 dark:border-stone-800"
      >
        <div class="flex items-center justify-between mb-8">
          <div>
            <p class="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] mb-3">Community Trust</p>
            <TrustScoreBadge :level="agentData.trust_level" :score="agentData.average_rating" show-score />
          </div>
          <button @click="resetSearch" class="h-10 w-10 flex items-center justify-center bg-stone-50 dark:bg-stone-800 rounded-xl text-stone-400 hover:text-stone-900 transition-colors">
            <UIcon name="i-lucide-rotate-ccw" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-3">
          <button
            class="col-span-1 py-4 px-4 rounded-2xl bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            @click="$emit('write-review', searchPhone)"
          >
            Review
          </button>
          <button
            class="col-span-1 py-4 px-4 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold hover:opacity-90 transition-opacity"
            @click="$emit('view-reviews', searchPhone)"
          >
            Details
          </button>
        </div>
      </div>
      
      <!-- No Results -->
      <div 
        v-else
        class="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800 text-center"
      >
        <div class="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span class="text-3xl">🤷‍♂️</span>
        </div>
        <h4 class="text-xl font-black text-stone-900 dark:text-white mb-2 tracking-tighter uppercase">Line Unknown</h4>
        <p class="text-stone-500 dark:text-stone-400 mb-8 text-sm font-medium leading-relaxed">
          We have no reports for this line yet. <br/> Help the community by securing it.
        </p>
        <button
          class="w-full py-5 rounded-[28px] bg-emerald-500 text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20"
          @click="$emit('write-review', searchPhone)"
        >
          Write First Review
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPhoneE164, formatPhoneDisplay } from '~/utils/formatPhone'
import type { AgentReviewSummary } from '~/types'

const emit = defineEmits<{
  'write-review': [phone: string]
  'view-reviews': [phone: string]
}>()

const supabase = useSupabaseClient()

const searchPhone = ref('')
const loading = ref(false)
const hasSearched = ref(false)
const agentData = ref<AgentReviewSummary | null>(null)

function resetSearch() {
  hasSearched.value = false
  searchPhone.value = ''
  agentData.value = null
}

async function handleSearch() {
  if (!searchPhone.value.trim()) return
  
  loading.value = true
  hasSearched.value = false
  
  const formattedPhone = formatPhoneE164(searchPhone.value)
  
  try {
    // Fetch reviews for the agent
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('agent_phone', formattedPhone) as { data: { rating: number }[] | null, error: any }
    
    if (error) {
      console.error('Search error:', error)
      agentData.value = null
    } else if (reviews && reviews.length > 0) {
      const totalReviews = reviews.length
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      
      // Determine trust level
      let trustLevel: 'red' | 'yellow' | 'green'
      if (avgRating >= 4) {
        trustLevel = 'green'
      } else if (avgRating >= 2.5) {
        trustLevel = 'yellow'
      } else {
        trustLevel = 'red'
      }
      
      agentData.value = {
        agent_phone: formattedPhone,
        total_reviews: totalReviews,
        average_rating: avgRating,
        trust_level: trustLevel,
      }
    } else {
      agentData.value = null
    }
  } catch (err) {
    console.error('Search failed:', err)
    agentData.value = null
  }
  
  hasSearched.value = true
  loading.value = false
}
</script>
