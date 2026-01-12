<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
    <div class="relative z-10 flex flex-col min-h-screen">
      <!-- Header -->
      <nav class="max-w-5xl mx-auto w-full px-6 py-8 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <span class="text-white text-xl">⚡</span>
          </div>
          <span class="text-2xl font-black text-stone-900 dark:text-white tracking-tighter">RentBase</span>
        </NuxtLink>
        <ColorSchemeButton />
      </nav>

      <main class="flex-grow px-6 py-8 sm:py-12">
        <div class="max-w-xl mx-auto">
          <!-- Hero Section -->
          <div class="text-center mb-10 animate-fade-in">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
              <UIcon name="i-lucide-user-check" class="w-10 h-10 text-white" />
            </div>
            <h1 class="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white mb-4 tracking-tighter">
              Join RentBase as an Agent
            </h1>
            <p class="text-stone-500 dark:text-stone-400 font-medium max-w-md mx-auto">
              Build your reputation, get verified, and connect with renters who trust you.
            </p>
          </div>

          <!-- Benefits Cards -->
          <div class="grid gap-4 mb-10">
            <div class="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 flex items-start gap-4">
              <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-shield-check" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 class="font-bold text-stone-900 dark:text-white mb-1">Get Verified</h3>
                <p class="text-sm text-stone-500 dark:text-stone-400">Display a verified badge that builds trust with potential clients.</p>
              </div>
            </div>

            <div class="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-star" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="font-bold text-stone-900 dark:text-white mb-1">Build Your Reputation</h3>
                <p class="text-sm text-stone-500 dark:text-stone-400">Collect reviews from satisfied clients. Your rating follows you.</p>
              </div>
            </div>

            <div class="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 flex items-start gap-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <UIcon name="i-lucide-users" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 class="font-bold text-stone-900 dark:text-white mb-1">Connect with Renters</h3>
                <p class="text-sm text-stone-500 dark:text-stone-400">Renters search for trusted agents on RentBase. Be discoverable.</p>
              </div>
            </div>
          </div>

          <!-- Registration Form -->
          <div class="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800 animate-fade-in">
            <h2 class="text-xl font-black text-stone-900 dark:text-white mb-6 tracking-tight">Register as an Agent</h2>
            
            <form @submit.prevent="handleRegister" class="space-y-6">
              <!-- Phone Number -->
              <div>
                <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Your Phone Number</label>
                <div class="flex gap-2">
                  <div class="flex items-center gap-2 px-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
                    <span class="text-lg">🇬🇭</span>
                    <span class="text-sm font-bold text-stone-600 dark:text-stone-400">+233</span>
                  </div>
                  <input
                    v-model="phoneNumber"
                    type="tel"
                    placeholder="24 123 4567"
                    required
                    class="flex-1 px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl text-base font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-stone-300"
                  />
                </div>
              </div>

              <!-- Full Name -->
              <div>
                <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Full Name</label>
                <input
                  v-model="fullName"
                  type="text"
                  placeholder="e.g., Kofi Mensah"
                  required
                  class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl text-base font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-stone-300"
                />
              </div>

              <!-- Agency/Company (Optional) -->
              <div>
                <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Agency Name (Optional)</label>
                <input
                  v-model="agencyName"
                  type="text"
                  placeholder="e.g., ABC Real Estate"
                  class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl text-base font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-stone-300"
                />
              </div>

              <!-- Location -->
              <div>
                <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Primary Location</label>
                <select
                  v-model="location"
                  required
                  class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl text-base font-medium text-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
              <UButton
                type="submit"
                block
                size="xl"
                :loading="loading"
                class="rounded-2xl font-black py-4"
              >
                Register Now - It's Free
              </UButton>
            </form>

            <p class="text-xs text-stone-400 text-center mt-6">
              By registering, you agree to our <a href="#" class="text-emerald-500 hover:underline">Terms of Service</a>
            </p>
          </div>

          <!-- Already have account -->
          <div class="text-center mt-8">
            <p class="text-stone-500 dark:text-stone-400 text-sm">
              Already registered? 
              <NuxtLink to="/auth/login" class="text-emerald-500 font-bold hover:underline">Sign In</NuxtLink>
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
