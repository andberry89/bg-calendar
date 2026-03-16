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
        :prevMonthDays="prevMonthDays"
        :currentMonthDays="currentMonthDays"
        @date="updateDate"
        @update="updateEvents('add', $event)"
        :dateFn="getCurrentDate"
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
    <em>Version {{ __APP_VERSION__ }}</em>
  </footer>
</template>
<script>
import CalendarHeader from './CalendarHeader.vue';
import CalendarBody from './CalendarBody.vue';
import StaffList from './StaffList.vue';
import EventList from './components/EventList.vue';
import { fetchEvents, fetchStaff } from '@/services';
import { addEvent, deleteEvent } from '@/router/events';
import { addStaff, deleteStaff } from '@/router/staff';
import { sortEvents } from '@/features/calendar/utils/sortEvents';
import { getCurrentMonthEvents } from '@/features/calendar/utils/getCurrentMonthEvents';
import { getPrevMonthDays, getCurrentMonthDays } from '@/features/calendar/utils/getMonthDayCounts';
import { getCurrentDate as getInitialCurrentDate } from '@/features/calendar/utils/getCurrentDate';

export default {
  name: 'Calendar',
  data() {
    return {
      currentDate: {
        month: 0,
        year: 0
      },
      staff: [],
      sortedEvents: {},
      showEvents: false,
      isLoading: true
    };
  },
  components: {
    CalendarHeader,
    CalendarBody,
    EventList,
    StaffList
  },
  computed: {
    prevMonthDays() {
      return getPrevMonthDays(this.currentDate);
    },
    currentMonthDays() {
      return getCurrentMonthDays(this.currentDate);
    },
    currentMonthEvents() {
      return getCurrentMonthEvents(this.sortedEvents, this.currentDate);
    }
  },
  methods: {
    getCurrentDate() {
      this.currentDate = getInitialCurrentDate();
    },
    async getEvents() {
      const events = await fetchEvents();
      this.sortedEvents = sortEvents(events);
    },

    async getStaff() {
      this.staff = await fetchStaff();
    },
    updateDate(newDate) {
      this.currentDate = newDate;
    },
    async updateEvents(fn, event) {
      try {
        if (fn === 'add') {
          await addEvent(event);
        } else {
          await deleteEvent(event.id);
        }
      } catch (err) {
        console.warn(err);
      }

      await this.getEvents();
    },
    async updateStaff([fn, person]) {
      try {
        if (fn === 'add') {
          await addStaff(person);
        } else {
          await deleteStaff(person.id);
        }
      } catch (err) {
        console.warn(err);
      }

      await this.getStaff();
    }
  },
  async mounted() {
    this.getCurrentDate();

    try {
      await Promise.all([this.getEvents(), this.getStaff()]);
    } finally {
      this.isLoading = false;
    }
  }
};
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
