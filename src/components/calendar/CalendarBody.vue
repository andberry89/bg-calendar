<template>
  <section class="calendar-body">
    <div class="weekdays">
      <div class="weekday" v-for="(weekday, idx) in weekdays" :key="idx">
        {{ weekday }}
      </div>
    </div>
    <div class="date" v-if="dataReady">
      <CalendarDay
        dayClass="day-hidden"
        v-for="(n, idx) in firstMonthDay - 1"
        :key="'prev' + idx"
        :date="prevMonthDays + 1 - firstMonthDay + n"
        :currentDate="activeDate"
        month="prev"
      />
      <CalendarDay
        dayClass="day"
        v-for="(n, idx) in currentMonthDays"
        :class="{ active: n === activeDate.date }"
        @click="updateDate(n)"
        @update="updateEvents"
        @delete="deleteEvent($event)"
        :key="'day' + idx"
        :date="n"
        :currentDate="activeDate"
        :events="events[n - 1]"
      />
      <CalendarDay
        dayClass="day-hidden"
        v-for="(n, idx) in 43 - (currentMonthDays + firstMonthDay)"
        :key="'next' + idx"
        :date="n"
        :currentDate="activeDate"
        month="next"
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CalendarDay from './CalendarDay.vue';
import assignEvents from './utils/assignEvents';
import type { CalendarEvent, CurrentDate } from '@/types/calendar';

const { currentDate, prevMonthDays, currentMonthDays, currentMonthEvents } = defineProps<{
  currentDate: CurrentDate;
  prevMonthDays: number;
  currentMonthDays: number;
  currentMonthEvents: CalendarEvent[];
}>();

const emit = defineEmits<{
  (e: 'date', value: CurrentDate): void;
  (e: 'delete', value: CalendarEvent): void;
}>();

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

const activeDate = ref<CurrentDate>({
  date: 0,
  month: 0,
  year: 0
});

watch(
  () => currentDate,
  (value: CurrentDate) => {
    activeDate.value = { ...value };
  },
  { deep: true, immediate: true }
);

const firstMonthDay = computed((): number => {
  const firstDay = new Date(activeDate.value.year, activeDate.value.month, 1).getDay();
  return firstDay + 1;
});

const events = computed((): CalendarEvent[][] => {
  if (!currentMonthDays || !currentMonthEvents.length) {
    return [];
  }

  return assignEvents(currentMonthEvents, currentDate.month, currentMonthDays);
});

const dataReady = computed((): boolean => {
  return events.value.length > 0 || currentMonthDays > 0;
});

function deleteEvent(event: CalendarEvent): void {
  emit('delete', event);
}

function updateDate(date: number): void {
  activeDate.value.date = date;
  emit('date', { ...activeDate.value });
}

function updateEvents(): void {
  // keep emit path unchanged for child interactions
}
</script>
<style lang="scss" scoped>
@mixin calendar-layout($property) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  grid-gap: 10px 2px;
  padding: $property;

  div {
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;
    align-items: center;
    border-radius: 5px;
  }
}

.calendar-body {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: 100%;
}

.weekdays {
  @include calendar-layout(10px 20px 10px);
  background-color: var(--md-tran-black);
  border-bottom: 1px solid var(--white);
  font-size: 1.5em;
  color: var(--ocean-gray);

  div:first-child,
  div:nth-child(7n) {
    color: var(--red);
  }
}

.date {
  @include calendar-layout(10px 20px 20px);
  background-color: var(--lt-tran-black);
  flex-grow: 4;

  .active {
    background-color: var(--ocean-lt-blue);
  }
}
</style>
