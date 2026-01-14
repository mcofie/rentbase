<template>
  <div class="min-h-screen bg-white dark:bg-[#050505] selection:bg-blue-100 selection:text-blue-900">
    
    <!-- Hero / Header Section -->
    <section class="pt-24 pb-16 px-6 relative overflow-hidden">
       <!-- Decor elements similar to landing page -->
       <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none opacity-60"></div>

       <div class="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          
          <!-- Back Link -->
          <button @click="router.back()" class="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors mb-10">
             <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
             Back to search
          </button>

          <!-- Verification Badge (Pill Style) -->
          <div v-if="isRegisteredAgent" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold tracking-wide uppercase mb-6 mx-auto">
             <UIcon name="i-lucide-badge-check" class="w-4 h-4" />
             Verified Agent
          </div>
          <div v-else class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-sm font-bold tracking-wide uppercase mb-6 mx-auto">
             Unregistered Line
          </div>

          <!-- Main Heading (Name) -->
          <h1 class="text-5xl sm:text-6xl font-bold text-stone-900 dark:text-white mb-4 tracking-tight leading-[1.1] font-serif">
             {{ agentProfile?.full_name || formattedPhone }}
          </h1>

          <!-- Optional Phone Subtitle if Name exists -->
          <p v-if="agentProfile?.full_name" class="text-xl font-mono text-stone-500 dark:text-stone-400 mb-2">{{ formattedPhone }}</p>
          
          <p class="text-lg text-stone-500 dark:text-stone-400 mb-10 max-w-xl mx-auto leading-relaxed">
             View verified reviews, history, and reputation data.
          </p>

          <!-- Primary Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-20">
             <button 
               @click="showReviewModal = true"
               class="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-[#0075DE] rounded-xl hover:bg-[#005BAB] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 gap-2"
             >
               <UIcon name="i-lucide-pencil-line" class="w-5 h-5" />
               Write a Report
             </button>
             
             <button 
               v-if="!isRegisteredAgent"
               @click="invokeInviteModal"
               class="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-stone-900 dark:text-white bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-700 transition-all duration-300 gap-2"
             >
               <UIcon name="i-lucide-send" class="w-5 h-5" />
               Invite to RentBase
             </button>
          </div>

          <!-- Stats / Info Grid (Using Feature Card styling) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
             <!-- Card 1: Trust Score -->
             <div class="group p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 relative overflow-hidden transition-all hover:border-amber-200 dark:hover:border-amber-800">
                <div class="w-12 h-12 rounded-lg bg-[#FFF4D6] dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-200 mb-4">
                   <UIcon name="i-lucide-star" class="w-6 h-6" />
                </div>
                <h3 class="text-lg font-bold text-stone-900 dark:text-white mb-2">Trust Score</h3>
                <div class="flex items-baseline gap-2 mb-1">
                   <span class="text-3xl font-bold font-serif">{{ summary?.average_rating > 0 ? summary.average_rating.toFixed(1) : '-' }}</span>
                   <span class="text-stone-400 text-sm">/ 5.0</span>
                </div>
                <p class="text-stone-500 dark:text-stone-400 text-sm">Based on {{ summary?.total_reviews || 0 }} verified reports</p>
             </div>

             <!-- Card 2: Agency -->
             <div class="group p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 relative overflow-hidden transition-all hover:border-blue-200 dark:hover:border-blue-800">
                <div class="w-12 h-12 rounded-lg bg-[#D3E5EF] dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-200 mb-4">
                   <UIcon name="i-lucide-building-2" class="w-6 h-6" />
                </div>
                <h3 class="text-lg font-bold text-stone-900 dark:text-white mb-2">Agency</h3>
                <p class="text-xl font-medium text-stone-900 dark:text-white mb-1 truncate">
                   {{ agentProfile?.agency_name || 'Not Listed' }}
                </p>
                <p class="text-stone-500 dark:text-stone-400 text-sm">Registered business entity</p>
             </div>

             <!-- Card 3: Location -->
             <div class="group p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 relative overflow-hidden transition-all hover:border-purple-200 dark:hover:border-purple-800">
                <div class="w-12 h-12 rounded-lg bg-[#E8DEEE] dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-200 mb-4">
                   <UIcon name="i-lucide-map-pin" class="w-6 h-6" />
                </div>
                <h3 class="text-lg font-bold text-stone-900 dark:text-white mb-2">Location</h3>
                <p class="text-xl font-medium text-stone-900 dark:text-white mb-1 capitalize truncate">
                   {{ typeof agentProfile?.location === 'string' ? agentProfile.location.replace('-', ' ') : (agentProfile?.location || 'Unknown') }}
                </p>
                <p class="text-stone-500 dark:text-stone-400 text-sm">Primary operating area</p>
             </div>
          </div>

       </div>
    </section>

    <!-- Reviews Section (Secondary Background) -->
    <section class="py-24 bg-[#F7F7F5] dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800">
       <div class="max-w-3xl mx-auto px-6">
          <div class="flex items-end justify-between mb-12">
             <div>
               <h2 class="text-3xl font-bold text-stone-900 dark:text-white font-serif tracking-tight mb-2">Latest Feedback</h2>
               <p class="text-stone-500 dark:text-stone-400">Read what others are saying about this agent.</p>
             </div>
             <!-- Optional Filter or Sort could go here -->
          </div>

          <div v-if="loading" class="text-center py-12">
             <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin mx-auto text-stone-400" />
          </div>

          <div v-else-if="reviews.length > 0" class="space-y-6">
             <div v-for="review in paginatedReviews" :key="review.id" class="p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-6">
                   <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-lg">
                         {{ (review as any).reviewer_phone ? '✓' : '?' }}
                      </div>
                      <div>
                         <div class="flex items-center gap-2">
                             <h4 class="font-bold text-stone-900 dark:text-white">
                                {{ (review as any).reviewer_phone ? 'Verified User' : 'Anonymous' }}
                             </h4>
                             <UIcon v-if="(review as any).reviewer_phone" name="i-lucide-badge-check" class="w-4 h-4 text-blue-500" />
                         </div>
                         <p class="text-xs text-stone-400 font-medium uppercase tracking-wide mt-1">
                            {{ new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) }}
                         </p>
                      </div>
                   </div>
                   <!-- Stars -->
                   <div class="flex gap-1">
                      <UIcon v-for="i in 5" :key="i" name="i-lucide-star" class="w-4 h-4" :class="i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200 dark:text-stone-700'" />
                   </div>
                </div>
                
                <p class="text-stone-600 dark:text-stone-300 leading-relaxed text-lg font-serif">
                   "{{ review.comment }}"
                </p>
             </div>

             <!-- Pagination -->
             <div v-if="totalPages > 1" class="flex justify-center gap-2 pt-8">
                <button 
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="w-10 h-10 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center hover:bg-stone-50 disabled:opacity-50"
               >
                  <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
               </button>
               <button 
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="w-10 h-10 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center hover:bg-stone-50 disabled:opacity-50"
               >
                  <UIcon name="i-lucide-arrow-right" class="w-4 h-4" />
               </button>
             </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border-2 border-dashed border-stone-200 dark:border-stone-800">
             <div class="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <UIcon name="i-lucide-message-square-plus" class="w-8 h-8 text-stone-400" />
             </div>
             <h3 class="text-xl font-bold text-stone-900 dark:text-white mb-2 font-serif">No reviews yet</h3>
             <p class="text-stone-500 dark:text-stone-400 mb-8 max-w-sm mx-auto">
                Be the first to share your experience with this agent and help the community.
             </p>
             <button @click="showReviewModal = true" class="text-blue-600 font-bold hover:underline">Write a Review</button>
          </div>
       </div>
    </section>
    
    <!-- Footer CTA similar to landing -->
    <section class="py-20 border-t border-stone-200 dark:border-stone-800 text-center">
       <button @click="copyAgentPhone" class="text-stone-900 dark:text-white font-bold text-lg hover:text-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto">
          <span>Report an issue with this page</span>
          <UIcon name="i-lucide-flag" class="w-4 h-4" />
       </button>
    </section>

    <!-- Modals (Re-styled to match landing feel) -->
    <Teleport to="body">
       <div v-if="showReviewModal" class="fixed inset-0 z-[999] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" @click.self="showReviewModal = false">
          <div class="bg-white dark:bg-[#151515] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
             
             <!-- Modal Header -->
             <div class="p-8 pb-0 text-center">
                <h3 class="text-2xl font-bold font-serif text-stone-900 dark:text-white mb-2">Submit Report</h3>
                <p class="text-stone-500 dark:text-stone-400">Share your experience to help others.</p>
             </div>

             <div class="p-8">
                 <!-- Step 1 -->
                 <div v-if="reviewStep === 1" class="space-y-8">
                    <div class="flex justify-center gap-3">
                       <button v-for="i in 5" :key="i" @click="newReview.rating = i" class="transition-transform hover:scale-110">
                          <UIcon name="i-lucide-star" class="w-10 h-10" :class="i <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200 dark:text-stone-700'" />
                       </button>
                    </div>

                    <UTextarea 
                       v-model="newReview.comment"
                       placeholder="Tell us about your experience..."
                       :rows="4"
                       variant="none"
                       class="w-full bg-stone-50 dark:bg-stone-900 rounded-xl p-4 text-base focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    />

                    <TurnstileCaptcha ref="captchaRef" class="hidden" @verified="onCaptchaVerified" @error="onCaptchaError" />

                    <button @click="proceedToVerification" class="w-full py-4 bg-[#0075DE] hover:bg-[#0060B9] text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                       Continue
                    </button>
                 </div>

                 <!-- Step 2 -->
                 <div v-else class="space-y-6">
                    <div v-if="!otpSent" class="space-y-4">
                       <input v-model="reviewerPhone" type="tel" placeholder="Your Phone Number" class="w-full h-14 px-4 bg-stone-50 dark:bg-stone-900 rounded-xl text-center text-lg font-bold font-mono focus:ring-2 focus:ring-blue-500 outline-none" autofocus />
                       <button :disabled="!reviewerPhone || sendingOtp" @click="sendOtp" class="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98]">
                          {{ sendingOtp ? 'Sending...' : 'Send Verification Code' }}
                       </button>
                    </div>
                    
                    <div v-else class="space-y-4">
                       <p class="text-center text-xs font-bold text-stone-400 uppercase">Enter code sent to {{ reviewerPhone }}</p>
                       <input v-model="otpCode" type="text" placeholder="0000" maxlength="4" class="w-full h-16 bg-stone-50 dark:bg-stone-900 rounded-xl text-center text-3xl font-bold font-mono tracking-widest focus:ring-2 focus:ring-blue-500 outline-none" autofocus />
                       
                       <button @click="verifyAndSubmit" :disabled="otpCode.length !== 4" class="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
                          {{ submitting ? 'Verifying...' : 'Verify & Publish' }}
                       </button>
                       <button @click="otpSent = false" class="w-full py-2 text-stone-400 font-bold text-xs hover:text-stone-600">Change Number</button>
                    </div>
                 </div>
             </div>
          </div>
       </div>
    </Teleport>
    
    <!-- Invite Modal -->
    <Teleport to="body">
       <div v-if="showInviteModal" class="fixed inset-0 z-[999] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="showInviteModal = false">
          <div class="bg-white dark:bg-[#151515] rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all animate-bounce-in">
             <div class="text-center mb-8">
                <div class="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                   <UIcon name="i-lucide-send" class="w-8 h-8" />
                </div>
                <h3 class="text-2xl font-bold font-serif text-stone-900 dark:text-white">Invite Agent</h3>
             </div>
             
             <div class="space-y-4">
                <input v-model="inviterName" placeholder="Your Name (Optional)" class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                
                <div class="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-dashed border-stone-200 dark:border-stone-700">
                   <p class="text-xs font-mono text-stone-500">{{ inviteSmsMessage }}</p>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-2">
                   <button @click="showInviteModal = false" class="py-3 font-bold text-stone-500 hover:bg-stone-50 rounded-xl transition-colors">Cancel</button>
                   <button @click="sendInviteSms" :disabled="sendingInvite" class="py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-xl hover:shadow-lg transition-all">Send SMS</button>
                </div>
             </div>
          </div>
       </div>
    </Teleport>

    <AuthModal v-model="showAuthModal" @success="handleAuthSuccess" />
    <ReportAgentModal v-model="showReportModal" :agent-phone="phone" />

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
const showReportModal = ref(false)

