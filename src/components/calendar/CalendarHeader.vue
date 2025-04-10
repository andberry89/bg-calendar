<template>
  <header>
    <div class="date-container">
      <div class="today">
        <div>{{ currentDate.date }}</div>
        <div>{{ month[currentDate.month] }}</div>
        <div>{{ currentDate.year }}</div>
        <div
          class="date-picker-btn"
          @click="toggleDatePicker"
        >
          &#10552;
        </div>
        <div
          v-if="showDatePicker"
          class="date-picker"
        >
          <input
            type="date"
            @input="updateDate($event.target.value)"
          />
        </div>
      </div>
      <div class="date-nav">
        <div @click="monthDown">&lt;</div>
        <div @click="dateFn">Today</div>
        <div @click="monthUp">&gt;</div>
      </div>
    </div>
    <NewEvent
      :staff="staff"
      key="new-event"
      @update="addEvent($event)"
    />
  </header>
</template>
<script>
// import Button from "@/components/common/Button.vue";
import NewEvent from "./subComponents/NewEvent.vue";
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

// TODO: continue working on new event form
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
  text-shadow: 1px 1px 1px var(--dark-gray), 1px -1px 1px var(--dark-gray), -1px 1px 1px var(--dark-gray),
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
    }
  }
}
</style>
