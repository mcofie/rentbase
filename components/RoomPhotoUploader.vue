<template>
  <div class="room-photo-uploader">
    <!-- Room Selector -->
    <div class="mb-6">
      <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 block">Select Room</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="room in rooms"
          :key="room.id"
          @click="selectedRoom = room.id"
          :class="[
            'px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2',
            selectedRoom === room.id
              ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          ]"
        >
          <span>{{ room.icon }}</span>
          <span>{{ room.name }}</span>
          <span v-if="getPhotoCountForRoom(room.id) > 0" class="w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
            {{ getPhotoCountForRoom(room.id) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Upload Section for Selected Room -->
    <div class="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-3xl">{{ currentRoom.icon }}</span>
        <div>
          <h3 class="font-black text-stone-900 dark:text-white">{{ currentRoom.name }}</h3>
          <p class="text-xs text-stone-500">{{ getPhotoCountForRoom(selectedRoom) }} photos uploaded</p>
        </div>
      </div>

      <!-- Upload Area -->
      <div
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="handleDrop"
        :class="[
          'border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer',
          dragOver 
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'border-stone-200 dark:border-stone-700 hover:border-emerald-300'
        ]"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileSelect"
        />
        
        <div v-if="uploading" class="flex flex-col items-center">
          <div class="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
          <p class="text-sm text-stone-500">Uploading {{ uploadProgress }}%...</p>
        </div>
        <div v-else>
          <UIcon name="i-lucide-upload-cloud" class="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p class="text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">
            Drop photos here or click to upload
          </p>
          <p class="text-xs text-stone-400">
            Take photos of any defects in {{ currentRoom.name.toLowerCase() }}
          </p>
        </div>
      </div>

      <!-- Camera Button (Mobile) -->
      <button
        @click="triggerCamera"
        class="w-full mt-4 py-4 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 sm:hidden"
      >
        <UIcon name="i-lucide-camera" class="w-5 h-5" />
        Take Photo
      </button>
      <input
        ref="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
        @change="handleFileSelect"
      />
    </div>

    <!-- Photos Grid by Room -->
    <div v-if="allPhotos.length > 0" class="space-y-6">
      <div v-for="room in roomsWithPhotos" :key="room.id" class="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ room.icon }}</span>
            <h4 class="font-black text-stone-900 dark:text-white">{{ room.name }}</h4>
            <span class="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold rounded-full">
              {{ getPhotosForRoom(room.id).length }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            v-for="(photo, index) in getPhotosForRoom(room.id)"
            :key="photo.id"
            class="group relative rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800"
          >
            <img
              :src="photo.url"
              :alt="`${room.name} photo ${index + 1}`"
              class="w-full h-32 object-cover"
            />
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                @click="editDescription(photo)"
                class="p-2 bg-white rounded-lg hover:bg-stone-100 transition-colors"
              >
                <UIcon name="i-lucide-pencil" class="w-4 h-4 text-stone-700" />
              </button>
              <button
                @click="deletePhoto(photo)"
                class="p-2 bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors"
              >
                <UIcon name="i-lucide-trash-2" class="w-4 h-4 text-white" />
              </button>
            </div>

            <!-- Description Badge -->
            <div v-if="photo.description" class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <p class="text-white text-[10px] truncate">{{ photo.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Total Photos Summary -->
    <div v-if="allPhotos.length > 0" class="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-images" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span class="text-sm font-bold text-emerald-700 dark:text-emerald-300">
            {{ allPhotos.length }} photos across {{ roomsWithPhotos.length }} rooms
          </span>
        </div>
        <button
          @click="$emit('uploaded', allPhotos)"
          class="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          Save & Continue
        </button>
      </div>
    </div>

    <!-- Description Modal -->
    <div v-if="showDescriptionModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div class="bg-white dark:bg-stone-900 rounded-2xl p-6 max-w-md w-full">
        <h3 class="font-black text-stone-900 dark:text-white mb-4">Add Description</h3>
        <textarea
          v-model="editingPhoto.description"
          placeholder="Describe the defect or condition..."
          rows="3"
          class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm resize-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        ></textarea>
        <div class="flex gap-3 mt-4">
          <button
            @click="showDescriptionModal = false"
            class="flex-1 py-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveDescription"
            class="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  reportId: string
}>()

const emit = defineEmits<{
  'uploaded': [photos: Photo[]]
}>()

interface Photo {
  id: string
  url: string
  room: string
  description: string
}

const supabase = useSupabaseClient()

const rooms = [
  { id: 'living', name: 'Living Room', icon: '🛋️' },
  { id: 'bedroom', name: 'Bedroom', icon: '🛏️' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
  { id: 'bathroom', name: 'Bathroom', icon: '🚿' },
  { id: 'exterior', name: 'Exterior', icon: '🏠' },
  { id: 'other', name: 'Other', icon: '📦' },
]

const selectedRoom = ref('living')
const allPhotos = ref<Photo[]>([])
const dragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const showDescriptionModal = ref(false)
const editingPhoto = ref<Photo | null>(null)

const fileInput = ref<HTMLInputElement | null>(null)
const cameraInput = ref<HTMLInputElement | null>(null)

const currentRoom = computed(() => {
  return rooms.find(r => r.id === selectedRoom.value) || rooms[0]
})

const roomsWithPhotos = computed(() => {
  return rooms.filter(room => getPhotosForRoom(room.id).length > 0)
})

function getPhotosForRoom(roomId: string): Photo[] {
  return allPhotos.value.filter(p => p.room === roomId)
}

function getPhotoCountForRoom(roomId: string): number {
  return getPhotosForRoom(roomId).length
}

function triggerFileInput() {
  fileInput.value?.click()
}

function triggerCamera() {
  cameraInput.value?.click()
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    await uploadFiles(Array.from(files))
  }
  // Reset input
  if (target) target.value = ''
}

async function handleDrop(event: DragEvent) {
  dragOver.value = false
  const files = event.dataTransfer?.files
  if (files) {
    await uploadFiles(Array.from(files))
  }
}

async function uploadFiles(files: File[]) {
  uploading.value = true
  uploadProgress.value = 0

  const total = files.length
  let completed = 0

  for (const file of files) {
    try {
      // Create unique filename
      const ext = file.name.split('.').pop()
      const filename = `${props.reportId}/${selectedRoom.value}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('deposit-photos')
        .upload(filename, file)

      if (error) {
        console.error('Upload error:', error)
        continue
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('deposit-photos')
        .getPublicUrl(filename)

      // Add to photos array
      allPhotos.value.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        url: urlData.publicUrl,
        room: selectedRoom.value,
        description: ''
      })

      completed++
      uploadProgress.value = Math.round((completed / total) * 100)
    } catch (e) {
      console.error('Failed to upload:', e)
    }
  }

  uploading.value = false
  emit('uploaded', allPhotos.value)
}

function editDescription(photo: Photo) {
  editingPhoto.value = { ...photo }
  showDescriptionModal.value = true
}

function saveDescription() {
  if (editingPhoto.value) {
    const index = allPhotos.value.findIndex(p => p.id === editingPhoto.value!.id)
    if (index !== -1) {
      allPhotos.value[index].description = editingPhoto.value.description
    }
  }
  showDescriptionModal.value = false
  editingPhoto.value = null
  emit('uploaded', allPhotos.value)
}

function deletePhoto(photo: Photo) {
  allPhotos.value = allPhotos.value.filter(p => p.id !== photo.id)
  emit('uploaded', allPhotos.value)
}
</script>
