<template>
  <!-- <article
    id="calendar"
    :style="{ 'background-image': 'url(' + require('@/assets/calendar/' + currentDate.month + '.jpg') + ')' }"
  > -->
  <article id="calendar">
    <CalendarHeader
      :currentDate="currentDate"
      :prevMonthDays="prevMonthDays"
      :currentMonthDays="currentMonthDays"
      @update="updateDate($event)"
      :dateFn="getCurrentDate"
    />
    <CalendarBody
      :currentDate="currentDate"
      :prevMonthDays="prevMonthDays"
      :currentMonthDays="currentMonthDays"
      :currentMonthEvents="currentMonthEvents"
      :key="currentDate.month + '-' + currentDate.year"
      @update="updateDate($event)"
    />
  </article>
</template>
<script>
import CalendarHeader from "./CalendarHeader.vue";
import CalendarBody from "./CalendarBody.vue";

export default {
  name: "Calendar",
  data() {
    return {
      currentDate: {
        date: 0,
        month: 0,
        year: 0,
      },
      events: [],
      sortedEvents: {
        type: Object,
      },
    };
  },
  components: {
    CalendarHeader,
    CalendarBody,
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
        return currentYearEvents.filter((e) => {
          const split = e.start.split("-");
          const month = split[1] - 1;
          return this.currentDate.month === month;
        });
      } else {
        return [];
      }
    },
  },
  methods: {
    getCurrentDate() {
      let today = new Date();
      this.currentDate.date = today.getDate();
      this.currentDate.month = today.getMonth();
      this.currentDate.year = today.getFullYear();
    },
    updateDate(newDate) {
      this.currentDate = newDate;
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

      //todo: work on this function
    },
  },
  created() {
    this.getCurrentDate();
    this.events = [
      {
        name: "Auto Show",
        details: "Chicago Auto Show",
        class: "auto-show",
        staff: ["Rich Ceppos", "Drew Dorian"],
        start: "2025-02-06",
        end: "2025-02-07",
        eventId: "00001",
      },
      {
        name: "Birthday",
        details: "Andrew's Birthday",
        class: "birthday",
        staff: ["Andrew Berry"],
        start: "2025-02-14",
        end: "2025-02-14",
        eventId: "00002",
      },
      {
        name: "Press Trip",
        details: "Volvo in Sweden",
        staff: ["Austin Parsons"],
        class: "press-trip",
        start: "2025-02-08",
        end: "2025-02-14",
        eventId: "00003",
      },
      {
        name: "Press Trip",
        details: "Palm Springs",
        staff: ["Drew Dorian"],
        class: "press-trip",
        start: "2025-02-10",
        end: "2025-02-11",
        eventId: "00007",
      },
      {
        name: "Off",
        details: "Drew Off",
        staff: ["Drew Dorian"],
        class: "off",
        start: "2025-02-14",
        end: "2025-02-18",
        eventId: "00004",
      },
      {
        name: "Car and Driver Event",
        details: "Lightning Lap Live @ 9:00 AM",
        staff: [],
        class: "cd-event",
        start: "2025-02-20",
        end: "2025-02-20",
        eventId: "00005",
      },
      {
        name: "Holiday",
        details: "President's Day",
        staff: [],
        class: "holiday",
        start: "2025-02-17",
        end: "2025-02-17",
        eventId: "00006",
        closed: "full",
      },
      {
        name: "Holiday",
        details: "Valentine's Day",
        staff: [],
        class: "holiday",
        start: "2025-02-14",
        end: "2025-02-14",
        eventId: "00008",
        closed: "no",
      },
      {
        name: "Holiday",
        details: "St. Patrick's Day",
        staff: [],
        class: "holiday",
        start: "2025-03-17",
        end: "2025-03-17",
        eventId: "00990",
        closed: "no",
      },
      {
        name: "Off",
        details: "Joey off",
        staff: ["Joey Caparella"],
        class: "off",
        start: "2025-03-24",
        end: "2025-03-24",
        eventId: "00991",
      },
      {
        name: "Off",
        details: "Andy off",
        staff: ["Andy Wendler"],
        class: "off",
        start: "2025-03-24",
        end: "2025-03-28",
        eventId: "00992",
      },
      {
        name: "Off",
        details: "Andrew off",
        staff: ["Andrew Berry"],
        class: "off",
        start: "2026-01-01",
        end: "2026-01-03",
        eventId: "016dj",
      },
    ];
    this.sortedEvents = this.sortEvents(this.events);
    // console.log(new Date(this.events[0].start.replace(/-/g, "/").replace(/T.+/, "")));
  },
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Anton");

#calendar {
  width: 1032px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  gap: 10px;
  margin: 0 auto;
  background-color: var(--ocean-dark-blue);
  font-family: "Anton";
  border-radius: 15px;
  overflow: hidden;
  background-size: cover;
  user-select: none;
  position: relative;
}
</style>
