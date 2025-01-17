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
    <div class="date">
      <CalendarDay
        class="day-hidden day-container"
        v-for="(n, idx) in firstMonthDay - 1"
        :key="'prev' + idx"
        :date="prevMonthDays + 1 - firstMonthDay + n"
        :currentDate="activeDate"
        month="prev"
      />
      <CalendarDay
        class="day day-container"
        :class="{ active: n === activeDate.date }"
        @click="updateDate(n)"
        v-for="(n, idx) in currentMonthDays"
        :key="'day' + idx"
        :date="n"
        :currentDate="activeDate"
      />
      <CalendarDay
        class="day-hidden day-container"
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
  },
  created() {
    this.activeDate = this.currentDate;
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
    justify-content: center;
    align-items: top;
    height: 30px;
    color: var(--white);
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
  height: 50vh;
  font-size: 1.5rem;

  .active {
    background-color: var(--white);
    color: var(--slate-green);
  }

  .day-container {
    height: 100%;
  }

  .weekend {
    color: var(--red);
  }
}
</style>
