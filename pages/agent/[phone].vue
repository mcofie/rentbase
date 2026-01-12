<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
    <div class="relative z-10 flex flex-col min-h-screen text-balance">
      <!-- Minimalist Navbar -->
      <nav class="max-w-5xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <span class="text-white text-xl">⚡</span>
          </div>
          <span class="text-2xl font-black text-stone-900 dark:text-white tracking-tighter">RentBase</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <ColorSchemeButton />
          <UserDropdown v-if="user" />
          <UButton 
            variant="ghost" 
            color="neutral" 
            icon="i-lucide-arrow-left" 
            @click="router.back()"
            class="rounded-full"
          >
            Back
          </UButton>
        </div>
      </nav>

      <main class="max-w-4xl w-full mx-auto px-6 py-12">
        <!-- Agent Header (Straightforward) -->
        <div class="bg-white dark:bg-stone-900 rounded-[48px] p-10 border border-stone-200 dark:border-stone-800 shadow-sm mb-12 animate-fade-in">
           <div class="flex flex-col md:flex-row md:items-center justify-between gap-10 text-center md:text-left">
              <div class="flex flex-col md:flex-row items-center gap-6">
                <!-- Avatar / Status Icon -->
                <div 
                  class="w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner relative"
                  :class="isRegisteredAgent ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-stone-50 dark:bg-stone-800'"
                >
                  <span class="text-4xl">{{ isRegisteredAgent ? '👮‍♂️' : '👤' }}</span>
                  <div v-if="isRegisteredAgent" class="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1.5 border-4 border-white dark:border-stone-900">
                    <UIcon name="i-lucide-check" class="w-4 h-4" />
                  </div>
                </div>

                <div>
                   <div class="flex items-center justify-center md:justify-start gap-4 mb-2">
                     <h1 class="text-4xl font-black text-stone-900 dark:text-white tracking-tighter">{{ formattedPhone }}</h1>
                     <button @click="copyAgentPhone" class="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors text-stone-300 hover:text-emerald-500">
                       <UIcon name="i-lucide-copy" class="w-5 h-5" />
                     </button>
                   </div>
                   
                   <!-- Status Badge -->
                   <div class="flex items-center justify-center md:justify-start gap-2">
                     <template v-if="isRegisteredAgent">
                        <span class="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">Registered Agent</span>
                        <UIcon name="i-lucide-badge-check" class="w-4 h-4 text-blue-500" />
                     </template>
                     <template v-else>
                        <span class="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.3em]">Unregistered Line</span>
                     </template>
                   </div>
                </div>
              </div>

              <div class="flex flex-col items-center md:items-end gap-6">
                 <div class="text-center md:text-right">
                    <p class="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] mb-4">Trust Level</p>
                    <TrustScoreBadge 
                      v-if="summary" 
                      :level="summary.trust_level" 
                      :score="summary.average_rating" 
                      show-score 
                    />
                    <div v-else-if="loading" class="h-10 w-40 bg-stone-100 dark:bg-stone-800 rounded-full animate-pulse mx-auto md:ml-auto"></div>
                    <span v-else class="text-sm font-bold text-stone-400">Not enough data</span>
                 </div>
                 
                 <div class="flex gap-3">
                   <button 
                    v-if="!isRegisteredAgent"
                    @click="invokeInviteModal"
                    class="px-6 py-4 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-all text-sm uppercase tracking-widest flex items-center gap-2"
                   >
                     <UIcon name="i-lucide-send" class="w-4 h-4" />
                     <span>Invite</span>
                   </button>
                   <button 
                    @click="showReviewModal = true"
                    class="px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black rounded-full hover:scale-105 transition-all text-sm uppercase tracking-widest"
                   >
                     Write Report
                   </button>
                 </div>
              </div>
           </div>
        </div>

        <!-- Feedback Feed -->
        <div class="animate-fade-in delay-100">
          <div class="flex items-center gap-6 mb-12">
            <h2 class="text-2xl font-black text-stone-900 dark:text-white tracking-tighter uppercase whitespace-nowrap">Community Feedback</h2>
            <div class="h-px w-full bg-stone-200 dark:bg-stone-800"></div>
          </div>

          <div v-if="loading" class="space-y-6">
            <div v-for="i in 3" :key="i" class="h-32 bg-stone-100 dark:bg-stone-900 rounded-[32px] animate-pulse"></div>
          </div>

          <div v-else-if="reviews.length > 0" class="grid grid-cols-1 gap-4">
            <div v-for="review in reviews" :key="review.id" class="bg-gray-50/50 dark:bg-stone-900/50 p-8 rounded-[32px] border border-stone-100 dark:border-stone-800 transition-all hover:shadow-lg hover:shadow-stone-200/50 dark:hover:shadow-none">
               <div class="flex items-start justify-between mb-6">
                  <div class="flex items-center gap-4">
                    <!-- Avatar Placeholder -->
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 flex items-center justify-center shadow-inner">
                      <span class="font-black text-stone-400 dark:text-stone-500 text-lg">
                        {{ (review as any).reviewer_phone ? 'V' : 'A' }}
                      </span>
                    </div>
                    
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="font-bold text-stone-900 dark:text-white text-base">
                          {{ (review as any).reviewer_phone ? 'Verified Reporter' : 'Anonymous' }}
                        </p>
                        <!-- Verified Badge -->
                        <div v-if="(review as any).reviewer_phone || review.reviewer_id" class="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md flex items-center gap-1">
                           <UIcon name="i-lucide-shield-check" class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                           <span class="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Verified</span>
                        </div>
                      </div>
                      <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                        {{ new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-1 bg-white dark:bg-stone-800 px-3 py-1.5 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700">
                    <UIcon 
                      v-for="i in 5" 
                      :key="i" 
                      name="i-lucide-star" 
                      class="w-4 h-4"
                      :class="i <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200 dark:text-stone-700'"
                    />
                  </div>
               </div>
               
               <p class="text-stone-600 dark:text-stone-300 font-medium text-lg leading-relaxed pl-16">
                 "{{ review.comment }}"
               </p>
            </div>
          </div>

          <div v-else class="text-center py-20 bg-white dark:bg-stone-900 rounded-[48px] border border-stone-200 dark:border-stone-800 border-dashed">
              <div class="mb-6">
                <span class="text-4xl">🕵️</span>
              </div>
              <h3 class="text-xl font-black text-stone-900 dark:text-white mb-2 uppercase tracking-tighter">Unknown Agent</h3>
              <p class="text-stone-400 font-medium mb-8 max-w-sm mx-auto">No reports have been filed for this number yet. You can be the first to verify them.</p>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  @click="showReviewModal = true"
                  class="px-6 py-3 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-bold rounded-2xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-2"
                >
                  <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                  Write First Report
                </button>
                <button 
                  v-if="!isRegisteredAgent"
                  @click="invokeInviteModal"
                  class="px-6 py-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold rounded-2xl hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-2"
                >
                  <UIcon name="i-lucide-send" class="w-4 h-4" />
                  Invite to Verify
                </button>
              </div>
          </div>
        </div>
      </main>

      <!-- Review Modal (Minimal) -->
      <Teleport to="body">
        <div v-if="showReviewModal" class="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" @click.self="showReviewModal = false">
          <div class="bg-white dark:bg-stone-900 rounded-[32px] p-10 max-w-lg w-full animate-bounce-in shadow-2xl border border-stone-200 dark:border-stone-800 relative max-h-[90vh] overflow-y-auto">
            
            <!-- Step 1: Review Content -->
            <div v-if="reviewStep === 1">
              <div class="mb-10 text-center">
                <h3 class="text-3xl font-black text-stone-900 dark:text-white tracking-tighter mb-2 uppercase">Submit Report</h3>
                <p class="text-stone-500 dark:text-stone-400 font-medium">Interaction with {{ formattedPhone }}</p>
              </div>

              <form @submit.prevent="proceedToVerification" class="space-y-10">
                <div class="text-center">
                  <p class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6 text-center">Protocol Rating</p>
                  <div class="flex justify-center gap-4">
                     <button 
                      v-for="i in 5" 
                      :key="i"
                      type="button"
                      class="text-4xl transition-all hover:scale-125"
                      :class="i <= newReview.rating ? 'opacity-100' : 'opacity-10'"
                      @click="newReview.rating = i"
                     >
                       ⭐️
                     </button>
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Evidence / Comment</label>
                  <UTextarea 
                    v-model="newReview.comment"
                    placeholder="Details of interaction..."
                    :rows="4"
                    variant="none"
                    class="bg-stone-50 dark:bg-stone-950/50 rounded-3xl p-6 font-medium text-stone-900 dark:text-white border border-transparent focus:border-emerald-500/50 transition-all"
                    autofocus
                  />
                </div>

                <div class="flex flex-col gap-3">
                   <button 
                    type="submit" 
                    class="w-full py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-stone-900/10 flex items-center justify-center gap-3"
                   >
                     <span>Next Step</span>
                     <UIcon name="i-lucide-arrow-right" />
                   </button>
                   <button 
                    type="button" 
                    class="w-full py-4 text-stone-400 font-black uppercase tracking-widest text-[10px] hover:text-stone-600 transition-colors"
                    @click="showReviewModal = false"
                   >
                     Cancel
                   </button>
                </div>
              </form>
            </div>

            <!-- Step 2: Verification -->
            <div v-else-if="reviewStep === 2">
              <div class="mb-8 text-center">
                <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UIcon name="i-lucide-shield-check" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 class="text-2xl font-black text-stone-900 dark:text-white tracking-tighter mb-2 uppercase">Verify Identity</h3>
                <p class="text-stone-500 dark:text-stone-400 text-sm font-medium">To keep reviews fair, please verify your number.</p>
              </div>

              <!-- Phone Input State -->
              <div v-if="!otpSent" class="space-y-6">
                <div>
                   <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Your Mobile Number</label>
                   <input
                     v-model="reviewerPhone"
                     type="tel"
                     placeholder="054XXXXXXX"
                     class="w-full px-4 py-4 bg-stone-50 dark:bg-stone-800 border-2 border-transparent focus:border-blue-500 rounded-2xl text-xl font-bold text-center tracking-widest outline-none transition-all"
                     autofocus
                   />
                </div>
                <button 
                  @click="sendOtp"
                  :disabled="!reviewerPhone || sendingOtp"
                  class="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <UIcon v-if="sendingOtp" name="i-lucide-loader-2" class="animate-spin" />
                  <span>Send Verification Code</span>
                </button>
              </div>

              <!-- OTP Input State -->
              <div v-else class="space-y-6">
                 <div>
                   <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Enter Code sent to {{ reviewerPhone }}</label>
                   <input
                     v-model="otpCode"
                     type="text"
                     placeholder="XXXX"
                     maxlength="4"
                     class="w-full px-4 py-4 bg-stone-50 dark:bg-stone-800 border-2 border-transparent focus:border-blue-500 rounded-2xl text-3xl font-black text-center tracking-[1em] outline-none transition-all"
                     autofocus
                   />
                </div>
                <button 
                  @click="verifyAndSubmit"
                  :disabled="otpCode.length !== 4 || submitting"
                  class="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <UIcon v-if="submitting" name="i-lucide-loader-2" class="animate-spin" />
                  <span>Verify & Publish Review</span>
                </button>
                <button 
                  @click="otpSent = false"
                  class="w-full text-xs font-bold text-stone-400 hover:text-stone-600 py-2"
                >
                  Change Number
                </button>
              </div>

              <div class="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 flex justify-center">
                 <button @click="reviewStep = 1" class="text-xs font-bold text-stone-400 hover:text-stone-900 flex items-center gap-1">
                   <UIcon name="i-lucide-arrow-left" class="w-3 h-3" />
                   Back to Review
                 </button>
              </div>
            </div>

          </div>
        </div>
      </Teleport>
      
      <footer class="py-12 border-t border-stone-200 dark:border-stone-800 mt-auto opacity-40">
         <div class="max-w-5xl mx-auto px-6 flex items-center justify-between">
            <span class="font-bold text-stone-900 dark:text-white tracking-widest text-[10px] uppercase">RentBase Intelligence</span>
            <p class="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em]">© 2025</p>
         </div>
      </footer>

      <!-- Invite Agent Modal -->
      <Teleport to="body">
        <div v-if="showInviteModal" class="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm grid place-items-center z-[999] p-6 overflow-y-auto">
          <div class="bg-white dark:bg-stone-900 rounded-[28px] p-8 max-w-md w-full animate-bounce-in shadow-2xl border border-stone-200 dark:border-stone-800">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <UIcon name="i-lucide-send" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="font-black text-stone-900 dark:text-white">Invite Agent</h3>
                <p class="text-xs text-stone-500">Send an SMS invitation to register</p>
              </div>
            </div>

            <div class="space-y-4">
               <!-- Agent Number -->
               <div class="p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                 <p class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Agent's Number</p>
                 <p class="text-xl font-black text-stone-900 dark:text-white font-mono">{{ formattedPhone }}</p>
               </div>

               <!-- Your Name -->
               <div>
                 <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Your Name (Optional)</label>
                 <input
                   v-model="inviterName"
                   type="text"
                   placeholder="e.g., Kofi"
                   class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl text-base font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-stone-300"
                 />
               </div>

               <!-- Preview -->
               <div>
                 <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">SMS Preview</label>
                 <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-800 dark:text-blue-200 font-mono whitespace-pre-wrap">{{ inviteSmsMessage }}</div>
               </div>

               <div class="flex gap-3 pt-2">
                 <button
                   @click="sendInviteSms"
                   :disabled="sendingInvite"
                   class="flex-1 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                 >
                   <UIcon v-if="sendingInvite" name="i-lucide-loader-2" class="animate-spin" />
                   <span v-else>Send Invitation</span>
                 </button>
                 <button
                   @click="showInviteModal = false"
                   class="px-6 py-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                 >
                   Cancel
                 </button>
               </div>
            </div>
          </div>
        </div>
      </Teleport>

      <AuthModal v-model="showAuthModal" @success="handleAuthSuccess" />

    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPhoneDisplay, formatPhoneE164 } from '~/utils/formatPhone'
import type { Review, AgentReviewSummary } from '~/types'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { user } = useAuth()
const supabase = useSupabaseClient()
const toast = useToast()
const { sendSMS } = useSMS()

const phone = route.params.phone as string
const formattedPhone = computed(() => formatPhoneDisplay(phone))

const loading = ref(true)
const submitting = ref(false)
const showReviewModal = ref(route.query.review === 'true')
const showAuthModal = ref(false)

// Invite state
const showInviteModal = ref(false)
const inviterName = ref('')
const sendingInvite = ref(false)

const reviews = ref<Review[]>([])
const summary = ref<AgentReviewSummary | null>(null)

const isRegisteredAgent = ref(false)
const agentProfile = ref<any>(null)

const newReview = reactive({
  rating: 5,
  comment: ''
})

const inviteSmsMessage = computed(() => {
  const baseUrl = config.public.appUrl || 'https://rentbase.app'
  const referral = inviterName.value ? ` ${inviterName.value} searched for you on ` : 'Someone searched for you on '
  
  return `${referral}RentBase!\n\n` +
    `Build your reputation as a trusted agent. Register free:\n` +
    `${baseUrl}/agents/register\n\n` +
    `- RentBase 🏠`
})

function invokeInviteModal() {
  showInviteModal.value = true
}

async function sendInviteSms() {
  sendingInvite.value = true
  try {
    const formatted = formatPhoneE164(phone)
    const result = await sendSMS(formatted, inviteSmsMessage.value)
    
    if (result.success) {
      toast.add({ title: 'Invitation sent!', color: 'success' })
      showInviteModal.value = false
      
      // Log it
      try {
        await $fetch('/api/agents/invite-log', {
          method: 'POST',
          body: {
            agent_phone: formatted,
            inviter_name: inviterName.value || null,
            sent_at: new Date().toISOString()
          }
        })
      } catch (e) { /* ignore log error */ }
    } else {
      toast.add({ title: 'Failed to send SMS', description: result.error, color: 'error' })
    }
  } catch (e: any) {
    toast.add({ title: 'Error', description: e.message, color: 'error' })
  } finally {
    sendingInvite.value = false
  }
}

function copyAgentPhone() {
  navigator.clipboard.writeText(phone)
  toast.add({ title: 'Line Copied', color: 'success' })
}

async function fetchAgentData() {
  loading.value = true
  try {
    const e164 = formatPhoneE164(phone)
    
    // Parallel fetch: Reviews and Profile
    const [reviewsResult, profileResult] = await Promise.all([
      supabase
        .from('reviews')
        .select('*')
        .eq('agent_phone', e164)
        .order('created_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('*')
        .eq('phone_number', e164)
        .eq('role', 'agent')
        .single()
    ]) as [any, any]

    // Handle Reviews
    if (reviewsResult.error) throw reviewsResult.error
    reviews.value = reviewsResult.data || []

    if (reviews.value.length > 0) {
      const avg = reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length
      summary.value = {
        agent_phone: e164,
        total_reviews: reviews.value.length,
        average_rating: avg,
        trust_level: avg >= 4 ? 'green' : avg >= 2.5 ? 'yellow' : 'red'
      }
    } else {
      summary.value = null
    }

    // Handle Registration Status
    if (profileResult.data) {
      isRegisteredAgent.value = true
      agentProfile.value = profileResult.data
    } else {
      isRegisteredAgent.value = false
      agentProfile.value = null
    }

  } catch (err: any) {
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

const reviewStep = ref(1)
const reviewerPhone = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const sendingOtp = ref(false)

async function proceedToVerification() {
  if (user.value) {
    // If logged in, skip verification
    submitReview()
  } else {
    reviewStep.value = 2
  }
}

async function sendOtp() {
  sendingOtp.value = true
  try {
    const e164 = formatPhoneE164(reviewerPhone.value)
    
    await $fetch('/api/otp/generate', {
      method: 'POST',
      body: { phone: e164 }
    })
    
    otpSent.value = true
    toast.add({ title: 'Code sent!', description: 'Check your SMS messages', color: 'success' })
  } catch (err: any) {
    toast.add({ title: 'Failed to send code', description: err.message || err.statusMessage, color: 'error' })
  } finally {
    sendingOtp.value = false
  }
}

async function verifyAndSubmit() {
  submitting.value = true
  try {
    const e164 = formatPhoneE164(reviewerPhone.value)
    
    // 1. Verify OTP
    await $fetch('/api/otp/verify', {
      method: 'POST',
      body: { phone: e164, code: otpCode.value }
    })
    
    // 2. Submit Review
    const body: any = {
      agent_phone: formatPhoneE164(phone),
      rating: newReview.rating,
      comment: newReview.comment,
      reviewer_phone: e164
    }

    await $fetch('/api/reviews/submit', {
      method: 'POST',
      body
    })
    
    toast.add({ title: 'Verified & Published!', color: 'success' })
    resetReviewForm()
  } catch (err: any) {
    toast.add({ title: 'Validation failed', description: err.message || err.statusMessage, color: 'error' })
  } finally {
    submitting.value = false
  }
}

function resetReviewForm() {
    showReviewModal.value = false
    newReview.rating = 5
    newReview.comment = ''
    reviewStep.value = 1
    reviewerPhone.value = ''
    otpCode.value = ''
    otpSent.value = false
    fetchAgentData()
}

async function submitReview() {
  // Direct submission for authenticated users
  submitting.value = true
  try {
    const body: any = {
      agent_phone: formatPhoneE164(phone),
      rating: newReview.rating,
      comment: newReview.comment
    }

    if (user.value) {
      body.reviewer_id = user.value.id
      // Reviewer phone is fetched in backend from profile, OR we can send it if available in user object
    }

    await $fetch('/api/reviews/submit', {
      method: 'POST',
      body
    })
    
    toast.add({ title: 'Report submitted!', color: 'success' })
    resetReviewForm()
  } catch (err: any) {
    toast.add({ title: 'Submission failed', description: err.message || err.statusMessage, color: 'error' })
  } finally {
    submitting.value = false
  }
}

function handleAuthSuccess() {
  showAuthModal.value = false
  submitReview()
}

onMounted(() => {
  fetchAgentData()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-100 { animation-delay: 0.1s; }

@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.9); }
  50% { transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-bounce-in {
  animation: bounce-in 0.3s ease-out forwards;
}
</style>
