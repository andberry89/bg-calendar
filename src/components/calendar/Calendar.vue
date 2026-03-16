<template>
  <main>
    <article id="staff-list">
      <StaffList
        :staff="staff"
        key="staff-list"
        @update="updateStaff($event)"
      />
    </article>
    <article id="calendar">
      <!-- <article
      id="calendar"
      :style="{ 'background-image': 'url(' + require('@/assets/calendar/' + currentDate.month + '.jpg') + ')' }"
    > -->
      <CalendarHeader
        :currentDate="currentDate"
        :prevMonthDays="prevMonthDays"
        :currentMonthDays="currentMonthDays"
        @date="updateDate($event)"
        @update="updateEvents('add', $event)"
        :dateFn="getCurrentDate"
        :staff="staff"
        key="calendar-header"
      />
      <CalendarBody
        :currentDate="currentDate"
        :prevMonthDays="prevMonthDays"
        :currentMonthDays="currentMonthDays"
        :currentMonthEvents="currentMonthEvents"
        :key="currentDate.month + '-' + currentDate.year"
        @date="updateDate($event)"
        @delete="updateEvents('delete', $event)"
      />
    </article>
    <EventList
      :events="currentMonthEvents"
      :currentDate="currentDate"
      v-if="showEvents"
    />
  </main>
  <footer><em>Version 1.0.2</em> - 7/10/2025</footer>
</template>
<script>
import CalendarHeader from "./CalendarHeader.vue";
import CalendarBody from "./CalendarBody.vue";
import StaffList from "./StaffList.vue";
import EventList from "./components/EventList.vue";
import { fetchEvents, fetchStaff } from "@/services";
import { addEvent, deleteEvent } from "@/router/events";
import { addStaff, deleteStaff } from "@/router/staff";

export default {
  name: "Calendar",
  data() {
    return {
      currentDate: {
        date: 0,
        month: 0,
        year: 0,
      },
      staff: [],
      sortedEvents: {
        type: Object,
      },
      showEvents: false,
    };
  },
  components: {
    CalendarHeader,
    CalendarBody,
    EventList,
    StaffList,
  },
  computed: {
    prevMonthDays() {
      let year = this.currentDate.month === 0 ? this.currentDate.year - 1 : this.currentDate.year;
      let month = this.currentDate.month === 0 ? 12 : this.currentDate.month;
      return new Date(year, month, 0).getDate();
    },
    currentMonthDays() {
      return new Date(this.currentDate.year, this.currentDate.month + 1, 0).getDate();
    },
    currentMonthEvents() {
      const currentYearEvents = this.sortedEvents[this.currentDate.year];
      if (currentYearEvents) {
        return currentYearEvents
          .filter((e) => {
            const start = e.start.split("-")[1] - 1;
            const end = e.end.split("-")[1] - 1;
            return this.currentDate.month === start || this.currentDate.month === end;
          })
          .sort((a, b) => {
            return (
              new Date(a.start.replace(/-/g, "/").replace(/T.+/, "")) -
              new Date(b.start.replace(/-/g, "/").replace(/T.+/, ""))
            );
          });
      } else {
        return [];
      }
    },
  },
  methods: {
    addStaff: addStaff,
    deleteStaff: deleteStaff,
    addEvent: addEvent,
    deleteEvent: deleteEvent,
    getCurrentDate() {
      let today = new Date();
      this.currentDate.date = today.getDate();
      this.currentDate.month = today.getMonth();
      this.currentDate.year = today.getFullYear();
    },
async getEvents() {
  const events = await fetchEvents();
  this.events = events;
  this.sortedEvents = this.sortEvents(events);
},
    async getStaff() {
  this.staff = await fetchStaff();
},
    updateDate(newDate) {
      this.currentDate = newDate;
    },
    async updateEvents(fn, event) {
      if (fn === "add") {
        try {
          await addEvent(event);
        } catch (err) {
          console.warn(err);
        }
      } else {
        try {
          await deleteEvent(event.id);
        } catch (err) {
          console.warn(err);
        }
      }
      this.getEvents();
    },
    async updateStaff(staffFn) {
      const fn = staffFn[0];
      const person = staffFn[1];
      if (fn === "add") {
        try {
          await addStaff(person);
        } catch (err) {
          console.warn(err);
        }
      } else {
        try {
          await deleteStaff(person.id);
        } catch (err) {
          console.warn(err);
        }
      }

      this.getStaff();
    },
    sortEvents(events) {
      let yearsWithEvents = events
        .map((e) => {
          const start = e.start.split("-")[0];
          const end = e.end.split("-")[0];
          if (start === end) return start;
          else return [start, end];
        })
        .flat();

      const uniqueYears = [...new Set(yearsWithEvents)];
      let sortedEvents = {};
      uniqueYears.forEach((year) => {
        const yearEvents = events.filter((e) => {
          const start = e.start.split("-")[0];
          const end = e.end.split("-")[0];
          return start === year || end === year;
        });

        sortedEvents[year] = yearEvents;
      });

      return sortedEvents;
    },
  },
  created() {
    this.getCurrentDate();
  },
  mounted() {
    this.getEvents();
    this.getStaff();
  },
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Anton");
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
    font-family: "Anton";
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
