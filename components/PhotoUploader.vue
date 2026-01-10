<template>
  <div class="space-y-4">
    <!-- Upload Area -->
    <div
      class="border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer"
      :class="[
        isDragging 
          ? 'border-uni-500 bg-uni-50 dark:bg-uni-900/10' 
          : 'border-gray-300 dark:border-gray-700 hover:border-uni-400 dark:hover:border-uni-500/50 bg-gray-50/50 dark:bg-gray-800/30'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="fileInput?.click()"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
          <span class="text-3xl">📷</span>
        </div>
        <div>
          <p class="font-bold text-gray-900 dark:text-white">
            Drag & drop photos here
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            or click to browse from your device
          </p>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />
        <UButton
          variant="soft"
          icon="i-lucide-upload"
          class="mt-2"
          @click.stop="fileInput?.click()"
        >
          Select Photos
        </UButton>
      </div>
    </div>
    
    <!-- Uploaded Photos Grid -->
    <div v-if="photos.length > 0" class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 shadow-sm"
      >
        <img
          :src="photo.preview"
          :alt="`Photo ${index + 1}`"
          class="w-full h-44 object-cover"
        />
        
        <!-- Overlay with actions -->
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <UButton
            color="error"
            variant="solid"
            size="sm"
            icon="i-lucide-trash-2"
            class="rounded-full"
            @click="removePhoto(index)"
          />
        </div>
        
        <!-- Description Input -->
        <div class="p-3 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
          <UInput
            v-model="photo.description"
            placeholder="Describe the defect..."
            size="sm"
            variant="none"
            class="bg-gray-50 dark:bg-gray-800 rounded-lg"
          />
        </div>
        
        <!-- Upload Progress -->
        <div v-if="photo.uploading" class="absolute inset-0 bg-white/90 dark:bg-gray-900/90 flex flex-col items-center justify-center p-4">
          <UProgress :value="photo.progress" class="w-full h-1" />
          <p class="text-[10px] font-bold text-uni-600 mt-2 uppercase tracking-widest">Uploading...</p>
        </div>
        
        <!-- Upload Status -->
        <div v-if="photo.uploaded" class="absolute top-2 left-2">
          <span class="bg-uni-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
            <UIcon name="i-lucide-check" class="w-3 h-3" />
            UPLOADED
          </span>
        </div>
      </div>
    </div>
    
    <!-- Error Message -->
    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      :description="error"
      icon="i-lucide-alert-circle"
    />
    
    <!-- Upload All Button -->
    <div v-if="photos.length > 0 && !allUploaded" class="flex justify-center pt-4">
      <UButton
        size="lg"
        :loading="uploading"
        icon="i-lucide-cloud-upload"
        class="min-w-[200px]"
        @click="uploadAll"
      >
        Upload {{ photos.length }} Photo{{ photos.length > 1 ? 's' : '' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PhotoItem {
  file: File
  preview: string
  description: string
  uploading: boolean
  uploaded: boolean
  progress: number
  url?: string
}

const props = defineProps<{
  reportId: string
}>()

const emit = defineEmits<{
  'uploaded': [urls: { url: string; description: string }[]]
}>()

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const fileInput = ref<HTMLInputElement>()
const photos = ref<PhotoItem[]>([])
const isDragging = ref(false)
const uploading = ref(false)
const error = ref<string | null>(null)

const allUploaded = computed(() => 
  photos.value.length > 0 && photos.value.every(p => p.uploaded)
)

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files) {
    addFiles(Array.from(input.files))
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

function addFiles(files: File[]) {
  const imageFiles = files.filter(f => f.type.startsWith('image/'))
  
  for (const file of imageFiles) {
    // Create preview URL
    const preview = URL.createObjectURL(file)
    
    photos.value.push({
      file,
      preview,
      description: '',
      uploading: false,
      uploaded: false,
      progress: 0,
    })
  }
}

function removePhoto(index: number) {
  const photo = photos.value[index]
  URL.revokeObjectURL(photo.preview)
  photos.value.splice(index, 1)
}

async function uploadAll() {
  uploading.value = true
  error.value = null
  
  const uploadedPhotosList: { url: string; description: string }[] = []
  
  for (const photo of photos.value) {
    if (photo.uploaded) {
      uploadedPhotosList.push({ url: photo.url!, description: photo.description })
      continue
    }
    
    photo.uploading = true
    
    try {
      // Generate unique filename using reportId (no user required)
      const ext = photo.file.name.split('.').pop()
      const filename = `anonymous/${props.reportId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase
        .storage
        .from('deposit-photos')
        .upload(filename, photo.file, {
          cacheControl: '3600',
          upsert: false,
        })
      
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('deposit-photos')
        .getPublicUrl(data.path)
      
      photo.url = urlData.publicUrl
      photo.uploaded = true
      photo.progress = 100
      
      uploadedPhotosList.push({ 
        url: urlData.publicUrl, 
        description: photo.description 
      })
    } catch (err: any) {
      error.value = `Failed to upload photo: ${err.message}`
      photo.uploading = false
      uploading.value = false
      return
    }
    
    photo.uploading = false
  }
  
  uploading.value = false
  emit('uploaded', uploadedPhotosList)
}

// Cleanup preview URLs on unmount
onUnmounted(() => {
  for (const photo of photos.value) {
    URL.revokeObjectURL(photo.preview)
  }
})
</script>
