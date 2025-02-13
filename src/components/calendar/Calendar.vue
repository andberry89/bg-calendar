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
    />
    <CalendarBody
      :currentDate="currentDate"
      :prevMonthDays="prevMonthDays"
      :currentMonthDays="currentMonthDays"
      :currentMonthEvents="currentMonthEvents"
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
      return this.events.filter((e) => {
        const month = e.start.split("-")[1];
        return this.currentDate.month === month - 1;
      });
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
        staff: "Andrew",
        start: "2025-02-14",
        end: "2025-02-14",
        eventId: "00002",
      },
      {
        name: "Press Trip",
        details: "Volvo in Sweden",
        staff: "Austin",
        class: "press-trip",
        start: "2025-02-08",
        end: "2025-02-14",
        eventId: "00003",
      },
      {
        name: "Press Trip",
        details: "Palm Springs",
        staff: "Drew",
        class: "press-trip",
        start: "2025-02-10",
        end: "2025-02-11",
        eventId: "00007",
      },
      {
        name: "Off",
        details: "Drew Off",
        staff: "Drew",
        class: "off",
        start: "2025-02-14",
        end: "2025-02-18",
        eventId: "00004",
      },
      {
        name: "Car and Driver Event",
        details: "Lightning Lap Live @ 9:00 AM",
        staff: "",
        class: "cd-event",
        start: "2025-02-20",
        end: "2025-02-20",
        eventId: "00005",
      },
      {
        name: "Holiday",
        details: "President's Day",
        staff: "",
        class: "holiday",
        start: "2025-02-17",
        end: "2025-02-17",
        eventId: "00006",
        closed: true,
      },
      {
        name: "Holiday",
        details: "Valentine's Day",
        staff: "",
        class: "holiday",
        start: "2025-02-14",
        end: "2025-02-14",
        eventId: "00008",
        closed: false,
      },
      {
        name: "Holiday",
        details: "St. Patrick's Day",
        staff: "",
        class: "holiday",
        start: "2025-03-17",
        end: "2025-03-17",
        eventId: "00990",
        closed: false,
      },
      {
        name: "Off",
        details: "Joey off",
        staff: "Joey",
        class: "off",
        start: "2025-03-24",
        end: "2025-03-24",
        eventId: "00991",
        closed: false,
      },
      {
        name: "Off",
        details: "Andy off",
        staff: "Andy",
        class: "off",
        start: "2025-03-24",
        end: "2025-03-28",
        eventId: "00992",
        closed: false,
      },
    ];
    // console.log(new Date(this.events[0].start.replace(/-/g, "/").replace(/T.+/, "")));
  },
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Anton");

#calendar {
  width: 1032px;
  height: 99vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  margin: 0 auto;
  background-color: var(--ocean-dark-blue);
  font-family: "Anton";
  border-radius: 15px;
  overflow: hidden;
  background-size: cover;
  user-select: none;
}
</style>
