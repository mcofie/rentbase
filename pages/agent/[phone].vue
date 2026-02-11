<template>
  <main class="max-w-4xl mx-auto px-6 py-12 md:py-16 animate-fade-in">
      
      <!-- Breadcrumbs (Notion Style) -->
      <div class="flex items-center gap-2 text-xs mb-12 text-[#787774] dark:text-[#9B9B9B]">
        <NuxtLink to="/" class="hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] px-1.5 py-0.5 rounded transition-colors">RentBase</NuxtLink>
        <span class="opacity-30">/</span>
        <NuxtLink to="/agent" class="hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] px-1.5 py-0.5 rounded transition-colors">Agents</NuxtLink>
        <span class="opacity-30">/</span>
        <span class="truncate max-w-[150px] font-medium">{{ agentProfile?.full_name || phone }}</span>
      </div>
      
      <!-- Profile Header (Notion Style) -->
      <div class="group relative mb-12">
        <!-- Large Avatar/Emoji representation -->
        <div class="mb-6 text-7xl select-none">
          {{ isRegisteredAgent ? '👨‍💼' : '👤' }}
        </div>
        
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-4xl md:text-5xl font-bold text-[#37352F] dark:text-[#FFFFFF] font-serif tracking-tight">
              {{ agentProfile?.full_name || formattedPhone }}
            </h1>
            
            <!-- Verified Badge -->
            <div v-if="isRegisteredAgent" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#DBEDDB] dark:bg-[#1C3829] text-[#1C3829] dark:text-[#DBEDDB] text-[10px] font-bold uppercase tracking-wider">
              <UIcon name="i-lucide-badge-check" class="w-3.5 h-3.5" />
              Verified
            </div>
            <div v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFE2DD] dark:bg-[#5D1715] text-[#5D1715] dark:text-[#FFE2DD] text-[10px] font-bold uppercase tracking-wider">
              Unregistered
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#787774] dark:text-[#9B9B9B]">
            <div class="flex items-center gap-2 text-sm font-mono">
              <UIcon name="i-lucide-phone" class="w-4 h-4 opacity-70" />
              {{ formattedPhone }}
            </div>
            <div v-if="agentProfile?.location" class="flex items-center gap-2 text-sm capitalize">
              <UIcon name="i-lucide-map-pin" class="w-4 h-4 opacity-70" />
              {{ agentProfile.location.replace('-', ' ') }}
            </div>
            <div v-if="agentProfile?.agency_name" class="flex items-center gap-2 text-sm">
              <UIcon name="i-lucide-building" class="w-4 h-4 opacity-70" />
              {{ agentProfile.agency_name }}
            </div>
          </div>
        </div>

        <!-- Notion style underline -->
        <div class="mt-8 h-px bg-[#E1E1E1] dark:bg-[#2F2F2F] w-full"></div>
      </div>

      <!-- Quick Actions Bar -->
      <div class="flex flex-wrap items-center gap-3 mb-12">
        <button 
          @click="showReviewModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-[#F7F7F5] dark:bg-[#2C2C2C] hover:bg-[#EFEFEF] dark:hover:bg-[#37352F] text-[#37352F] dark:text-[#D4D4D4] rounded-md text-sm font-medium transition-colors border border-[#E1E1E1] dark:border-[#2F2F2F]"
        >
          <UIcon name="i-lucide-message-square-plus" class="w-4 h-4 text-[#91918E]" />
          Write a Report
        </button>
        
        <button 
          v-if="!isRegisteredAgent"
          @click="invokeInviteModal"
          class="flex items-center gap-2 px-4 py-2 hover:bg-[#F7F7F5] dark:hover:bg-[#2C2C2C] text-[#37352F] dark:text-[#D4D4D4] rounded-md text-sm font-medium transition-colors border border-[#E1E1E1] dark:border-[#2F2F2F]"
        >
          <UIcon name="i-lucide-send" class="w-4 h-4 text-[#91918E]" />
          Invite to Platform
        </button>

        <button 
          @click="showReportModal = true"
          class="flex items-center gap-2 px-4 py-2 hover:bg-[#FFE2DD] hover:text-[#5D1715] dark:hover:bg-red-900/20 dark:hover:text-red-400 text-[#787774] dark:text-[#9B9B9B] rounded-md text-sm font-medium transition-colors border border-transparent"
        >
          <UIcon name="i-lucide-flag" class="w-4 h-4 opacity-60" />
          Report Issue
        </button>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        
        <!-- Trust Reputation Score -->
        <div class="md:col-span-2 space-y-8">
          <section>
            <h3 class="text-xs font-bold text-[#91918E] uppercase tracking-widest mb-4">Community Reputation</h3>
            
            <div class="bg-white dark:bg-[#191919] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div class="text-center">
                <div class="text-5xl font-serif font-bold text-[#37352F] dark:text-white mb-1">
                  {{ (summary?.average_rating || 0) > 0 ? summary!.average_rating.toFixed(1) : '-' }}
                </div>
                <div class="flex gap-0.5 justify-center mb-2">
                  <UIcon v-for="i in 5" :key="i" name="i-lucide-star" class="w-4 h-4" :class="i <= Math.round(summary?.average_rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-[#E1E1E1] dark:text-[#2F2F2F]'" />
                </div>
                <p class="text-[10px] font-bold text-[#91918E] uppercase tracking-wider">Average Rating</p>
              </div>

              <div class="h-px md:h-12 w-full md:w-px bg-[#E1E1E1] dark:bg-[#2F2F2F]"></div>

              <div class="flex-1 grid grid-cols-2 gap-4 text-center md:text-left">
                <div>
                  <div class="text-2xl font-bold text-[#37352F] dark:text-white">{{ summary?.total_reviews || 0 }}</div>
                  <p class="text-[10px] font-bold text-[#91918E] uppercase tracking-wider">Total Reports</p>
                </div>
                <div>
                  <div :class="['text-sm font-bold capitalize px-2 py-0.5 rounded inline-block', getTrustLevelClass(summary?.trust_level || 'none')]">
                    {{ (summary?.average_rating || 0) >= 4 ? 'Highly Trusted' : (summary?.average_rating || 0) >= 2.5 ? 'Neutral' : (summary?.average_rating || 0) > 0 ? 'Poor Reputation' : 'No Data' }}
                  </div>
                  <p class="text-[10px] font-bold text-[#91918E] uppercase tracking-wider mt-1">Trust Status</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Reviews List -->
          <section id="reviews">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xs font-bold text-[#91918E] uppercase tracking-widest">Recent Feedback</h3>
              <div class="h-px flex-1 mx-4 bg-[#E1E1E1] dark:bg-[#2F2F2F]"></div>
            </div>

            <div v-if="loading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="h-32 bg-[#F7F7F5] dark:bg-[#202020] rounded-xl animate-pulse"></div>
            </div>

            <div v-else-if="reviews.length > 0" class="space-y-4">
              <div v-for="review in paginatedReviews" :key="review.id" class="p-6 bg-white dark:bg-[#191919] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-xl hover:bg-[#F7F7F5] dark:hover:bg-[#202020] transition-colors group">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-[#EFEFEF] dark:bg-[#2C2C2C] flex items-center justify-center text-xs font-bold">
                      {{ (review as any).reviewer_phone ? '✓' : 'A' }}
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-sm font-bold text-[#37352F] dark:text-[#D4D4D4]">
                          {{ (review as any).reviewer_phone ? 'Verified Client' : 'Anonymous' }}
                        </span>
                        <UIcon v-if="(review as any).reviewer_phone" name="i-lucide-shield-check" class="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <p class="text-[10px] text-[#91918E]">{{ formatDate(review.created_at) }}</p>
                    </div>
                  </div>
                  <div class="flex gap-0.5">
                    <UIcon v-for="i in 5" :key="i" name="i-lucide-star" class="w-3 h-3" :class="i <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-[#E1E1E1] dark:text-[#2F2F2F]'" />
                  </div>
                </div>
                <p class="text-sm text-[#37352F] dark:text-[#D4D4D4] leading-relaxed italic opacity-90">
                  "{{ review.comment }}"
                </p>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 pt-4">
                <button 
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="p-2 hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] rounded-md disabled:opacity-30 transition-colors"
                >
                  <UIcon name="i-lucide-chevron-left" class="w-5 h-5" />
                </button>
                <span class="text-xs text-[#787774] px-4 font-mono">Page {{ currentPage }} of {{ totalPages }}</span>
                <button 
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="p-2 hover:bg-[#EFEFEF] dark:hover:bg-[#2C2C2C] rounded-md disabled:opacity-30 transition-colors"
                >
                  <UIcon name="i-lucide-chevron-right" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div v-else class="py-12 text-center bg-[#F7F7F5] dark:bg-[#202020] rounded-xl border border-dashed border-[#E1E1E1] dark:border-[#2F2F2F]">
              <div class="text-3xl mb-3 opacity-50">📭</div>
              <p class="text-[#787774] text-sm">No reviews yet for this agent.</p>
              <button @click="showReviewModal = true" class="text-sm font-bold text-[#0075DE] hover:underline mt-2">Submit the first one</button>
            </div>
          </section>
        </div>

        <!-- Sidebar (Notion Style Info) -->
        <div class="space-y-8">
          <section>
            <h3 class="text-xs font-bold text-[#91918E] uppercase tracking-widest mb-4">About Agent</h3>
            <div class="space-y-4 text-sm">
              <div v-if="agentProfile?.agency_name" class="flex items-start gap-3">
                <UIcon name="i-lucide-briefcase" class="w-4 h-4 mt-0.5 text-[#91918E]" />
                <div>
                  <p class="text-[#787774] text-xs">Agency</p>
                  <p class="font-medium text-[#37352F] dark:text-[#D4D4D4]">{{ agentProfile.agency_name }}</p>
                </div>
              </div>
              <div v-if="agentProfile?.location" class="flex items-start gap-3">
                <UIcon name="i-lucide-navigation" class="w-4 h-4 mt-0.5 text-[#91918E]" />
                <div>
                  <p class="text-[#787774] text-xs">Primary Area</p>
                  <p class="font-medium text-[#37352F] dark:text-[#D4D4D4] capitalize">{{ agentProfile.location.replace('-', ' ') }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-calendar" class="w-4 h-4 mt-0.5 text-[#91918E]" />
                <div>
                  <p class="text-[#787774] text-xs">Registered Since</p>
                  <p class="font-medium text-[#37352F] dark:text-[#D4D4D4]">{{ agentProfile?.created_at ? formatDate(agentProfile.created_at) : 'N/A' }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <h4 class="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">RentBase Guard</h4>
            <p class="text-xs text-blue-600/80 dark:text-blue-400/60 leading-relaxed">
              We verify agent identities to prevent rental fraud. If you experience issues with this line, please report it immediately.
            </p>
          </section>
        </div>

      </div>
    </main>

    <!-- Modals -->
    <UModal v-model:open="showReviewModal">
      <template #content>
        <div class="p-8">
          <div class="text-center mb-8">
            <div class="text-5xl mb-4">📝</div>
            <h3 class="text-2xl font-bold font-serif text-[#37352F] dark:text-white">Write a Report</h3>
            <p class="text-[#787774] dark:text-[#9B9B9B]">How was your experience with {{ agentProfile?.full_name || phone }}?</p>
          </div>

          <div v-if="reviewStep === 1" class="space-y-6">
            <div class="flex justify-center gap-3">
              <button v-for="i in 5" :key="i" @click="newReview.rating = i" class="transition-transform active:scale-95">
                <UIcon name="i-lucide-star" class="w-10 h-10" :class="i <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-[#EFEFEF] dark:text-[#2C2C2C]'" />
              </button>
            </div>

            <textarea 
              v-model="newReview.comment"
              placeholder="Provide specific details about your interaction, agreement, or any issues faced..."
              rows="5"
              class="w-full bg-[#F7F7F5] dark:bg-[#202020] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-xl p-4 text-sm focus:ring-1 focus:ring-[#0075DE] outline-none transition-all resize-none"
            ></textarea>

            <TurnstileCaptcha ref="captchaRef" class="hidden" @verified="onCaptchaVerified" @error="onCaptchaError" />

            <button 
              @click="proceedToVerification" 
              class="w-full py-3.5 bg-[#37352F] dark:bg-white text-white dark:text-[#37352F] font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Continue
            </button>
          </div>

          <!-- Step 2 Verification -->
          <div v-else class="space-y-6">
            <div v-if="!otpSent" class="space-y-4">
              <input v-model="reviewerPhone" type="tel" placeholder="Enter your phone number" class="w-full py-4 px-4 bg-[#F7F7F5] dark:bg-[#202020] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-xl text-center text-lg font-bold font-mono focus:ring-1 focus:ring-[#0075DE] outline-none" />
              <button :disabled="!reviewerPhone || sendingOtp" @click="sendOtp" class="w-full py-3.5 bg-[#37352F] dark:bg-white text-white dark:text-[#37352F] font-bold rounded-xl transition-all disabled:opacity-50">
                {{ sendingOtp ? 'Sending...' : 'Send Verification Code' }}
              </button>
            </div>
            
            <div v-else class="space-y-4 text-center">
              <p class="text-[10px] font-bold text-[#91918E] uppercase tracking-widest">Verify Your Report</p>
              <input v-model="otpCode" type="text" placeholder="0000" maxlength="4" class="w-full py-4 bg-[#F7F7F5] dark:bg-[#202020] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-xl text-center text-4xl font-bold font-mono tracking-[0.5em] focus:ring-1 focus:ring-[#0075DE] outline-none" />
              
              <button @click="verifyAndSubmit" :disabled="otpCode.length !== 4 || submitting" class="w-full py-3.5 bg-[#6A9A78] text-white font-bold rounded-xl shadow-lg shadow-[#6A9A78]/20 hover:bg-[#5a8a68] transition-all disabled:opacity-50">
                {{ submitting ? 'Processing...' : 'Verify & Publish Report' }}
              </button>
              <button @click="otpSent = false" class="text-xs text-[#91918E] hover:underline">Change phone number</button>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Invite Modal -->
    <UModal v-model:open="showInviteModal">
      <template #content>
        <div class="p-8 text-center">
          <div class="text-5xl mb-4">🚀</div>
          <h3 class="text-2xl font-bold font-serif text-[#37352F] dark:text-white mb-2">Invite Agent</h3>
          <p class="text-[#787774] dark:text-[#9B9B9B] mb-8">This agent isn't on the platform yet. Help them build their reputation.</p>
          
          <div class="space-y-4">
            <input v-model="inviterName" placeholder="Your Name (Optional)" class="w-full px-4 py-3 bg-[#F7F7F5] dark:bg-[#202020] border border-[#E1E1E1] dark:border-[#2F2F2F] rounded-xl focus:ring-1 focus:ring-[#0075DE] outline-none transition-all" />
            
            <div class="p-4 bg-[#F7F7F5]/50 dark:bg-[#202020]/50 rounded-xl border border-dashed border-[#E1E1E1] dark:border-[#2F2F2F] text-left">
              <p class="text-[10px] text-[#91918E] uppercase tracking-wider mb-2">Message Preview</p>
              <p class="text-xs font-mono text-[#787774] leading-relaxed italic">{{ inviteSmsMessage }}</p>
            </div>

            <div class="flex flex-col gap-2 pt-4">
              <button @click="sendInviteSms" :disabled="sendingInvite" class="w-full py-3.5 bg-[#37352F] dark:bg-white text-white dark:text-[#37352F] font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <UIcon v-if="sendingInvite" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
                <span>Send SMS Invite</span>
              </button>
              <button @click="showInviteModal = false" class="py-2.5 text-xs text-[#91918E] hover:underline font-medium">Dismiss</button>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <AuthModal v-model="showAuthModal" @success="handleAuthSuccess" />
    <ReportAgentModal v-model="showReportModal" :agent-phone="phone" />

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

const phone = computed(() => route.params.phone as string)
const formattedPhone = computed(() => formatPhoneDisplay(phone.value))

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
  
  return `${referral}RentBase!\n\nBuild your reputation as a trusted agent. Register free:\n${baseUrl}/agents/register\n\n- RentBase 🏠`
})

function invokeInviteModal() {
  showInviteModal.value = true
}

async function sendInviteSms() {
  sendingInvite.value = true
  try {
    const formatted = formatPhoneE164(phone.value)
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

async function fetchAgentData() {
  if (!phone.value) return
  
  loading.value = true
  try {
    const e164 = formatPhoneE164(phone.value)
    
    // Fetch reviews and agent data in parallel
    const [reviewsResult, agentResult] = await Promise.all([
      supabase
        .from('reviews')
        .select('*')
        .eq('agent_phone', e164)
        .eq('status', 'approved')
        .order('created_at', { ascending: false }),
      // Use server API to get agent data (handles schema and RLS properly)
      $fetch(`/api/agents/${encodeURIComponent(phone.value)}`)
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
      summary.value = {
        agent_phone: e164,
        total_reviews: 0,
        average_rating: 0,
        trust_level: 'red' // Default to red or similar for 'No Data' context
      }
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
    await submitReview(e164)
  } catch (err: any) {
    toast.add({ title: 'Validation failed', description: err.message || err.statusMessage, color: 'error' })
  } finally {
    submitting.value = false
  }
}

async function submitReview(verifiedPhone?: string) {
  submitting.value = true
  try {
    const antiSpamData = captchaRef.value?.getAntiSpamData() || {}
    
    const body: any = {
      agent_phone: formatPhoneE164(phone.value),
      rating: newReview.rating,
      comment: newReview.comment,
      ...antiSpamData
    }

    if (verifiedPhone) {
      body.reviewer_phone = verifiedPhone
    } else if (user.value) {
      body.reviewer_id = user.value.id
    }

    await $fetch('/api/reviews/submit', {
      method: 'POST',
      body
    })
    
    toast.add({ title: 'Report submitted!', description: 'It will be visible after brief moderation.', color: 'success' })
    resetReviewForm()
  } catch (err: any) {
    toast.add({ title: 'Submission failed', description: err.message || err.statusMessage, color: 'error' })
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

function handleAuthSuccess() {
  showAuthModal.value = false
  submitReview()
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short',
    year: 'numeric'
  })
}

function getTrustLevelClass(level: string): string {
  switch (level) {
    case 'green': return 'bg-[#DBEDDB] text-[#1C3829] dark:bg-[#1C3829] dark:text-[#DBEDDB]'
    case 'yellow': return 'bg-[#FDECC8] text-[#402C1B] dark:bg-[#402C1B] dark:text-[#FDECC8]'
    case 'red': return 'bg-[#FFE2DD] text-[#5D1715] dark:bg-[#5D1715] dark:text-[#FFE2DD]'
    default: return 'bg-[#F7F7F5] text-[#787774] dark:bg-[#2C2C2C] dark:text-[#9B9B9B]'
  }
}

watch(() => route.params.phone, () => {
  fetchAgentData()
}, { immediate: true })
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
