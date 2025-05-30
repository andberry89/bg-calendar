<template>
  <div :class="[dayClass, { weekend: isWeekend }, { fullClose: hasFullClosureHoliday }, 'container']">
    <EventModal
      v-if="showEventDetails"
      :event="modalEvent"
      :day="getDay"
      @update="closeModal"
      @delete="deleteEvent($event)"
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
      @click="openEventModal(event)"
      @update="updateEvents"
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
    hasFullClosureHoliday() {
      if (this.holidays.length > 0) {
        const e = this.holidays.find((x) => x.closed === "full");
        if (e) return true;
      }
      return false;
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
    deleteEvent(event) {
      this.$emit("delete", event);
      this.closeModal();
    },
    openEventModal(event) {
      this.modalEvent = event;
      this.showEventDetails = true;
    },
    sortEvents() {
      this.holidays = this.events.filter((e) => e.type === "Holiday");
      this.filteredEvents = this.events.filter((e) => e.type !== "Holiday");
    },
    updateEvents() {
      this.$emit("update");
    },
  },
  created() {
    this.sortEvents();
  },
  watch: {
    events: {
      handler() {
        this.sortEvents();
      },
      immediate: true, // Trigger the watcher immediately
      deep: true, // Watch deeply to account for nested changes in the array
    },
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
.fullClose {
  background-color: var(--ocean-dark-gray);
}
.weekend {
  background-color: var(--ocean-dark-blue);

  // &:hover {
  //   color: var(--red);
  // }
}
.date-text {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  font-size: 1rem;
  border-bottom: 1px solid var(--ocean-gray);
  width: 100%;
  text-align: center;
  margin-bottom: 5px;
}
</style>
