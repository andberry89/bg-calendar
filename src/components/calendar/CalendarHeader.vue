<template>
  <header>
    <div class="current-date">
      <div class="current-day">{{ weekdayNames[currentDay] }}</div>
      <div class="today">
        <div>
          <div
            class="arrow-up"
            @click="dateUp()"
          ></div>
        </div>
        <div>
          <div
            class="arrow-up"
            @click="monthUp()"
          ></div>
        </div>
        <div>
          <div
            class="arrow-up"
            @click="yearUp()"
          ></div>
        </div>
        <div>{{ currentDate.date }}</div>
        <div>{{ month[currentDate.month] }}</div>
        <div>{{ currentDate.year }}</div>
        <div>
          <div
            class="arrow-down"
            @click="dateDown()"
          ></div>
        </div>
        <div>
          <div
            class="arrow-down"
            @click="monthDown()"
          ></div>
        </div>
        <div>
          <div
            class="arrow-down"
            @click="yearDown()"
          ></div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: "CalendarHeader",
  data() {
    return {
      newDate: {
        date: 0,
        month: 0,
        year: 0,
      },
      month: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      weekdayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
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
    currentDay() {
      return new Date(this.currentDate.year, this.currentDate.month, this.currentDate.date).getDay();
    },
  },
  methods: {
    dateUp() {
      if (this.newDate.date === this.currentMonthDays) {
        this.newDate.date = 1;
        this.monthUp();
      } else {
        this.newDate.date++;
      }
    },
    dateDown() {
      if (this.newDate.date === 1) {
        this.newDate.date = this.prevMonthDays;
        this.monthDown();
      } else {
        this.newDate.date--;
      }
    },
    monthUp() {
      if (this.newDate.month === 11) {
        this.newDate.month = 0;
        this.newDate.year++;
      } else {
        this.newDate.month++;
      }
    },
    monthDown() {
      if (this.newDate.month === 0) {
        this.newDate.month = 11;
        this.newDate.year--;
      } else {
        this.newDate.month--;
      }
    },
    yearUp() {
      this.newDate.year++;
    },
    yearDown() {
      this.newDate.year--;
    },
  },
  watch: {
    newDate: {
      handler(val) {
        this.$emit("update", val);
      },
      deep: true,
    },
  },
  created() {
    this.newDate = this.currentDate;
  },
};
</script>
<style lang="scss" scoped>
@mixin arrow-style() {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  cursor: pointer;
}

header {
  display: flex;
  justify-content: center;
  align-items: top;
  height: 400px;
  padding: 20px 0 0;
  text-align: center;
  overflow: hidden;
  color: var(--light-gray);
  text-shadow: 1px 1px 1px var(--dark-gray), 1px -1px 1px var(--dark-gray), -1px 1px 1px var(--dark-gray),
    -1px -1px 1px var(--dark-gray);

  .current-date {
    width: 300px;

    .arrow-up {
      @include arrow-style();
      border-bottom: 10px solid var(--white);

      &:hover {
        border-bottom: 10px solid var(--md-tran-black);
      }
    }
    .arrow-down {
      @include arrow-style();
      border-top: 10px solid var(--white);

      &:hover {
        border-top: 10px solid var(--md-tran-black);
      }
    }
  }
  .today {
    display: grid;
    grid-template-columns: 40px auto 70px;
    grid-gap: 0;

    div {
      display: flex;
      justify-content: center;
    }
  }
  .current-day {
    font-size: 4rem;
  }
  .today {
    font-size: 2rem;
  }
}
</style>
