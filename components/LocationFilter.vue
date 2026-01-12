<template>
  <div class="flex flex-wrap gap-2">
    <!-- All Locations -->
    <button
      @click="selectLocation(null)"
      :class="[
        'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
        selectedLocation === null
          ? 'bg-[#0075DE] text-white'
          : 'bg-white dark:bg-stone-800 text-[#050505] dark:text-stone-300 border border-[#E1E1E1] dark:border-stone-700 hover:bg-[#F7F7F5] dark:hover:bg-stone-700'
      ]"
    >
      <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
      All Locations
    </button>
    
    <!-- Location Options -->
    <button
      v-for="location in visibleLocations"
      :key="location.id"
      @click="selectLocation(location.id)"
      :class="[
        'px-3 py-2 rounded-lg text-sm font-medium transition-all',
        selectedLocation === location.id
          ? 'bg-[#0075DE] text-white'
          : 'bg-white dark:bg-stone-800 text-[#050505] dark:text-stone-300 border border-[#E1E1E1] dark:border-stone-700 hover:bg-[#F7F7F5] dark:hover:bg-stone-700'
      ]"
    >
      {{ location.name }}
    </button>
    
    <!-- More Dropdown -->
    <div v-if="hiddenLocations.length > 0" class="relative">
      <button
        @click="showDropdown = !showDropdown"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1',
          isHiddenLocationSelected
            ? 'bg-[#0075DE] text-white'
            : 'bg-white dark:bg-stone-800 text-[#050505] dark:text-stone-300 border border-[#E1E1E1] dark:border-stone-700 hover:bg-[#F7F7F5]'
        ]"
      >
        <span v-if="isHiddenLocationSelected">{{ selectedLocationName }}</span>
        <span v-else>More</span>
        <UIcon name="i-lucide-chevron-down" class="w-4 h-4" :class="{ 'rotate-180': showDropdown }" />
      </button>
      
      <!-- Dropdown -->
      <Transition name="fade">
        <div 
          v-if="showDropdown"
          class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-lg border border-[#E1E1E1] dark:border-stone-700 shadow-lg py-2 z-50"
        >
          <button
            v-for="location in hiddenLocations"
            :key="location.id"
            @click="selectLocation(location.id); showDropdown = false"
            :class="[
              'w-full px-4 py-2 text-left text-sm hover:bg-[#F7F7F5] dark:hover:bg-stone-700 transition-colors',
              selectedLocation === location.id ? 'text-[#0075DE] font-medium' : 'text-[#050505] dark:text-white'
            ]"
          >
            {{ location.name }}
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Location {
  id: string
  name: string
  region?: string
}

interface Props {
  modelValue: string | null
  maxVisible?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 5
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const showDropdown = ref(false)

const locations: Location[] = [
  { id: 'accra-central', name: 'Accra Central', region: 'Greater Accra' },
  { id: 'east-legon', name: 'East Legon', region: 'Greater Accra' },
  { id: 'airport-residential', name: 'Airport', region: 'Greater Accra' },
  { id: 'cantonments', name: 'Cantonments', region: 'Greater Accra' },
  { id: 'osu', name: 'Osu', region: 'Greater Accra' },
  { id: 'la', name: 'La', region: 'Greater Accra' },
  { id: 'tema', name: 'Tema', region: 'Greater Accra' },
  { id: 'spintex', name: 'Spintex', region: 'Greater Accra' },
  { id: 'kasoa', name: 'Kasoa', region: 'Central' },
  { id: 'kumasi', name: 'Kumasi', region: 'Ashanti' },
  { id: 'takoradi', name: 'Takoradi', region: 'Western' },
]

const selectedLocation = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const visibleLocations = computed(() => locations.slice(0, props.maxVisible))
const hiddenLocations = computed(() => locations.slice(props.maxVisible))

const isHiddenLocationSelected = computed(() => {
  return hiddenLocations.value.some(loc => loc.id === selectedLocation.value)
})

const selectedLocationName = computed(() => {
  const loc = locations.find(l => l.id === selectedLocation.value)
  return loc?.name || 'More'
})

function selectLocation(id: string | null) {
  selectedLocation.value = id
}

// Close dropdown on outside click
onMounted(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (showDropdown.value) {
      showDropdown.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => document.removeEventListener('click', handleClickOutside))
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