// Invite state
const showInviteModal = ref(false)
const inviterName = ref('')
const sendingInvite = ref(false)

const reviews = ref<Review[]>([])
const summary = ref<AgentReviewSummary | null>(null)

// Pagination state
const currentPage = ref(1)
const pageSize = 5 // Reviews per page

const totalPages = computed(() => Math.ceil(reviews.value.length / pageSize))
const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return reviews.value.slice(start, end)
})

const isRegisteredAgent = ref(false)
const agentProfile = ref<any>(null)

const newReview = reactive({
  rating: 5,
  comment: ''
})

// CAPTCHA / Anti-spam
const captchaRef = ref<InstanceType<typeof TurnstileCaptcha> | null>(null)
const captchaToken = ref('')

function onCaptchaVerified(token: string) {
  captchaToken.value = token
}

function onCaptchaError(error: string) {
  console.warn('CAPTCHA error:', error)
  toast.add({
    title: 'Verification Error',
    description: 'Please try again',
    color: 'warning'
  })
}

// Import TurnstileCaptcha component type
import type TurnstileCaptcha from '~/components/TurnstileCaptcha.vue'

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
    
    // Fetch reviews and agent data in parallel
    const [reviewsResult, agentResult] = await Promise.all([
      supabase
        .from('reviews')
        .select('*')
        .eq('agent_phone', e164)
        .eq('status', 'approved')
        .order('created_at', { ascending: false }),
      // Use server API to get agent data (handles schema and RLS properly)
      $fetch(`/api/agents/${encodeURIComponent(phone)}`)
    ]) as [any, { isVerified: boolean, agent: any }]

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

    // Handle Registration Status from API response
    isRegisteredAgent.value = agentResult.isVerified
    agentProfile.value = agentResult.agent

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
    
    // 2. Submit Review with anti-spam data
    const antiSpamData = captchaRef.value?.getAntiSpamData() || {}
    
    const body: any = {
      agent_phone: formatPhoneE164(phone),
      rating: newReview.rating,
      comment: newReview.comment,
      reviewer_phone: e164,
      ...antiSpamData
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
    captchaToken.value = ''
    captchaRef.value?.reset()
    fetchAgentData()
}

async function submitReview() {
  // Direct submission for authenticated users
  submitting.value = true
  try {
    // Get anti-spam data from captcha component
    const antiSpamData = captchaRef.value?.getAntiSpamData() || {}
    
    const body: any = {
      agent_phone: formatPhoneE164(phone),
      rating: newReview.rating,
      comment: newReview.comment,
      // Include anti-spam fields
      ...antiSpamData
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
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.4s ease-out forwards;
}

@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.95); }
  50% { transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}
.animate-bounce-in {
  animation: bounce-in 0.4s ease-out forwards;
}
</style>
