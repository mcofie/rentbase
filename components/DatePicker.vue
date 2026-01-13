<template>
  <UPopover :ui="{ content: 'p-0' }">
    <UButton
      variant="outline"
      color="neutral"
      :class="[
        'w-full justify-between text-left font-normal',
        !modelValue && 'text-stone-400'
      ]"
      size="lg"
    >
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-calendar" class="w-4 h-4 text-stone-400" />
        <span>{{ formattedDate || placeholder }}</span>
      </div>
      <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-stone-400" />
    </UButton>

    <template #content>
      <div class="p-3">
        <!-- Month/Year Navigation -->
        <div class="flex items-center justify-between mb-3">
          <UButton 
            variant="ghost" 
            color="neutral"
            size="sm"
            icon="i-lucide-chevron-left"
            @click="previousMonth"
          />
          <div class="text-sm font-bold text-stone-900 dark:text-white">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </div>
          <UButton 
            variant="ghost" 
            color="neutral"
            size="sm"
            icon="i-lucide-chevron-right"
            @click="nextMonth"
          />
        </div>

        <!-- Weekday Headers -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div 
            v-for="day in weekDays" 
            :key="day"
            class="text-center text-xs font-bold text-stone-400 py-1"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Empty cells for days before start of month -->
          <div 
            v-for="n in startDayOfMonth" 
            :key="'empty-' + n"
            class="p-2"
          />
          
          <!-- Actual days -->
          <button
            v-for="day in daysInMonth"
            :key="day"
            type="button"
            :class="[
              'p-2 text-sm rounded-lg transition-colors',
              isSelected(day) 
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-bold' 
                : 'hover:bg-stone-100 dark:hover:bg-stone-800',
              isToday(day) && !isSelected(day)
                ? 'border border-stone-300 dark:border-stone-600 font-medium'
                : '',
              isPast(day) && !allowPast
                ? 'text-stone-300 dark:text-stone-600 cursor-not-allowed'
                : 'text-stone-900 dark:text-white cursor-pointer'
            ]"
            :disabled="isPast(day) && !allowPast"
            @click="selectDate(day)"
          >
            {{ day }}
          </button>
        </div>

        <!-- Quick Actions -->
        <div class="flex gap-2 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
          <UButton 
            variant="ghost" 
            color="neutral"
            size="xs"
            class="flex-1"
            @click="selectToday"
          >
            Today
          </UButton>
          <UButton 
            variant="ghost" 
            color="neutral"
            size="xs"
            class="flex-1"
            @click="selectNextMonth"
          >
            Next Month
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  allowPast?: boolean
}>(), {
  placeholder: 'Select date',
  allowPast: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Current view month/year
const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

// Parse selected date if exists
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const date = new Date(newVal)
    currentMonth.value = date.getMonth()
    currentYear.value = date.getFullYear()
  }
}, { immediate: true })

// Calculate days in current month
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

// Calculate what day of week the month starts on (0 = Sunday)
const startDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

// Format the selected date for display
const formattedDate = computed(() => {
  if (!props.modelValue) return ''
  const date = new Date(props.modelValue)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})

// Navigation
function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// Date checks
function isSelected(day: number): boolean {
  if (!props.modelValue) return false
  const selected = new Date(props.modelValue)
  return (
    selected.getDate() === day &&
    selected.getMonth() === currentMonth.value &&
    selected.getFullYear() === currentYear.value
  )
}

function isToday(day: number): boolean {
  return (
    today.getDate() === day &&
    today.getMonth() === currentMonth.value &&
    today.getFullYear() === currentYear.value
  )
}

function isPast(day: number): boolean {
  const date = new Date(currentYear.value, currentMonth.value, day)
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return date < todayStart
}

// Selection
function selectDate(day: number) {
  if (isPast(day) && !props.allowPast) return
  
  const date = new Date(currentYear.value, currentMonth.value, day)
  const formatted = date.toISOString().split('T')[0] // YYYY-MM-DD
  emit('update:modelValue', formatted)
}

function selectToday() {
  const formatted = today.toISOString().split('T')[0]
  emit('update:modelValue', formatted)
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
}

function selectNextMonth() {
  const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const formatted = nextMonthDate.toISOString().split('T')[0]
  emit('update:modelValue', formatted)
  currentMonth.value = nextMonthDate.getMonth()
  currentYear.value = nextMonthDate.getFullYear()
}
</script>
