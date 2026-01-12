<template>
  <div class="w-full max-w-[480px] mx-auto">
    <!-- Minimalist Input Box -->
    <div class="bg-white dark:bg-stone-900 rounded-xl p-2 border border-stone-200 dark:border-stone-800 shadow-sm">
      <form @submit.prevent="handleSearch" class="relative">
        <!-- Phone Input -->
        <div class="bg-white dark:bg-stone-900 rounded-lg p-4 border border-stone-200 dark:border-stone-800 focus-within:border-stone-900 focus-within:ring-1 focus-within:ring-stone-900 transition-all">
          <label class="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2 text-center">Enter Line Number</label>
          <input
            v-model="searchPhone"
            placeholder="0XX XXX XXXX"
            type="tel"
            class="block w-full bg-transparent border-none p-0 text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white placeholder-stone-200 dark:placeholder-stone-800 focus:ring-0 text-center tracking-tight"
          />
        </div>

        <!-- Action Button -->
        <div class="mt-2">
          <button
            type="submit"
            :disabled="!searchPhone || loading"
            class="w-full py-3 rounded-lg text-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :class="!searchPhone ? 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-700' : 'bg-stone-900 text-white hover:bg-stone-700 active:scale-[0.98]'"
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
      
      <!-- No Results - New Unknown Agent Card -->
      <div 
        v-else
        class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-stone-200 dark:border-stone-800 shadow-sm"
      >
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center mx-auto mb-4 border border-stone-200 dark:border-stone-700">
             <UIcon name="i-lucide-search-x" class="w-6 h-6 text-stone-400" />
          </div>
          <h4 class="text-xl font-bold text-stone-900 dark:text-white mb-2 font-serif">Unknown Agent</h4>
          <p class="text-stone-500 dark:text-stone-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            We have no reports for <strong>{{ formatPhoneDisplay(searchPhone) }}</strong> yet.
          </p>
        </div>

        <!-- Options Grid -->
        <div class="space-y-3">
          <!-- Write First Review -->
          <button
            class="w-full py-3.5 rounded-lg bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-sm flex items-center justify-center gap-2"
            @click="$emit('write-review', searchPhone)"
          >
            <UIcon name="i-lucide-pencil" class="w-4 h-4" />
            Write First Review
          </button>

          <!-- Invite Agent via SMS -->
          <button
            @click="showInviteModal = true"
            class="w-full py-3.5 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-white font-bold border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-2"
          >
            <UIcon name="i-lucide-smartphone" class="w-4 h-4" />
            Invite Agent to Verify
          </button>

          <!-- Reset -->
          <button
            @click="resetSearch"
            class="w-full py-3 text-stone-400 text-sm font-medium hover:text-stone-600 transition-colors"
          >
            Search Different Number
          </button>
        </div>

        <!-- Info -->
        <div class="mt-6 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-100 dark:border-stone-800">
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-info" class="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
            <p class="text-xs text-stone-500 leading-relaxed font-medium">
              Inviting an agent sends them an SMS to register on RentBase. 
              This helps build trust and transparency in the rental market.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Agent Modal -->
    <Teleport to="body">
      <div v-if="showInviteModal" class="fixed inset-0 bg-stone-900/20 backdrop-blur-sm flex items-center justify-center z-[999] p-6">
        <div class="bg-white dark:bg-stone-900 rounded-lg p-6 max-w-md w-full animate-bounce-in shadow-xl border border-stone-200 dark:border-stone-800">
          <!-- Header -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center border border-stone-200 dark:border-stone-700">
              <UIcon name="i-lucide-send" class="w-5 h-5 text-stone-900 dark:text-white" />
            </div>
            <div>
              <h3 class="font-bold text-lg text-stone-900 dark:text-white font-serif tracking-tight">Invite Agent</h3>
              <p class="text-xs text-stone-500 font-medium">Send an SMS invitation to register</p>
            </div>
          </div>

          <!-- Agent Number Display -->
          <div class="mb-6 p-4 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-100 dark:border-stone-700">
            <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">Agent's Number</p>
            <p class="text-xl font-bold text-stone-900 dark:text-white font-mono tracking-tight">{{ formatPhoneDisplay(searchPhone) }}</p>
          </div>

          <!-- Your Name (Optional) -->
          <div class="mb-6">
            <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Your Name (Optional)</label>
            <input
              v-model="inviterName"
              type="text"
              placeholder="e.g., Kofi"
              class="w-full px-3 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-900 dark:text-white focus:ring-1 focus:ring-stone-900 dark:focus:ring-white focus:border-stone-900 transition-all placeholder-stone-300"
            />
            <p class="text-[10px] text-stone-400 mt-2 font-medium">We'll mention you referred them</p>
          </div>

          <!-- Message Preview -->
          <div class="mb-6">
            <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">SMS Preview</label>
            <div class="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg text-xs text-stone-600 dark:text-stone-300 font-mono whitespace-pre-wrap border border-stone-100 dark:border-stone-700">{{ inviteSmsMessage }}</div>
            <p class="text-[10px] text-stone-400 mt-2 text-right">{{ inviteSmsMessage.length }}/160 characters</p>
          </div>

          <!-- Error -->
          <UAlert
            v-if="inviteError"
            color="error"
            variant="subtle"
            :description="inviteError"
            icon="i-lucide-alert-circle"
            class="mb-4"
          />

          <!-- Success -->
          <div v-if="inviteSuccess" class="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
            <UIcon name="i-lucide-check-circle-2" class="w-5 h-5 text-emerald-600" />
            <span class="text-sm font-bold text-emerald-700 dark:text-emerald-300">Invitation sent! The agent will receive an SMS shortly.</span>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button
              @click="closeInviteModal"
              class="flex-1 py-2.5 bg-white border border-stone-200 dark:bg-stone-800 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors text-sm"
            >
              {{ inviteSuccess ? 'Close' : 'Cancel' }}
            </button>
            <button
              v-if="!inviteSuccess"
              @click="sendInviteSms"
              :disabled="sendingInvite"
              :class="[
                'flex-1 py-2.5 font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-sm',
                !sendingInvite
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 hover:opacity-90'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
              ]"
            >
              <div v-if="sendingInvite" class="w-4 h-4 border-2 border-stone-400 border-t-stone-900 rounded-full animate-spin"></div>
              <template v-else>
                <UIcon name="i-lucide-send" class="w-4 h-4" />
                Send Invite
              </template>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { formatPhoneE164, formatPhoneDisplay } from '~/utils/formatPhone'
