<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-black text-stone-900 dark:text-white tracking-tighter uppercase mb-2">Review Moderation</h1>
        <p class="text-stone-500 font-medium">Monitor and manage community feedback</p>
      </div>
    </div>

    <div class="bg-white dark:bg-stone-900 rounded-[32px] border border-stone-100 dark:border-stone-800 overflow-hidden shadow-xl shadow-stone-200/50 dark:shadow-none">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-stone-50 dark:bg-stone-950/50 border-b border-stone-100 dark:border-stone-800">
            <tr>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Reporter</th>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Agent</th>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Rating</th>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest w-1/3">Comment</th>
              <th class="p-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800">
            <tr v-for="review in reviews" :key="review.id" class="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
              <td class="p-6">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xs font-black text-emerald-600">
                        {{ review.reviewer_phone ? 'V' : 'A' }}
                    </div>
                    <div>
                        <p class="font-bold text-sm text-stone-900 dark:text-white">{{ review.reviewer_phone || 'Anonymous' }}</p>
                        <p class="text-[10px] text-stone-400">{{ review.reviewer_id ? 'App User' : 'Guest' }}</p>
                    </div>
                </div>
              </td>
              <td class="p-6 font-mono text-sm font-bold">{{ review.agent_phone }}</td>
              <td class="p-6">
                 <div class="flex text-amber-400">
                   <UIcon v-for="i in review.rating" :key="i" name="i-lucide-star" class="w-4 h-4 fill-current" />
                 </div>
              </td>
              <td class="p-6 text-sm text-stone-600 dark:text-stone-300 font-medium line-clamp-2 max-w-xs" :title="review.comment">
                  {{ review.comment }}
              </td>
              <td class="p-6 text-right">
                <button 
                  @click="deleteReview(review.id)" 
                  class="p-2 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  :disabled="deleting === review.id"
                >
                    <UIcon v-if="deleting === review.id" name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
                    <UIcon v-else name="i-lucide-trash-2" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="reviews.length === 0" class="p-12 text-center text-stone-400">
        <UIcon name="i-lucide-inbox" class="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p class="font-bold uppercase tracking-widest text-xs">No reviews found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const client = useSupabaseClient()
const reviews = ref<any[]>([])
const deleting = ref<number | null>(null)

async function fetchReviews() {
  const { data } = await client
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (data) reviews.value = data
}

async function deleteReview(id: number) {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    deleting.value = id
    const { error } = await client.from('reviews').delete().eq('id', id)
    
    if (!error) {
        reviews.value = reviews.value.filter(r => r.id !== id)
    } else {
        alert('Failed to delete: ' + error.message)
    }
    deleting.value = null
}

onMounted(() => {
    fetchReviews()
})
</script>
