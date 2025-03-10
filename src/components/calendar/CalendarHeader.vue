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
    <div class="new-event-container">
      <Button @click="toggleForm">New Event</Button>
      <Transition name="drop-form">
        <div
          v-if="showForm"
          class="new-event-form-container"
        >
          <div class="new-event-form">
            <label for="eventType">Event Type</label>
            <select
              name="eventType"
              id="eventType"
              v-model="newEvent.name"
            >
              <option
                disabled
                value="Event Type"
              >
                --Event Type--
              </option>
              <option
                v-for="(event, idx) in eventType"
                :key="'event-' + idx"
                :value="event"
              >
                {{ event }}
              </option>
            </select>
            <label for="details">Event Details</label>
            <input
              type="text"
              placeholder="Details"
              v-model="newEvent.details"
              name="details"
              id="details"
            />
            <label for="startDate">Start Date</label>
            <input
              type="date"
              v-model="newEvent.start"
              name="startDate"
              id="startDate"
              @input="checkEndDate"
            />
            <label for="endDate">End Date</label>
            <input
              type="date"
              v-model="newEvent.end"
              name="endDate"
              id="endDate"
            />
            <ul>
              <li
                v-for="(s, idx) in staff"
                :key="'staff-' + idx"
              >
                <input
                  type="checkbox"
                  :id="'staff' + idx"
                  :name="'staff' + idx"
                  :value="s.lastName"
                /><label :for="'staff' + idx">{{ s.shortName }}</label>
              </li>
            </ul>
            <button class="submit-event-button">Add Event</button>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>
<script>
import Button from "@/components/common/Button.vue";
import { month, weekdayNames, eventType } from "./utils/selectOptions";
import { compareDesc, parse } from "date-fns";

export default {
  name: "CalendarHeader",
  data() {
    return {
      showDatePicker: false,
      showForm: true,
      newEvent: {
        class: "",
        closed: "",
        details: "",
        end: "",
        name: "",
        staff: [],
        start: "",
      },
      newDate: {
        date: 0,
        month: 0,
        year: 0,
      },
      eventType: eventType,
      month: month,
      weekdayNames: weekdayNames,
    };
  },
  components: {
    Button,
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
    compareDesc: compareDesc,
    parse: parse,
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
    checkEndDate() {
      if (this.newEvent.end === "") {
        this.newEvent.end = this.newEvent.start;
      } else {
        // compare the two dates
        // if startDate comes AFTER endDate, then update endDate to match startDate
        const startDate = parse(this.newEvent.start, "yyyy-MM-dd", new Date());
        const endDate = parse(this.newEvent.end, "yyyy-MM-dd", new Date());
        const result = compareDesc(startDate, endDate);
        if (result < 0) {
          this.newEvent.end = this.newEvent.start;
        }
      }
    },
    toggleForm() {
      this.showForm = !this.showForm;
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
        this.$emit("update", val);
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

  .new-event-container {
    position: relative;
    width: 25%;
    font: 400 1rem/1 "Arial", sans-serif;
    text-shadow: none;
    color: var(--black);

    .drop-form-enter-active,
    .drop-form-leave-active {
      transition: all 0.5s ease;
    }

    .drop-form-enter-from,
    .drop-form-leave-to {
      opacity: 0;
      transform: translateY(-10px);
    }

    .new-event-form-container {
      position: absolute;
      bottom: -250px;
      right: 18px;
      border: 1px solid var(--white);
      background-color: var(--ocean-lt-blue);
      padding: 15px 30px 15px 10px;
      text-align: left;
      z-index: 99;

      .new-event-form {
        label {
          font-size: 0.7rem;
          font-weight: 700;
          display: block;
        }
        input,
        select {
          margin-bottom: 5px;
        }
        ul {
          padding: 0;
          list-style: none;
          margin: 0;

          li {
            display: flex;
            align-items: center;

            label {
              display: inline;
            }
          }
        }
        button {
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
