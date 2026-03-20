<template>
  <main>
    <article id="staff-list">
      <StaffList :staff="staff" @update="updateStaff" />
    </article>
    <article id="calendar" :aria-busy="isLoading">
      <!-- <article
      id="calendar"
      :style="{ 'background-image': 'url(' + require('@/assets/calendar/' + currentDate.month + '.jpg') + ')' }"
    > -->
      <CalendarHeader
        :currentDate="currentDate"
        @date="updateDate"
        @update="updateEvents('add', $event)"
        :staff="staff"
      />
      <CalendarBody
        :currentDate="currentDate"
        :prevMonthDays="prevMonthDays"
        :currentMonthDays="currentMonthDays"
        :currentMonthEvents="currentMonthEvents"
        @date="updateDate"
        @delete="updateEvents('delete', $event)"
      />
    </article>
    <EventList :events="currentMonthEvents" :currentDate="currentDate" v-if="showEvents" />
  </main>
  <footer>
    <em>Version {{ appVersion }}</em>
  </footer>
</template>
<script setup lang="ts">
/* global __APP_VERSION__ */
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import CalendarHeader from './CalendarHeader.vue';
import CalendarBody from './CalendarBody.vue';
import StaffList from './StaffList.vue';
import EventList from './components/EventList.vue';
import { useEventsStore } from '@/stores/events';
import { useStaffStore } from '@/stores/staff';
import { sortEvents } from '@/features/calendar/utils/sortEvents';
import { getCurrentMonthEvents } from '@/features/calendar/utils/getCurrentMonthEvents';
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

function updateDate(newDate: CurrentDate): void {
  currentDate.value = newDate;
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
  grid-template-columns: minmax(150px, 200px) minmax(0, 1fr);
  align-items: start;
  gap: var(--layout-gap-md);
  max-width: var(--layout-shell-max-width);
  margin: 0 auto;
  padding: 0 var(--layout-shell-padding);

  #staff-list {
    min-width: 0;
  }

  #calendar {
    min-width: 0;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    gap: var(--layout-gap-sm);
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

@media (max-width: 1100px) {
  main {
    grid-template-columns: 1fr;
  }
  #staff-list {
    display: none;
  }
  #calendar {
    width: 100%;
  }
}
</style>
