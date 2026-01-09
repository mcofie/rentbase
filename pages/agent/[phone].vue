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
                <div class="w-20 h-20 bg-stone-50 dark:bg-stone-800 rounded-3xl flex items-center justify-center shadow-inner">
                  <span class="text-4xl">👤</span>
                </div>
                <div>
                   <div class="flex items-center justify-center md:justify-start gap-4 mb-2">
                     <h1 class="text-4xl font-black text-stone-900 dark:text-white tracking-tighter">{{ formattedPhone }}</h1>
                     <button @click="copyAgentPhone" class="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors text-stone-300 hover:text-emerald-500">
                       <UIcon name="i-lucide-copy" class="w-5 h-5" />
                     </button>
                   </div>
                   <p class="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.3em]">Protocol Verified Line</p>
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
                    <div v-else class="h-10 w-40 bg-stone-100 dark:bg-stone-800 rounded-full animate-pulse mx-auto md:ml-auto"></div>
                 </div>
                 <button 
                  @click="showReviewModal = true"
                  class="px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black rounded-full hover:scale-105 transition-all text-sm uppercase tracking-widest"
                 >
                   Write Report
                 </button>
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
            <div v-for="review in reviews" :key="review.id" class="bg-white dark:bg-stone-900 p-10 rounded-[48px] border border-stone-100 dark:border-stone-800 group hover:border-emerald-500/30 transition-all">
               <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-1">
                    <UIcon 
                      v-for="i in 5" 
                      :key="i" 
                      name="i-lucide-star" 
                      class="w-5 h-5"
                      :class="i <= review.rating ? 'text-emerald-500 fill-emerald-500' : 'text-stone-100 dark:text-stone-800'"
                    />
                  </div>
                  <span class="text-[10px] font-black text-stone-400 uppercase tracking-widest">{{ new Date(review.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }}</span>
               </div>
               <p class="text-stone-700 dark:text-stone-300 text-lg font-medium leading-relaxed mb-8">{{ review.comment || 'No report provided.' }}</p>
               <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center justify-center text-xs">👤</div>
                  <span class="text-[10px] font-black text-stone-400 uppercase tracking-widest">Verified Witness</span>
               </div>
            </div>
          </div>

          <div v-else class="text-center py-20 bg-white dark:bg-stone-900 rounded-[48px] border border-stone-200 dark:border-stone-800 border-dashed">
              <p class="text-stone-400 font-bold mb-6">No reports found on this line.</p>
              <button 
                @click="showReviewModal = true"
                class="text-emerald-500 font-black uppercase tracking-widest text-xs hover:underline"
              >
                Secure first report
              </button>
          </div>
        </div>
      </main>

      <!-- Review Modal (Minimal) -->
      <UModal v-model="showReviewModal">
        <div class="p-10 text-balance">
          <div class="mb-10 text-center">
            <h3 class="text-3xl font-black text-stone-900 dark:text-white tracking-tighter mb-2 uppercase">Submit Report</h3>
            <p class="text-stone-500 dark:text-stone-400 font-medium">Interaction with {{ formattedPhone }}</p>
          </div>

          <form @submit.prevent="submitReview" class="space-y-10">
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
                :loading="submitting"
               >
                 <UIcon v-if="submitting" name="i-lucide-loader-2" class="animate-spin" />
                 <span>Push to Protocol</span>
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
      </UModal>
      
      <footer class="py-12 border-t border-stone-200 dark:border-stone-800 mt-auto opacity-40">
         <div class="max-w-5xl mx-auto px-6 flex items-center justify-between">
            <span class="font-bold text-stone-900 dark:text-white tracking-widest text-[10px] uppercase">RentBase Intelligence</span>
            <p class="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em]">© 2025</p>
         </div>
      </footer>

      <AuthModal v-model="showAuthModal" @success="handleAuthSuccess" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPhoneDisplay, formatPhoneE164 } from '~/utils/formatPhone'
import type { Review, AgentReviewSummary } from '~/types'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const supabase = useSupabaseClient()
const toast = useToast()

const phone = route.params.phone as string
const formattedPhone = computed(() => formatPhoneDisplay(phone))

const loading = ref(true)
const submitting = ref(false)
const showReviewModal = ref(route.query.review === 'true')
const showAuthModal = ref(false)

const reviews = ref<Review[]>([])
const summary = ref<AgentReviewSummary | null>(null)

const newReview = reactive({
  rating: 5,
  comment: ''
})

function copyAgentPhone() {
  navigator.clipboard.writeText(phone)
  toast.add({ title: 'Line Copied', color: 'success' })
}

async function fetchAgentData() {
  loading.value = true
  try {
    const e164 = formatPhoneE164(phone)
    
    const { data: reviewsData, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('agent_phone', e164)
      .order('created_at', { ascending: false })

    if (error) throw error
    reviews.value = reviewsData || []

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
  } catch (err: any) {
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

async function submitReview() {
  if (!user.value) {
    showAuthModal.value = true
    return
  }

  submitting.value = true
  try {
    const { error } = await (supabase
      .from('reviews') as any)
      .insert({
        agent_phone: formatPhoneE164(phone),
        reviewer_id: user.value.id,
        rating: newReview.rating,
        comment: newReview.comment
      }) as { error: any }

    if (error) throw error
    
    toast.add({ title: 'Report submitted!', color: 'success' })
    showReviewModal.value = false
    newReview.rating = 5
    newReview.comment = ''
    fetchAgentData()
  } catch (err: any) {
    toast.add({ title: 'Submission failed', description: err.message, color: 'error' })
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
</style>
