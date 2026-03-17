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
        :key="currentDate.month + '-' + currentDate.year"
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
<script setup>
/* global __APP_VERSION__ */
import { computed, onMounted, ref } from 'vue';
import CalendarHeader from './CalendarHeader.vue';
import CalendarBody from './CalendarBody.vue';
import StaffList from './StaffList.vue';
import EventList from './components/EventList.vue';
import { fetchCalendarPageData } from '@/services';
import { addEvent, deleteEvent } from '@/router/events';
import { addStaff, deleteStaff } from '@/router/staff';
import { sortEvents } from '@/features/calendar/utils/sortEvents';
import { getCurrentMonthEvents } from '@/features/calendar/utils/getCurrentMonthEvents';
import { getPrevMonthDays, getCurrentMonthDays } from '@/features/calendar/utils/getMonthDayCounts';
import { getCurrentDate as getInitialCurrentDate } from '@/features/calendar/utils/getCurrentDate';

const currentDate = ref({
  date: 0,
  month: 0,
  year: 0
});

const staff = ref([]);
const sortedEvents = ref({});
const showEvents = ref(false);
const isLoading = ref(true);
const loadError = ref(null);

const appVersion = computed(() => __APP_VERSION__);
const prevMonthDays = computed(() => getPrevMonthDays(currentDate.value));
const currentMonthDays = computed(() => getCurrentMonthDays(currentDate.value));
const currentMonthEvents = computed(() =>
  getCurrentMonthEvents(sortedEvents.value, currentDate.value)
);

function getCurrentDate() {
  currentDate.value = getInitialCurrentDate();
}

function updateDate(newDate) {
  currentDate.value = newDate;
}

async function refreshCalendarData() {
  const { events, staff: staffData } = await fetchCalendarPageData();
  sortedEvents.value = sortEvents(events);
  staff.value = staffData;
}

async function updateEvents(fn, event) {
  try {
    if (fn === 'add') {
      await addEvent(event);
    } else {
      await deleteEvent(event.id);
    }

    await refreshCalendarData();
  } catch (err) {
    console.warn(err);
  }
}

async function updateStaff([fn, person]) {
  try {
    if (fn === 'add') {
      await addStaff(person);
    } else {
      await deleteStaff(person.id);
    }

    await refreshCalendarData();
  } catch (err) {
    console.warn(err);
  }
}

onMounted(async () => {
  getCurrentDate();

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
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
  padding: 0 10px;

  #calendar {
    width: 1032px;
    display: flex;
    flex-basis: 1050px;
    flex-flow: column nowrap;
    justify-content: flex-start;
    gap: 10px;
    background-color: var(--ocean-dark-blue);
    font-family: 'Anton';
    border-radius: 15px;
    overflow: hidden;
    background-size: cover;
    user-select: none;
    position: relative;
  }
}
footer {
  text-align: center;
}
</style>