import type { AgentReviewSummary } from '~/types'

const emit = defineEmits<{
  'write-review': [phone: string]
  'view-reviews': [phone: string]
}>()

const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const { sendSMS } = useSMS()

const searchPhone = ref('')
const loading = ref(false)
const hasSearched = ref(false)
const agentData = ref<AgentReviewSummary | null>(null)

// Invite modal state
const showInviteModal = ref(false)
const inviterName = ref('')
const sendingInvite = ref(false)
const inviteSuccess = ref(false)
const inviteError = ref<string | null>(null)

const inviteSmsMessage = computed(() => {
  const baseUrl = config.public.appUrl || 'https://rentbase.app'
  const referral = inviterName.value ? ` ${inviterName.value} searched for you on ` : 'Someone searched for you on '
  
  return `${referral}RentBase!\n\n` +
    `Build your reputation as a trusted agent. Register free:\n` +
    `${baseUrl}/agents/register\n\n` +
    `- RentBase 🏠`
})

function resetSearch() {
  hasSearched.value = false
  searchPhone.value = ''
  agentData.value = null
}

function closeInviteModal() {
  showInviteModal.value = false
  inviterName.value = ''
  inviteSuccess.value = false
  inviteError.value = null
}

async function sendInviteSms() {
  sendingInvite.value = true
  inviteError.value = null
  
  try {
    const formattedPhone = formatPhoneE164(searchPhone.value)
    const result = await sendSMS(formattedPhone, inviteSmsMessage.value)
    
    if (result.success) {
      inviteSuccess.value = true
      
      // Log the invitation for analytics (optional)
      try {
        await $fetch('/api/agents/invite-log', {
          method: 'POST',
          body: {
            agent_phone: formattedPhone,
            inviter_name: inviterName.value || null,
            sent_at: new Date().toISOString()
          }
        })
      } catch (e) {
        // Silently fail - logging is optional
        console.log('Invite log skipped:', e)
      }
    } else {
      inviteError.value = result.error || 'Failed to send SMS. Please try again.'
    }
  } catch (e: any) {
    inviteError.value = e.message || 'An error occurred'
  } finally {
    sendingInvite.value = false
  }
}

  async function handleSearch() {
  if (!searchPhone.value.trim()) return
  
  loading.value = true
  hasSearched.value = false
  
  const formattedPhone = formatPhoneE164(searchPhone.value)
  
  try {
    // Parallel fetch: Reviews and Profile
    const [reviewsResult, profileResult] = await Promise.all([
      supabase
        .from('reviews')
        .select('rating')
        .eq('agent_phone', formattedPhone),
      supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', formattedPhone)
        .eq('role', 'agent')
        .single()
    ])
    
    const reviews = reviewsResult.data as { rating: number }[] | null
    const profile = profileResult.data
    
    if (reviewsResult.error && reviewsResult.error.code !== 'PGRST116') {
      console.error('Search error:', reviewsResult.error)
    }

    // Determine if we found anything
    if ((reviews && reviews.length > 0) || profile) {
      let totalReviews = 0
      let avgRating = 0
      let trustLevel: 'red' | 'yellow' | 'green' = 'red'

      if (reviews && reviews.length > 0) {
        totalReviews = reviews.length
        avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      }

      // Logic for trust level
      if (profile) {
        // If registered, start at green or yellow depending on reviews
        trustLevel = (totalReviews === 0 || avgRating >= 4) ? 'green' : (avgRating >= 2.5 ? 'yellow' : 'red')
      } else {
        // If not registered, rely solely on reviews
        if (avgRating >= 4) {
          trustLevel = 'green'
        } else if (avgRating >= 2.5) {
          trustLevel = 'yellow'
        } else {
          trustLevel = 'red'
        }
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

<style scoped>
@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.9); }
  50% { transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-bounce-in {
  animation: bounce-in 0.3s ease-out forwards;
}
</style>
