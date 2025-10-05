<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onClickOutside, useFocus } from '@vueuse/core'
import {
  getMonth,
  getDate,
  getYear,
  startOfToday,
  startOfTomorrow,
  format,
  addDays,
  isAfter,
} from 'date-fns'
import { es } from 'date-fns/locale'

const model = defineModel<string>()

const input = ref()
const dropdown = ref()
const { focused } = useFocus(input)
const isActive = ref(false)

watch(focused, () => (isActive.value = true))
onClickOutside(dropdown, () => {
  if (!isActive) return
  isActive.value = false
})

function generateCalendarDays(month: number, year: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const calendarDays = []
  for (let i = 1; i <= daysInMonth; i++) {
    const dayOfWeek = (firstDayOfMonth + i - 1) % 7
    calendarDays.push({ dayOfWeek, dayOfMonth: i })
  }
  return calendarDays
}

const dayOfTheWeek = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']

const today = startOfToday()
const oneAndAHalfYearsInDays = 365 + 182
const maxDate = addDays(today, oneAndAHalfYearsInDays)

const currentMonth = ref(getMonth(today))
const currentYear = ref(getYear(today))

const selectedDate = ref(startOfTomorrow())
const currentDate = computed(() => new Date(currentYear.value, currentMonth.value))

const daysOfCurrentMonth = ref(generateCalendarDays(currentMonth.value, currentYear.value))

watch(currentDate, () => {
  daysOfCurrentMonth.value = generateCalendarDays(currentMonth.value, currentYear.value)
})

const isNextMonthDisabled = computed(() => {
  const firstDayOfNextMonth = new Date(currentYear.value, currentMonth.value + 1, 1)
  return isAfter(firstDayOfNextMonth, maxDate)
})

function goToNextMonth() {
  if (isNextMonthDisabled.value) return

  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}

function goToPreviousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

function isDateDisabled(day: number) {
  const date = new Date(currentYear.value, currentMonth.value, day)
  return isAfter(date, maxDate)
}

function selectDate(day: number) {
  if (isDateDisabled(day)) return

  selectedDate.value = new Date(currentYear.value, currentMonth.value, day)
  model.value = format(selectedDate.value, 'yyyy-MM-dd')
  isActive.value = false
}
</script>

<template>
  <div class="relative">
    <label
      for="when"
      class="bg-neutral-700 py-2 px-3 grid grid-cols-[1fr_6fr] rounded-lg gap-4 mb-2 mx-1.5"
    >
      <input
        ref="input"
        type="text"
        name="when"
        :value="`para el ${format(selectedDate, 'PPP', { locale: es })}`"
        readonly
        class="bg-transparent outline-none cursor-pointer text-sm w-90"
      />
    </label>
    <Transition>
      <div
        ref="dropdown"
        class="absolute bottom-13 inset-x-1.5 rounded-[1.7rem] bg-neutral-700 shadow-xl shadow-stone-900/5 z-50 grid p-3 gap-2 text-sm"
        v-if="isActive"
      >
        <div id="calendar" class="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2">
          <span
            v-for="day in dayOfTheWeek"
            class="p-2 flex items-center justify-center rounded-full aspect-square bg-white/10 text-sm"
          >
            {{ day }}
          </span>
          <span
            v-if="daysOfCurrentMonth.length > 0"
            v-for="day in daysOfCurrentMonth[0].dayOfWeek"
            :id="`offset-day-${day}`"
          />
          <span
            v-for="day in daysOfCurrentMonth"
            class="p-2 flex items-center justify-center rounded-full aspect-square select-none"
            @click="selectDate(day.dayOfMonth)"
            :class="{
              'bg-white/10':
                day.dayOfMonth === getDate(today) &&
                currentMonth === getMonth(today) &&
                currentYear === getYear(today),
              'text-white font-black bg-white/20':
                day.dayOfMonth === getDate(selectedDate) &&
                currentMonth === getMonth(selectedDate) &&
                currentYear === getYear(selectedDate),
              'hover:bg-white/10 cursor-pointer': !isDateDisabled(day.dayOfMonth),
              'text-neutral-500 cursor-not-allowed': isDateDisabled(day.dayOfMonth),
            }"
          >
            {{ day.dayOfMonth }}
          </span>
        </div>
        <div class="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-2">
          <div class="rounded-full bg-neutral-800 col-span-5 flex items-center justify-center">
            {{ format(currentDate, "LLLL 'de' yyyy", { locale: es }) }}
          </div>
          <button
            type="button"
            class="mt-0 bg-white/10 rounded-full flex justify-center items-center aspect-square hover:brightness-90 active:scale-90 cursor-pointer"
            @click="goToPreviousMonth"
          >
            <ArrowLeft :size="20" />
          </button>
          <button
            type="button"
            class="mt-0 bg-white/10 rounded-full flex justify-center items-center aspect-square"
            @click="goToNextMonth"
            :disabled="isNextMonthDisabled"
            :class="{
              'hover:brightness-90 active:scale-90 cursor-pointer': !isNextMonthDisabled,
              'opacity-50 cursor-not-allowed': isNextMonthDisabled,
            }"
          >
            <ArrowRight :size="20" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: all 0.1s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
