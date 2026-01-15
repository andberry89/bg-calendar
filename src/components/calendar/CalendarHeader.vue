<template>
  <header
    class="flex items-center justify-between px-[50px] text-center text-[var(--light-gray)]
           [text-shadow:1px_1px_1px_var(--dark-gray),1px_-1px_1px_var(--dark-gray),-1px_1px_1px_var(--dark-gray),-1px_-1px_1px_var(--dark-gray)]
           h-[15vh]"
  >
    <div class="flex w-[30%] flex-col items-center gap-[25px]">
      <div class="relative grid grid-cols-[40px_auto_70px_auto] gap-[10px] text-[2rem]">
        <div class="flex justify-center">{{ currentDate.date }}</div>
        <div class="flex justify-center">{{ month[currentDate.month] }}</div>
        <div class="flex justify-center">{{ currentDate.year }}</div>

        <div
          class="flex justify-center px-[4px] hover:cursor-pointer"
          @click="toggleDatePicker"
        >
          &#10552;
        </div>

        <div
          v-if="showDatePicker"
          class="absolute right-0 bottom-[-20px]"
        >
          <input
            type="date"
            @input="updateDate($event.target.value)"
          />
        </div>
      </div>

      <div class="flex items-center gap-[8px] text-[1.5rem]">
        <div
          @click="monthDown"
          class="rounded-[8px] border border-[var(--white)] px-[14px] py-[2px] text-[1rem] transition-[background-color] duration-[400ms] hover:bg-[var(--ocean-lt-blue)] hover:cursor-pointer"
        >
          &lt; {{ lastMonth }}
        </div>

        <div
          @click="dateFn"
          class="rounded-[8px] border border-[var(--white)] px-[14px] py-[2px] transition-[background-color] duration-[400ms] hover:bg-[var(--ocean-lt-blue)] hover:cursor-pointer"
        >
          Today
        </div>

        <div
          @click="monthUp"
          class="rounded-[8px] border border-[var(--white)] px-[14px] py-[2px] text-[1rem] transition-[background-color] duration-[400ms] hover:bg-[var(--ocean-lt-blue)] hover:cursor-pointer"
        >
          {{ nextMonth }} &gt;
        </div>
      </div>
    </div>

    <div class="calendar-title">
      <h1>C/D Buyers Guide</h1>
      <h2>Team Calendar</h2>
    </div>

    <NewEvent
      :staff="staff"
      key="new-event"
      @update="addEvent($event)"
    />
  </header>
</template>

<script>
import NewEvent from "./components/NewEvent.vue";
import { month, weekdayNames } from "./utils/selectOptions";

export default {
  name: "CalendarHeader",
  data() {
    return {
      showDatePicker: false,
      newDate: {
        date: 0,
        month: 0,
        year: 0,
      },
      month: month,
      weekdayNames: weekdayNames,
    };
  },
  components: {
    NewEvent,
  },
  props: {
    currentDate: {
      type: Object,
      required: true,
    },
    prevMonthDays: Number,
    currentMonthDays: Number,
    staff: Array,
    dateFn: {
      type: Function,
      required: false,
    },
  },
  computed: {
    currentDay() {
      return new Date(this.currentDate.year, this.currentDate.month, this.currentDate.date).getDay();
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
      const today = new Date();
      return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    },
  },
  methods: {
    addEvent(event) {
      this.$emit("update", event);
    },
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
    toggleDatePicker() {
      this.showDatePicker = !this.showDatePicker;
    },
    updateDate(date) {
      const split = date.split("-");
      this.newDate.year = parseInt(split[0]);
      this.newDate.month = parseInt(split[1] - 1);
      this.newDate.date = parseInt(split[2]);
      this.toggleDatePicker();
    },
  },
  watch: {
    newDate: {
      handler(val) {
        this.$emit("date", val);
      },
      deep: true,
    },
  },
  created() {
    this.newDate = this.currentDate;
  },
};
</script>
