<template>
  <header>
    <div class="date-container">
      <div class="today">
        <div>{{ currentDate.date }}</div>
        <div>{{ month[currentDate.month] }}</div>
        <div>{{ currentDate.year }}</div>
        <div class="date-picker-btn" @click="toggleDatePicker">&#10552;</div>
        <div v-if="showDatePicker" class="date-picker">
          <input type="date" @input="updateDate($event.target.value)" />
        </div>
      </div>
      <div class="date-nav">
        <div @click="goToPreviousMonth" class="small-month">&lt; {{ lastMonth }}</div>
        <div @click="goToToday">Today</div>
        <div @click="goToNextMonth" class="small-month">{{ nextMonth }} &gt;</div>
      </div>
    </div>
    <div class="calendar-title">
      <h1>C/D Buyers Guide</h1>
      <h2>Team Calendar</h2>
    </div>
    <NewEvent :staff="staff" key="new-event" @update="addEvent($event)" />
  </header>
</template>
<script>
import NewEvent from './components/NewEvent.vue';
import { month, weekdayNames } from './utils/selectOptions';

export default {
  name: 'CalendarHeader',
  data() {
    return {
      showDatePicker: false,
      newDate: {
        date: 0,
        month: 0,
        year: 0
      },
      month: month,
      weekdayNames: weekdayNames
    };
  },
  components: {
    NewEvent
  },
  props: {
    currentDate: {
      type: Object,
      required: true
    },
    prevMonthDays: Number,
    currentMonthDays: Number,
    staff: Array,
    dateFn: {
      type: Function,
      required: false
    }
  },
  computed: {
    currentDay() {
      return new Date(
        this.currentDate.year,
        this.currentDate.month,
        this.currentDate.date
      ).getDay();
    },
    lastMonth() {
      let lastMonth = month[this.currentDate.month - 1];
      if (this.currentDate.month === 0) {
        lastMonth = month[11];
      }
      return lastMonth.substring(0, 3);
    },
    nextMonth() {
      let nextMonth = month[this.currentDate.month + 1];
      if (this.currentDate.month === 11) {
        nextMonth = month[0];
      }
      return nextMonth.substring(0, 3);
    },
    today() {
      return new Date();
    }
  },
  methods: {
    addEvent(event) {
      this.$emit('update', event);
    },
    goToToday() {
      this.$emit('date', {
        date: this.today.getDate(),
        month: this.today.getMonth(),
        year: this.today.getFullYear()
      });
    },
    goToNextMonth() {
      const nextDate = { ...this.currentDate };

      if (nextDate.month === 11) {
        nextDate.month = 0;
        nextDate.year++;
      } else {
        nextDate.month++;
      }

      nextDate.date = 1;
      this.$emit('date', nextDate);
    },
    goToPreviousMonth() {
      const prevDate = { ...this.currentDate };

      if (prevDate.month === 0) {
        prevDate.month = 11;
        prevDate.year--;
      } else {
        prevDate.month--;
      }

      prevDate.date = 1;
      this.$emit('date', prevDate);
    },
    toggleDatePicker() {
      this.showDatePicker = !this.showDatePicker;
    },
    updateDate(date) {
      const split = date.split('-');

      this.$emit('date', {
        year: parseInt(split[0], 10),
        month: parseInt(split[1], 10) - 1,
        date: parseInt(split[2], 10)
      });

      this.toggleDatePicker();
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin arrow-style() {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  cursor: pointer;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  text-align: center;
  color: var(--light-gray);
  text-shadow:
    1px 1px 1px var(--dark-gray),
    1px -1px 1px var(--dark-gray),
    -1px 1px 1px var(--dark-gray),
    -1px -1px 1px var(--dark-gray);
  height: 15vh;

  .date-container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 25px;
    width: 30%;

    .arrow-left {
      @include arrow-style();
      border-right: 10px solid var(--white);

      &:hover {
        border-right: 10px solid var(--md-tran-black);
      }
    }
    .arrow-right {
      @include arrow-style();
      border-left: 10px solid var(--white);

      &:hover {
        border-left: 10px solid var(--md-tran-black);
      }
    }

    .today {
      display: grid;
      grid-template-columns: 40px auto 70px auto;
      grid-gap: 10px;
      font-size: 2rem;
      position: relative;

      div {
        display: flex;
        justify-content: center;
      }

      .date-picker-btn {
        padding: 0 4px;

        &:hover {
          cursor: pointer;
        }
      }

      .date-picker {
        position: absolute;
        bottom: -20px;
        right: 0;
      }
    }

    .date-nav {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      font-size: 1.5rem;
      gap: 8px;

      div {
        border: 1px solid var(--white);
        border-radius: 8px;
        padding: 2px 14px;
        transition: 0.4s;

        &:hover {
          background-color: var(--ocean-lt-blue);
          cursor: pointer;
        }
      }

      .small-month {
        font-size: 1rem;
      }
    }
  }
}
</style>
