<template>
  <div :class="[dayClass, { weekend: isWeekend }, 'container']">
    <EventModal
      v-if="showEventDetails"
      :event="modalEvent"
      :day="getDay"
      @update="closeModal"
    />
    <div class="date-text">
      {{ date }}
      <CalendarEvent
        v-for="(event, idx) in holidays"
        :key="'holiday-' + idx"
        :event="event"
      />
    </div>
    <CalendarEvent
      v-for="(event, idx) in filteredEvents"
      :key="'event-' + idx"
      :event="event"
      @update="updateEventModal($event)"
    />
  </div>
</template>
<script>
import CalendarEvent from "./CalendarEvent.vue";
import EventModal from "./EventModal.vue";

export default {
  name: "CalendarDay",
  data() {
    return {
      holidays: [],
      filteredEvents: [],
      showEventDetails: false,
      modalEvent: {},
    };
  },
  components: {
    CalendarEvent,
    EventModal,
  },
  props: {
    date: Number,
    dayClass: String,
    currentDate: {
      type: Object,
    },
    month: {
      type: String,
      required: false,
    },
    events: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  computed: {
    getDay() {
      let date = { ...this.currentDate };
      return new Date(date.year, date.month, this.date).getDay();
    },
    isWeekend() {
      let date = { ...this.currentDate };
      if (this.month === "prev") {
        if (date.month === 0) {
          date.month = 11;
          date.year--;
        } else {
          date.month--;
        }
      }
      if (this.month === "next") {
        if (date.month === 11) {
          date.month = 0;
          date.year++;
        } else {
          date.month++;
        }
      }

      const day = new Date(date.year, date.month, this.date).getDay();
      return day === 0 || day === 6;
    },
  },
  methods: {
    closeModal() {
      this.modalEvent = {};
      this.showEventDetails = false;
    },
    updateEventModal(event) {
      this.modalEvent = event;
      this.showEventDetails = true;
    },
  },
  created() {
    this.holidays = this.events.filter((e) => e.name === "Holiday");
    this.filteredEvents = this.events.filter((e) => e.name !== "Holiday");
  },
};
</script>
<style lang="scss" scoped>
.container {
  font-size: 0.75rem;
  height: 200px;
  position: relative;
}
.day {
  border: 1px solid var(--white);
  background-color: var(--ocean-md-blue);
  color: var(--white);

  // &:hover {
  //   background-color: var(--ocean-gray);
  //   color: var(--ocean-yellow);
  // }
}
.day-hidden {
  opacity: 0.5;
  border: 1px solid var(--ocean-gray);
  background-color: var(--ocean-dark-blue);

  .date-text {
    color: var(--white);
  }
}

.weekend {
  background-color: var(--ocean-dark-blue);

  // &:hover {
  //   color: var(--red);
  // }
}
.date-text {
  font-size: 1rem;
  border-bottom: 1px solid var(--ocean-gray);
  width: 100%;
  text-align: center;
  margin-bottom: 5px;
}
</style>
