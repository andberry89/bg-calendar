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
      <div
        class="day-hidden"
        v-for="(n, idx) in firstMonthDay - 1"
        :key="'prev' + idx"
      >
        {{ prevMonthDays + 1 - firstMonthDay + n }}
      </div>
      <div
        class="day"
        :class="{ active: n === activeDate.date }"
        @click="updateDate(n)"
        v-for="(n, idx) in currentMonthDays"
        :key="'day' + idx"
      >
        {{ n }}
      </div>
      <div
        class="day-hidden"
        v-for="(n, idx) in 43 - (currentMonthDays + firstMonthDay)"
        :key="'next' + idx"
      >
        {{ n }}
      </div>
    </div>
  </section>
</template>
<script>
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
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  grid-gap: 10px;
  padding: $property;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    color: var(--white);
    border-radius: 5px;
  }
}

.weekdays {
  @include calendar-layout(10px 20px 10px);
  background-color: var(--md-tran-black);
  border-bottom: 1px solid var(--white);

  div:first-child,
  div:nth-child(7n) {
    color: var(--red);
  }
}

.date {
  @include calendar-layout(10px 20px 20px);
  background-color: var(--lt-tran-black);

  .active {
    background-color: var(--white);
    color: var(--slate-green);
  }

  .day {
    cursor: pointer;

    &:hover {
      background-color: var(--white);
      color: var(--slate-green);
    }

    &:first-child,
    &:nth-child(7n) {
      color: var(--red);

      &:hover {
        background-color: var(--white);
        color: var(--red);
      }
    }
  }

  .day-hidden {
    opacity: 0.4;

    &:first-child,
    &:nth-child(7) {
      color: var(--red);
    }
  }
}
</style>
