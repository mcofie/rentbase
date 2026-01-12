<template>
  <div class="room-photo-uploader">
    <!-- Room Selector -->
    <div class="mb-6 overflow-x-auto">
      <div class="flex flex-nowrap gap-2 min-w-min pb-2">
        <button
          v-for="room in rooms"
          :key="room.id"
          @click="selectedRoom = room.id"
          :class="[
            'px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap',
            selectedRoom === room.id
              ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm'
              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
          ]"
        >
          <UIcon :name="room.icon" class="w-4 h-4" />
          <span>{{ room.name }}</span>
          <span v-if="getPhotoCountForRoom(room.id) > 0" class="w-5 h-5 bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-white text-[10px] rounded-md flex items-center justify-center font-mono">
            {{ getPhotoCountForRoom(room.id) }}
          </span>
        </button>
      </div>
    </div>

    <!-- Upload Section for Selected Room -->
    <div class="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-6 mb-6 shadow-sm">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center text-stone-900 dark:text-white">
          <UIcon :name="currentRoom.icon" class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold text-lg text-stone-900 dark:text-white font-serif">{{ currentRoom.name }} Photos</h3>
          <p class="text-xs text-stone-500 font-medium">{{ getPhotoCountForRoom(selectedRoom) }} items documented</p>
        </div>
      </div>

      <!-- Upload Area -->
      <div
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="handleDrop"
        :class="[
          'border-2 border-dashed rounded-lg p-8 transition-all text-center cursor-pointer relative overflow-hidden',
          dragOver 
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' 
            : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
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
          <div class="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin mb-3"></div>
          <p class="text-sm font-bold text-stone-900 dark:text-white">Uploading {{ uploadProgress }}%...</p>
        </div>
        <div v-else>
          <div class="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-3">
             <UIcon name="i-lucide-plus" class="w-6 h-6 text-stone-400" />
          </div>
          <p class="text-sm font-bold text-stone-900 dark:text-white mb-1">
            Click to upload or drag photos
          </p>
          <p class="text-xs text-stone-400">
            Document conditions in {{ currentRoom.name.toLowerCase() }}
          </p>
        </div>
      </div>

      <!-- Camera Button (Mobile) -->
      <button
        @click="triggerCamera"
        class="w-full mt-4 py-3 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white font-bold rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 sm:hidden border border-stone-200 dark:border-stone-700"
      >
        <UIcon name="i-lucide-camera" class="w-4 h-4" />
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
      <div v-for="room in roomsWithPhotos" :key="room.id" class="bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div class="flex items-center gap-2">
            <UIcon :name="room.icon" class="w-4 h-4 text-stone-400" />
            <h4 class="font-bold text-stone-900 dark:text-white">{{ room.name }}</h4>
            <span class="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[10px] font-bold rounded-md border border-stone-200 dark:border-stone-700">
              {{ getPhotosForRoom(room.id).length }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="(photo, index) in getPhotosForRoom(room.id)"
            :key="photo.id"
            class="group relative rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 aspect-square border border-stone-200 dark:border-stone-800"
          >
            <img
              :src="photo.url"
              :alt="`${room.name} photo ${index + 1}`"
              class="w-full h-full object-cover"
            />
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                @click="editDescription(photo)"
                class="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                title="Edit description"
              >
                <UIcon name="i-lucide-pencil" class="w-4 h-4 text-stone-900" />
              </button>
              <button
                @click="deletePhoto(photo)"
                class="p-2 bg-white/90 rounded-lg hover:bg-white text-rose-600 transition-colors"
                title="Delete photo"
              >
                <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
              </button>
            </div>

            <!-- Description Badge -->
            <div v-if="photo.description" class="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
              <p class="text-white text-[10px] truncate font-medium">{{ photo.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Description Modal -->
    <Teleport to="body">
      <div v-if="showDescriptionModal" class="fixed inset-0 bg-stone-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-6">
        <div class="bg-white dark:bg-stone-900 rounded-lg p-6 max-w-md w-full shadow-xl border border-stone-200 dark:border-stone-800 animate-bounce-in">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <UIcon name="i-lucide-pencil" class="w-4 h-4 text-stone-900 dark:text-white" />
            </div>
            <h3 class="font-bold text-stone-900 dark:text-white font-serif">Add Description</h3>
          </div>
          
          <textarea
            v-model="editingPhoto!.description"
            placeholder="Describe the defect or condition..."
            rows="3"
            class="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm resize-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-white focus:border-stone-900 mb-4 placeholder-stone-400"
            autofocus
          ></textarea>
          
          <div class="flex gap-3">
            <button
              @click="showDescriptionModal = false"
              class="flex-1 py-2.5 bg-white border border-stone-200 dark:bg-stone-800 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              @click="saveDescription"
              class="flex-1 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-lg hover:opacity-90 transition-colors text-sm"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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
  { id: 'living', name: 'Living Room', icon: 'i-lucide-sofa' },
  { id: 'bedroom', name: 'Bedroom', icon: 'i-lucide-bed-double' },
  { id: 'kitchen', name: 'Kitchen', icon: 'i-lucide-chef-hat' },
  { id: 'bathroom', name: 'Bathroom', icon: 'i-lucide-bath' },
  { id: 'exterior', name: 'Exterior', icon: 'i-lucide-home' },
  { id: 'other', name: 'Other', icon: 'i-lucide-box' },
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
