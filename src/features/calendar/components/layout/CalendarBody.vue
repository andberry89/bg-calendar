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
        v-for="(date, idx) in previousMonthVisibleDays"
        :key="'prev' + idx"
        :date="date"
        :currentDate="currentDate"
        month="prev"
      />
      <CalendarDay
        dayClass="day"
        v-for="(date, idx) in currentMonthVisibleDays"
        :class="{ active: date === currentDate.date }"
        @click="updateDate(date)"
        @update="updateEvents"
        @delete="deleteEvent($event)"
        :key="'day' + idx"
        :date="date"
        :currentDate="currentDate"
        :events="events[date - 1]"
        :hasUnfilteredEvents="unfilteredEvents[date - 1]?.length > 0"
      />
      <CalendarDay
        dayClass="day-hidden"
        v-for="(date, idx) in nextMonthVisibleDays"
        :key="'next' + idx"
        :date="date"
        :currentDate="currentDate"
        month="next"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CalendarDay from '@/features/calendar/components/display/CalendarDay.vue';
import assignEvents from '@/features/calendar/utils/assignEvents';
import type { CalendarEvent, CurrentDate } from '@/types/calendar';

const {
  currentDate,
  prevMonthDays,
  currentMonthDays,
  currentMonthEvents,
  unfilteredCurrentMonthEvents
} = defineProps<{
  currentDate: CurrentDate;
  prevMonthDays: number;
  currentMonthDays: number;
  currentMonthEvents: CalendarEvent[];
  unfilteredCurrentMonthEvents: CalendarEvent[];
}>();

const emit = defineEmits<{
  (e: 'date', value: CurrentDate): void;
  (e: 'delete', value: CalendarEvent): void;
}>();

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

const firstMonthDay = computed((): number => {
  const firstDay = new Date(currentDate.year, currentDate.month, 1).getDay();
  return firstDay + 1;
});

const previousMonthVisibleDays = computed((): number[] => {
  return Array.from(
    { length: firstMonthDay.value - 1 },
    (_, idx) => prevMonthDays + idx + 2 - firstMonthDay.value
  );
});

const currentMonthVisibleDays = computed((): number[] => {
  return Array.from({ length: currentMonthDays }, (_, idx) => idx + 1);
});

const nextMonthVisibleDays = computed((): number[] => {
  return Array.from({ length: 43 - (currentMonthDays + firstMonthDay.value) }, (_, idx) => idx + 1);
});

let cachedEvents: CalendarEvent[][] = [];
let cachedMonth = -1;
let cachedMonthDays = -1;
let cachedSourceEvents: CalendarEvent[] | null = null;
let cachedUnfilteredEvents: CalendarEvent[][] = [];
let cachedUnfilteredMonth = -1;
let cachedUnfilteredMonthDays = -1;
let cachedUnfilteredSourceEvents: CalendarEvent[] | null = null;

const events = computed((): CalendarEvent[][] => {
  if (!currentMonthDays || !currentMonthEvents.length) {
    cachedEvents = [];
    cachedMonth = currentDate.month;
    cachedMonthDays = currentMonthDays;
    cachedSourceEvents = currentMonthEvents;

    return cachedEvents;
  }

  if (
    cachedSourceEvents === currentMonthEvents &&
    cachedMonth === currentDate.month &&
    cachedMonthDays === currentMonthDays
  ) {
    return cachedEvents;
  }

  cachedEvents = assignEvents(currentMonthEvents, currentDate.month, currentMonthDays);
  cachedMonth = currentDate.month;
  cachedMonthDays = currentMonthDays;
  cachedSourceEvents = currentMonthEvents;

  return cachedEvents;
});

const unfilteredEvents = computed((): CalendarEvent[][] => {
  if (!currentMonthDays || !unfilteredCurrentMonthEvents.length) {
    cachedUnfilteredEvents = [];
    cachedUnfilteredMonth = currentDate.month;
    cachedUnfilteredMonthDays = currentMonthDays;
    cachedUnfilteredSourceEvents = unfilteredCurrentMonthEvents;

    return cachedUnfilteredEvents;
  }

  if (
    cachedUnfilteredSourceEvents === unfilteredCurrentMonthEvents &&
    cachedUnfilteredMonth === currentDate.month &&
    cachedUnfilteredMonthDays === currentMonthDays
  ) {
    return cachedUnfilteredEvents;
  }

  cachedUnfilteredEvents = assignEvents(
    unfilteredCurrentMonthEvents,
    currentDate.month,
    currentMonthDays
  );
  cachedUnfilteredMonth = currentDate.month;
  cachedUnfilteredMonthDays = currentMonthDays;
  cachedUnfilteredSourceEvents = unfilteredCurrentMonthEvents;

  return cachedUnfilteredEvents;
});

const dataReady = computed((): boolean => {
  return currentMonthDays > 0;
});

function deleteEvent(event: CalendarEvent): void {
  emit('delete', event);
}

function updateDate(date: number): void {
  emit('date', { ...currentDate, date });
}

function updateEvents(): void {
  // keep emit path unchanged for child interactions
}
</script>

<style lang="scss" scoped>
@mixin calendar-layout($padding) {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px 2px;
  padding: $padding;

  div {
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;
    align-items: center;
    border-radius: 5px;
    min-width: 0;
  }
}

.calendar-body {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  min-width: 0;
  height: 100%;
}

.weekdays {
  @include calendar-layout(10px 20px 10px);
  background-color: var(--md-tran-black);
  border-bottom: 1px solid var(--white);
  font-size: clamp(1rem, 1.5vw, 1.5rem);
  color: var(--ocean-gray);

  div:first-child,
  div:nth-child(7n) {
    color: var(--red);
  }
}

.date {
  @include calendar-layout(10px 20px 20px);
  background-color: var(--layout-panel-overlay);
  flex-grow: 4;

  .active {
    background-color: var(--ocean-lt-blue);
  }
}

@media (max-width: 900px) {
  .weekdays {
    padding: 10px 12px;
  }

  .date {
    padding: 10px 12px 12px;
  }
}

@media (max-width: 640px) {
  .weekdays,
  .date {
    gap: 6px 2px;
  }

  .weekdays {
    font-size: 0.95rem;
  }
}
</style>
