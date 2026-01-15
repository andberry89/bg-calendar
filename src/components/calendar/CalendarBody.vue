<template>
  <section class="flex h-full flex-col">
    <!-- Weekdays row -->
    <div
      class="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-y-[10px] gap-x-[2px]
             px-[20px] pt-[10px] pb-[10px]
             bg-[var(--md-tran-black)] border-b border-[var(--white)]
             text-[1.5em] text-[var(--ocean-gray)]"
    >
      <div
        v-for="(weekday, idx) in weekdays"
        :key="idx"
        class="flex flex-col flex-wrap items-center justify-start rounded-[5px]
               first:text-[var(--red)] [&:nth-child(7n)]:text-[var(--red)]"
      >
        {{ weekday }}
      </div>
    </div>

    <!-- Dates grid -->
    <div
      v-if="dataReady"
      class="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-y-[10px] gap-x-[2px]
             px-[20px] pt-[10px] pb-[20px]
             bg-[var(--lt-tran-black)] flex-grow"
    >
      <CalendarDay
        dayClass="day-hidden"
        v-for="(n, idx) in firstMonthDay - 1"
        :key="'prev' + idx"
        :date="prevMonthDays + 1 - firstMonthDay + n"
        :currentDate="activeDate"
        month="prev"
      />

      <CalendarDay
        dayClass="day"
        v-for="(n, idx) in currentMonthDays"
        :key="'day' + idx"
        :date="n"
        :currentDate="activeDate"
        :events="this.events[n - 1]"
        @click="updateDate(n)"
        @update="updateEvents"
        @delete="deleteEvent($event)"
        :class="[
          'flex flex-col flex-wrap items-center justify-start rounded-[5px]',
          n === activeDate.date ? 'bg-[var(--ocean-lt-blue)]' : ''
        ]"
      />

      <CalendarDay
        dayClass="day-hidden"
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
import assignEvents from "./utils/assignEvents";

export default {
  name: "CalendarBody",
  data() {
    return {
      activeDate: {
        date: 0,
        month: 0,
        year: 0,
      },
      dataReady: false,
      events: [],
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
    currentMonthEvents: Array,
  },
  computed: {
    firstMonthDay() {
      let firstDay = new Date(this.activeDate.year, this.activeDate.month, 1).getDay();
      return firstDay + 1;
    },
  },
  methods: {
    assignEvents: assignEvents,
    deleteEvent(event) {
      this.$emit("delete", event);
    },
    getDay(date) {
      const day = new Date(date.year, date.month, date.date).getDay();
      return { ...date, day: day };
    },
    updateDate(date) {
      this.activeDate.date = date;
      this.$emit("date", this.activeDate);
    },
    updateEvents() {
      if (!this.currentMonthDays || !this.currentMonthEvents) {
        // wait until both are available
        return;
      }

      this.events = assignEvents(this.currentMonthEvents, this.currentDate.month, this.currentMonthDays);
      this.dataReady = true;
    },
  },
  watch: {
    activeDate: {
      handler() {
        this.updateEvents();
      },
      deep: true,
    },
    currentMonthDays: {
      handler() {
        this.updateEvents();
      },
      immediate: true, // Trigger immediately when the component is initialized
    },
    currentMonthEvents: {
      handler() {
        this.updateEvents();
      },
      immediate: true, // Trigger immediately when the component is initialized
    },
  },
  created() {
    this.activeDate = { ...this.currentDate };
    this.updateEvents();
  },
};
</script>