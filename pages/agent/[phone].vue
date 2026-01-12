<template>
  <div class=" bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
    <div class="relative z-10 flex flex-col  text-balance">
      <main class="max-w-4xl w-full mx-auto px-6 py-8 sm:py-12">
        <!-- Back Button -->
        <div class="mb-6">
          <button 
            @click="router.back()" 
            class="flex items-center gap-2 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors font-bold text-sm"
          >
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
            Back to Search
          </button>
        </div>
        <!-- Agent Header (Straightforward) -->
        <div class="bg-white dark:bg-stone-900 rounded-xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm mb-12 animate-fade-in">
           <div class="flex flex-col md:flex-row md:items-center justify-between gap-10 text-center md:text-left">
              <div class="flex flex-col md:flex-row items-center gap-6">
                <!-- Avatar / Status Icon -->
                <div 
                  class="w-16 h-16 rounded-lg flex items-center justify-center relative border border-stone-100 dark:border-stone-800"
                  :class="isRegisteredAgent ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-stone-50 dark:bg-stone-800'"
                >
                  <span class="text-3xl">{{ isRegisteredAgent ? '👮‍♂️' : '👤' }}</span>
                  <div v-if="isRegisteredAgent" class="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 border-2 border-white dark:border-stone-900">
                    <UIcon name="i-lucide-check" class="w-3 h-3" />
                  </div>
                </div>

                <div>
                   <div class="flex items-center justify-center md:justify-start gap-4 mb-2">
                     <h1 class="text-3xl font-bold text-stone-900 dark:text-white tracking-tight font-serif">{{ formattedPhone }}</h1>
                     <button @click="copyAgentPhone" class="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors text-stone-400 hover:text-stone-900">
                       <UIcon name="i-lucide-copy" class="w-4 h-4" />
                     </button>
                   </div>
                   
                   <!-- Status Badge -->
                   <div class="flex items-center justify-center md:justify-start gap-2">
                     <template v-if="isRegisteredAgent">
                        <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Registered Agent</span>
                        <UIcon name="i-lucide-badge-check" class="w-4 h-4 text-blue-500" />
                     </template>
                     <template v-else>
                        <span class="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">Unregistered Line</span>
                     </template>
                   </div>
                </div>
              </div>

              <div class="flex flex-col items-center md:items-end gap-6">
                 <div class="text-center md:text-right">
                    <p class="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-2">Trust Level</p>
                    <TrustScoreBadge 
                      v-if="summary" 
                      :level="summary.trust_level" 
                      :score="summary.average_rating" 
                      show-score 
                    />
                    <div v-else-if="loading" class="h-8 w-32 bg-stone-100 dark:bg-stone-800 rounded-md animate-pulse mx-auto md:ml-auto"></div>
                    <span v-else class="text-sm font-medium text-stone-400">Not enough data</span>
                 </div>
                 
                 <div class="flex gap-3">
                   <button 
                    v-if="!isRegisteredAgent"
                    @click="invokeInviteModal"
                    class="px-5 py-2.5 bg-white border border-stone-200 text-stone-600 font-medium rounded-lg hover:bg-stone-50 transition-all text-sm flex items-center gap-2"
                   >
                     <UIcon name="i-lucide-send" class="w-4 h-4" />
                     <span>Invite</span>
                   </button>
                   <button 
                    @click="showReviewModal = true"
                    class="px-5 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-medium rounded-lg hover:bg-stone-800 transition-all text-sm"
                   >
                     Write Report
                   </button>
                 </div>
              </div>
           </div>
        </div>

        <!-- Feedback Feed -->
        <div class="animate-fade-in delay-100">
          <div class="flex items-center gap-6 mb-8">
            <h2 class="text-xl font-bold text-stone-900 dark:text-white font-serif">Community Feedback</h2>
            <div class="h-px w-full bg-stone-200 dark:bg-stone-800"></div>
          </div>

          <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="h-24 bg-stone-50 dark:bg-stone-900 rounded-lg animate-pulse border border-stone-100"></div>
          </div>

          <div v-else-if="reviews.length > 0" class="grid grid-cols-1 gap-4">
            <div v-for="review in reviews" :key="review.id" class="bg-white dark:bg-stone-900/50 p-6 rounded-lg border border-stone-200 dark:border-stone-800 transition-all hover:border-stone-300">
               <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <!-- Avatar Placeholder -->
                    <div class="w-10 h-10 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center border border-stone-200 dark:border-stone-700">
                      <span class="font-bold text-stone-400 dark:text-stone-500 text-sm">
                        {{ (review as any).reviewer_phone ? 'V' : 'A' }}
                      </span>
                    </div>
                    
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="font-bold text-stone-900 dark:text-white text-sm">
                          {{ (review as any).reviewer_phone ? 'Verified Reporter' : 'Anonymous' }}
                        </p>
                        <!-- Verified Badge -->
                        <div v-if="(review as any).reviewer_phone || review.reviewer_id" class="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 rounded flex items-center gap-1 border border-emerald-100 dark:border-emerald-800">
                           <UIcon name="i-lucide-shield-check" class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                           <span class="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Verified</span>
                        </div>
                      </div>
                      <p class="text-[10px] font-medium text-stone-400 uppercase tracking-widest mt-0.5">
                        {{ new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-0.5">
                    <UIcon 
                      v-for="i in 5" 
                      :key="i" 
                      name="i-lucide-star" 
                      class="w-3.5 h-3.5"
                      :class="i <= review.rating ? 'text-stone-900 fill-stone-900 dark:text-white dark:fill-white' : 'text-stone-200 dark:text-stone-700'"
                    />
                  </div>
               </div>
               
               <p class="text-stone-600 dark:text-stone-300 text-sm leading-relaxed pl-13">
                 "{{ review.comment }}"
               </p>
            </div>
          </div>

          <div v-else class="text-center py-16 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 border-dashed">
              <div class="mb-4">
                <span class="text-3xl">🕵️</span>
              </div>
              <h3 class="text-lg font-bold text-stone-900 dark:text-white mb-2">Unknown Agent</h3>
              <p class="text-stone-400 text-sm mb-6 max-w-sm mx-auto">No reports have been filed for this number yet. You can be the first to verify them.</p>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  @click="showReviewModal = true"
                  class="px-5 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-medium rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <UIcon name="i-lucide-pencil" class="w-4 h-4" />
                  Write First Report
                </button>
                <button 
                  v-if="!isRegisteredAgent"
                  @click="invokeInviteModal"
                  class="px-5 py-2.5 bg-white border border-stone-200 text-stone-600 font-medium rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-2 text-sm"
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
        <div v-if="showReviewModal" class="fixed inset-0 z-[999] flex items-center justify-center bg-stone-900/20 backdrop-blur-sm p-4" @click.self="showReviewModal = false">
          <div class="bg-white dark:bg-stone-900 rounded-xl p-8 max-w-lg w-full animate-bounce-in shadow-xl border border-stone-200 dark:border-stone-800 relative max-h-[90vh] overflow-y-auto">
            
            <!-- Step 1: Review Content -->
            <div v-if="reviewStep === 1">
              <div class="mb-8 text-center">
                <h3 class="text-2xl font-bold text-stone-900 dark:text-white tracking-tight mb-2 font-serif">Submit Report</h3>
                <p class="text-stone-500 dark:text-stone-400 text-sm">Interaction with {{ formattedPhone }}</p>
              </div>

              <form @submit.prevent="proceedToVerification" class="space-y-8">
                <div class="text-center">
                  <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4 text-center">Protocol Rating</p>
                  <div class="flex justify-center gap-2">
                     <button 
                      v-for="i in 5" 
                      :key="i"
                      type="button"
                      class="p-2 hover:bg-stone-50 rounded-md transition-all"
                      @click="newReview.rating = i"
                     >
                       <UIcon 
                        name="i-lucide-star" 
                        class="w-8 h-8 transition-colors"
                        :class="i <= newReview.rating ? 'text-stone-900 fill-stone-900' : 'text-stone-200'"
                       />
                     </button>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest ml-1">Evidence / Comment</label>
                  <UTextarea 
                    v-model="newReview.comment"
                    placeholder="Details of interaction..."
                    :rows="4"
                    variant="none"
                    class="bg-stone-50 dark:bg-stone-950/50 rounded-lg p-4 text-sm font-medium text-stone-900 dark:text-white border border-stone-200 dark:border-stone-800 focus:border-stone-400 transition-all"
                    autofocus
                  />
                </div>

                <div class="flex flex-col gap-3">
                   <button 
                    type="submit" 
                    class="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-lg hover:bg-stone-800 transition-all shadow-sm flex items-center justify-center gap-2"
                   >
                     <span>Next Step</span>
                     <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
                   </button>
                   <button 
                    type="button" 
                    class="w-full py-2 text-stone-400 font-bold uppercase tracking-widest text-[10px] hover:text-stone-600 transition-colors"
                    @click="showReviewModal = false"
                   >
                     Cancel
                   </button>
                </div>
              </form>
            </div>

            <!-- Step 2: Verification -->
            <div v-else-if="reviewStep === 2">
              <div class="mb-6 text-center">
                <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <UIcon name="i-lucide-shield-check" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 class="text-xl font-bold text-stone-900 dark:text-white tracking-tight mb-2 font-serif">Verify Identity</h3>
                <p class="text-stone-500 dark:text-stone-400 text-xs">To keep reviews fair, please verify your number.</p>
              </div>

              <!-- Phone Input State -->
              <div v-if="!otpSent" class="space-y-6">
                <div>
                   <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Your Mobile Number</label>
                   <input
                     v-model="reviewerPhone"
                     type="tel"
                     placeholder="054XXXXXXX"
                     class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:border-blue-500 rounded-lg text-lg font-mono font-medium text-center tracking-widest outline-none transition-all"
                     autofocus
                   />
                </div>
                <button 
                  @click="sendOtp"
                  :disabled="!reviewerPhone || sendingOtp"
                  class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <UIcon v-if="sendingOtp" name="i-lucide-loader-2" class="animate-spin" />
                  <span>Send Verification Code</span>
                </button>
              </div>

              <!-- OTP Input State -->
              <div v-else class="space-y-6">
                 <div>
                   <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">Enter Code sent to {{ reviewerPhone }}</label>
                   <input
                     v-model="otpCode"
                     type="text"
                     placeholder="XXXX"
                     maxlength="4"
                     class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:border-blue-500 rounded-lg text-2xl font-mono font-bold text-center tracking-[1em] outline-none transition-all"
                     autofocus
                   />
                </div>
                <button 
                  @click="verifyAndSubmit"
                  :disabled="otpCode.length !== 4 || submitting"
                  class="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
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
            <p class="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">© 2025</p>
         </div>
      </footer>

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
              <p class="text-xl font-bold text-stone-900 dark:text-white font-mono tracking-tight">{{ formattedPhone }}</p>
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

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button
                @click="showInviteModal = false"
                class="flex-1 py-2.5 bg-white border border-stone-200 dark:bg-stone-800 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
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

definePageMeta({
  layout: 'default'
})

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
