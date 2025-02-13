<template>
  <section>
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
    getDay(date) {
      const day = new Date(date.year, date.month, date.date).getDay();
      return { ...date, day: day };
    },
    updateDate(date) {
      this.activeDate.date = date;
      this.$emit("update", this.activeDate);
    },
    updateEvents() {
      this.events = Array.from({ length: this.currentMonthDays }, () => []);
      this.currentMonthEvents.forEach((e) => {
        const startIdx = e.start.split("-")[2] - 1;
        const endIdx = e.end.split("-")[2] - 1;

        for (let i = startIdx; i < endIdx + 1; i++) {
          this.events[i].push(e);
        }
      });
      this.dataReady = true;
      //TODO: Work on how to have events that span several days
    },
  },
  watch: {
    "activeDate.month": {
      handler() {
        this.updateEvents();
      },
    },
    "activeDate.year": {
      handler() {
        this.updateEvents();
      },
    },
  },
  created() {
    this.activeDate = this.currentDate;
    this.updateEvents();

    //TODO: Events aren't updating when months are changing
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

.weekdays {
  @include calendar-layout(10px 20px 10px);
  background-color: var(--md-tran-black);
  border-bottom: 1px solid var(--white);
  font-size: 1.5em;

  div:first-child,
  div:nth-child(7n) {
    color: var(--red);
  }
}

.date {
  @include calendar-layout(10px 20px 20px);
  background-color: var(--lt-tran-black);
  height: 75vh;

  .active {
    background-color: var(--ocean-lt-blue);
  }
}
</style>
