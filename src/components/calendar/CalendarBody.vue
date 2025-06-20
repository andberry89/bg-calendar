<template>
  <section class="calendar-body">
    <div class="weekdays">
      <div
        class="weekday"
        v-for="(weekday, idx) in weekdays"
        :key="idx"
      >
        {{ weekday }}
      </div>
    </div>
    <div
      class="date"
      v-if="dataReady"
    >
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
        :events="this.events[n - 1]"
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
<script>
import CalendarDay from "./CalendarDay.vue";
import assignEvents from "./utils/assignEvents";

export default {
  name: "CalendarBody",
  data() {
    return {
      activeDate: {
        date: 0,
        month: 0,
        year: 0,
      },
      dataReady: false,
      events: [],
      weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    };
  },
  components: {
    CalendarDay,
  },
  props: {
    currentDate: {
      type: Object,
      required: true,
    },
    prevMonthDays: Number,
    currentMonthDays: Number,
    currentMonthEvents: Array,
  },
  computed: {
    firstMonthDay() {
      let firstDay = new Date(this.activeDate.year, this.activeDate.month, 1).getDay();
      return firstDay + 1;
    },
  },
  methods: {
    assignEvents: assignEvents,
    deleteEvent(event) {
      this.$emit("delete", event);
    },
    getDay(date) {
      const day = new Date(date.year, date.month, date.date).getDay();
      return { ...date, day: day };
    },
    updateDate(date) {
      this.activeDate.date = date;
      this.$emit("date", this.activeDate);
    },
    updateEvents() {
      if (!this.currentMonthDays || !this.currentMonthEvents) {
        // wait until both are available
        return;
      }

      this.events = assignEvents(this.currentMonthEvents, this.currentDate.month, this.currentMonthDays);
      this.dataReady = true;
    },
  },
  watch: {
    activeDate: {
      handler() {
        this.updateEvents();
      },
      deep: true,
    },
    currentMonthDays: {
      handler() {
        this.updateEvents();
      },
      immediate: true, // Trigger immediately when the component is initialized
    },
    currentMonthEvents: {
      handler() {
        this.updateEvents();
      },
      immediate: true, // Trigger immediately when the component is initialized
    },
  },
  created() {
    this.activeDate = { ...this.currentDate };
    this.updateEvents();
  },
};
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
