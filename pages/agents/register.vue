<template>
  <div class="min-h-screen bg-[#F7F7F5] dark:bg-stone-950 transition-colors duration-300">
    <div class="relative z-10 flex flex-col min-h-screen">
      <main class="flex-grow px-6 py-8 sm:py-12">
        <div class="max-w-xl mx-auto">
          <!-- Hero Section -->
          <div class="text-center mb-10 animate-fade-in">
            <div class="w-16 h-16 bg-[#0075DE] rounded-lg flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-lucide-user-check" class="w-8 h-8 text-white" />
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold text-[#050505] dark:text-white mb-4 tracking-tight font-serif">
              Join RentBase as an Agent
            </h1>
            <p class="text-[#666666] dark:text-stone-400 font-medium max-w-md mx-auto">
              Build your reputation, get verified, and connect with renters who trust you.
            </p>
          </div>

          <!-- Benefits Cards -->
          <div class="grid gap-4 mb-10">
            <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-[#E1E1E1] dark:border-stone-800 flex items-start gap-4">
              <div class="w-10 h-10 bg-[#DBEDDB] dark:bg-emerald-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-shield-check" class="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div>
                <h3 class="font-medium text-[#050505] dark:text-white mb-1">Get Verified</h3>
                <p class="text-sm text-[#666666] dark:text-stone-400">Display a verified badge that builds trust with potential clients.</p>
              </div>
            </div>

            <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-[#E1E1E1] dark:border-stone-800 flex items-start gap-4">
              <div class="w-10 h-10 bg-[#D3E5EF] dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-star" class="w-5 h-5 text-[#0075DE] dark:text-blue-400" />
              </div>
              <div>
                <h3 class="font-medium text-[#050505] dark:text-white mb-1">Build Your Reputation</h3>
                <p class="text-sm text-[#666666] dark:text-stone-400">Collect reviews from satisfied clients. Your rating follows you.</p>
              </div>
            </div>

            <div class="bg-white dark:bg-stone-900 rounded-lg p-6 border border-[#E1E1E1] dark:border-stone-800 flex items-start gap-4">
              <div class="w-10 h-10 bg-[#E8DEEE] dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-users" class="w-5 h-5 text-purple-700 dark:text-purple-400" />
              </div>
              <div>
                <h3 class="font-medium text-[#050505] dark:text-white mb-1">Connect with Renters</h3>
                <p class="text-sm text-[#666666] dark:text-stone-400">Renters search for trusted agents on RentBase. Be discoverable.</p>
              </div>
            </div>
          </div>

          <!-- Registration Form -->
          <div class="bg-white dark:bg-stone-900 rounded-lg p-8 border border-[#E1E1E1] dark:border-stone-800 animate-fade-in">
            <h2 class="text-xl font-bold text-[#050505] dark:text-white mb-6 tracking-tight font-serif">Register as an Agent</h2>
            
            <form @submit.prevent="handleRegister" class="space-y-6">
              <!-- Phone Number -->
              <div>
                <label class="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2 block">Your Phone Number</label>
                <div class="flex gap-2">
                  <div class="flex items-center gap-2 px-4 py-3 bg-[#F7F7F5] dark:bg-stone-800 rounded-lg border border-[#E1E1E1] dark:border-stone-700">
                    <span class="text-lg">🇬🇭</span>
                    <span class="text-sm font-medium text-[#666666] dark:text-stone-400">+233</span>
                  </div>
                  <input
                    v-model="phoneNumber"
                    type="tel"
                    placeholder="24 123 4567"
                    required
                    class="flex-1 px-4 py-3 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-base font-medium text-[#050505] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all placeholder-[#999999]"
                  />
                </div>
              </div>

              <!-- Full Name -->
              <div>
                <label class="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2 block">Full Name</label>
                <input
                  v-model="fullName"
                  type="text"
                  placeholder="e.g., Kofi Mensah"
                  required
                  class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-base font-medium text-[#050505] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all placeholder-[#999999]"
                />
              </div>

              <!-- Agency/Company (Optional) -->
              <div>
                <label class="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2 block">Agency Name (Optional)</label>
                <input
                  v-model="agencyName"
                  type="text"
                  placeholder="e.g., ABC Real Estate"
                  class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-base font-medium text-[#050505] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all placeholder-[#999999]"
                />
              </div>

              <!-- Location -->
              <div>
                <label class="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-2 block">Primary Location</label>
                <select
                  v-model="location"
                  required
                  class="w-full px-4 py-3 bg-white dark:bg-stone-800 border border-[#E1E1E1] dark:border-stone-700 rounded-lg text-base font-medium text-[#050505] dark:text-white focus:ring-2 focus:ring-[#0075DE]/20 focus:border-[#0075DE] transition-all"
                >
                  <option value="">Select your area</option>
                  <option value="accra-central">Accra Central</option>
                  <option value="east-legon">East Legon</option>
                  <option value="airport-residential">Airport Residential</option>
                  <option value="cantonments">Cantonments</option>
                  <option value="osu">Osu</option>
                  <option value="la">La</option>
                  <option value="tema">Tema</option>
                  <option value="spintex">Spintex</option>
                  <option value="kasoa">Kasoa</option>
                  <option value="kumasi">Kumasi</option>
                  <option value="takoradi">Takoradi</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Error -->
              <UAlert
                v-if="error"
                color="error"
                variant="soft"
                :description="error"
                icon="i-lucide-alert-circle"
              />

              <!-- Submit -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3.5 bg-[#0075DE] text-white font-medium rounded-lg hover:bg-[#005BAB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-else>Register Now - It's Free</span>
              </button>
            </form>

            <p class="text-xs text-[#666666] text-center mt-6">
              By registering, you agree to our <a href="#" class="text-[#0075DE] hover:underline">Terms of Service</a>
            </p>
          </div>

          <!-- Already have account -->
          <div class="text-center mt-8">
            <p class="text-[#666666] dark:text-stone-400 text-sm">
              Already registered? 
              <NuxtLink to="/auth/login" class="text-[#0075DE] font-medium hover:underline">Sign In</NuxtLink>
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const phoneNumber = ref('')
const fullName = ref('')
const agencyName = ref('')
const location = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function handleRegister() {
  loading.value = true
  error.value = null

  try {
    // For now, redirect to login with agent role intent
    // In a full implementation, this would create an agent profile
    router.push({
      path: '/auth/login',
      query: {
        role: 'agent',
        phone: phoneNumber.value,
        name: fullName.value
      }
    })
  } catch (e: any) {
    error.value = e.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
