<template>
  <article
    id="calendar"
    :style="{ 'background-image': 'url(' + require('@/assets/calendar/' + currentDate.month + '.jpg') + ')' }"
  >
    <CalendarHeader
      :currentDate="currentDate"
      :prevMonthDays="prevMonthDays"
      :currentMonthDays="currentMonthDays"
      @update="updateDate($event)"
    />
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
          :class="{ active: n === currentDate.date }"
          @click="currentDate.date = n"
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
  </article>
</template>
<script>
import CalendarHeader from "./CalendarHeader.vue";

export default {
  name: "Calendar",
  data() {
    return {
      weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      currentDate: {
        date: 0,
        month: 0,
        year: 0,
      },
    };
  },
  components: {
    CalendarHeader,
  },
  computed: {
    prevMonthDays() {
      let year = this.currentDate.month === 0 ? this.currentDate.year - 1 : this.currentDate.year;
      let month = this.currentDate.month === 0 ? 12 : this.currentDate.month;
      return new Date(year, month, 0).getDate();
    },
    firstMonthDay() {
      let firstDay = new Date(this.currentDate.year, this.currentDate.month, 1).getDay();
      return firstDay + 1;
    },
    currentMonthDays() {
      return new Date(this.currentDate.year, this.currentDate.month + 1, 0).getDate();
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
  },
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Anton");

@mixin arrow-style() {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  cursor: pointer;
}

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

#calendar {
  width: 460px;
  height: 730px;
  background-color: var(--light-gray);
  font-family: "Anton";
  border-radius: 15px;
  overflow: hidden;
  background-size: cover;
  user-select: none;

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
}
</style>
