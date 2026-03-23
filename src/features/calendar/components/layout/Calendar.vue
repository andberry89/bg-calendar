<template>
  <main>
    <article id="calendar" :aria-busy="isLoading">
      <!-- <article
      id="calendar"
      :style="{ 'background-image': 'url(' + require('@/assets/calendar/' + currentDate.month + '.jpg') + ')' }"
    > -->
      <CalendarHeader
        :currentDate="currentDate"
        :staff="staff"
        :filters="filters"
        @date="updateDate"
        @filters="updateFilters"
        @update="updateEvents('add', $event)"
        @staff-update="updateStaff"
      />
      <CalendarBody
        :currentDate="currentDate"
        :prevMonthDays="prevMonthDays"
        :currentMonthDays="currentMonthDays"
        :currentMonthEvents="filteredCurrentMonthEvents"
        :unfilteredCurrentMonthEvents="currentMonthEvents"
        @date="updateDate"
        @delete="updateEvents('delete', $event)"
      />
    </article>
    <EventList v-if="showEvents" :events="filteredCurrentMonthEvents" :currentDate="currentDate" />
  </main>
  <footer>
    <em>Version {{ appVersion }}</em>
  </footer>
</template>

<script setup lang="ts">
/* global __APP_VERSION__ */
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import CalendarHeader from '@/features/calendar/components/layout/CalendarHeader.vue';
import CalendarBody from '@/features/calendar/components/layout/CalendarBody.vue';
import EventList from '@/features/calendar/components/layout/EventList.vue';
import { useEventsStore } from '@/stores/events';
import { useStaffStore } from '@/stores/staff';
import { sortEvents } from '@/features/calendar/utils/sortEvents';
import { getCurrentMonthEvents } from '@/features/calendar/utils/getCurrentMonthEvents';
import { filterEvents, type EventFilters } from '@/features/calendar/utils/filterEvents';
import { getPrevMonthDays, getCurrentMonthDays } from '@/features/calendar/utils/getMonthDayCounts';
import { getCurrentDate as getInitialCurrentDate } from '@/features/calendar/utils/getCurrentDate';
import type {
  CalendarEvent,
  CurrentDate,
  EventsByYear,
  NewCalendarEvent,
  StaffUpdatePayload
} from '@/types/calendar';

const currentDate = ref<CurrentDate>(getInitialCurrentDate());
const filters = ref<EventFilters>({
  types: [],
  staffIds: []
});

const eventsStore = useEventsStore();
const staffStore = useStaffStore();

const { events } = storeToRefs(eventsStore);
const { staff } = storeToRefs(staffStore);

const showEvents = ref(false);
const isLoading = ref(true);
const loadError = ref<string | null>(null);

const sortedEvents = computed<EventsByYear>(() => sortEvents(events.value));

const appVersion = computed((): string => __APP_VERSION__);
const prevMonthDays = computed(() => getPrevMonthDays(currentDate.value));
const currentMonthDays = computed(() => getCurrentMonthDays(currentDate.value));
const currentMonthEvents = computed((): CalendarEvent[] =>
  getCurrentMonthEvents(sortedEvents.value, currentDate.value)
);

const filteredCurrentMonthEvents = computed((): CalendarEvent[] =>
  filterEvents(currentMonthEvents.value, filters.value)
);

function updateDate(newDate: CurrentDate): void {
  currentDate.value = newDate;
}

function updateFilters(newFilters: EventFilters): void {
  filters.value = newFilters;
}

async function refreshCalendarData(): Promise<void> {
  await Promise.all([eventsStore.fetchEvents(), staffStore.fetchStaff()]);
}

async function updateEvents(
  fn: 'add' | 'delete',
  event: NewCalendarEvent | CalendarEvent
): Promise<void> {
  try {
    const result =
      fn === 'add'
        ? await eventsStore.addEvent(event as NewCalendarEvent)
        : await eventsStore.deleteEvent((event as CalendarEvent).id);

    if (!result.success) {
      console.warn(result.message, result.error);
    }
  } catch (err) {
    console.warn(err);
  }
}

async function updateStaff([fn, person]: StaffUpdatePayload): Promise<void> {
  try {
    const result =
      fn === 'add' ? await staffStore.addStaff(person) : await staffStore.deleteStaff(person.id);

    if (!result.success) {
      console.warn(result.message, result.error);
    }
  } catch (err) {
    console.warn(err);
  }
}

onMounted(async (): Promise<void> => {
  try {
    await refreshCalendarData();
  } catch (err) {
    console.warn(err);
    loadError.value = 'Failed to load calendar data.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Anton');

main {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: var(--layout-gap-md);
  max-width: var(--layout-shell-max-width);
  margin: 0 auto;
  padding: 0 var(--layout-shell-padding);

  #calendar {
    min-width: 0;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    gap: 0;
    background-color: var(--layout-panel-bg);
    color: var(--white);
    font-family: 'Anton';
    border-radius: var(--layout-radius-md);
    overflow: hidden;
    background-size: cover;
    user-select: none;
    position: relative;
  }
}

footer {
  text-align: center;
  padding: var(--layout-gap-md) var(--layout-shell-padding);
}
</style>
