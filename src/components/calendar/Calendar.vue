<template>
  <main class="flex flex-nowrap justify-center items-start gap-[15px] px-[10px]">
    <article id="staff-list">
      <StaffList
        :staff="staff"
        key="staff-list"
        @update="updateStaff($event)"
      />
    </article>

    <article
      id="calendar"
      class="relative flex basis-[1050px] w-[1032px] flex-col justify-start gap-[10px]
             overflow-hidden rounded-[15px] bg-[var(--ocean-dark-blue)]
             bg-cover select-none font-anton"
    >
      <!-- Optional background image version kept as comment -->
      <!--
      :style="{ 'background-image': 'url(' + require('@/assets/calendar/' + currentDate.month + '.jpg') + ')' }"
      -->

      <CalendarHeader
        :currentDate="currentDate"
        :prevMonthDays="prevMonthDays"
        :currentMonthDays="currentMonthDays"
        @date="updateDate($event)"
        @update="updateEvents('add', $event)"
        :dateFn="getCurrentDate"
        :staff="staff"
        key="calendar-header"
      />

      <CalendarBody
        :currentDate="currentDate"
        :prevMonthDays="prevMonthDays"
        :currentMonthDays="currentMonthDays"
        :currentMonthEvents="currentMonthEvents"
        :key="currentDate.month + '-' + currentDate.year"
        @date="updateDate($event)"
        @delete="updateEvents('delete', $event)"
      />
    </article>

    <EventList
      :events="currentMonthEvents"
      :currentDate="currentDate"
      v-if="showEvents"
    />
  </main>

  <footer class="text-center">
    <em>Version 1.1.0</em> - 7/10/2025
  </footer>
</template>

<script>
import CalendarHeader from "./CalendarHeader.vue";
import CalendarBody from "./CalendarBody.vue";
import StaffList from "./StaffList.vue";
import EventList from "./components/EventList.vue";
import { useStaffStore } from "@/stores/staff";
import { useEventsStore } from "@/stores/events";

export default {
  name: "Calendar",
  data() {
    return {
      currentDate: {
        date: 0,
        month: 0,
        year: 0,
      },
      showEvents: false,
    };
  },
  components: {
    CalendarHeader,
    CalendarBody,
    EventList,
    StaffList,
  },
  computed: {
    prevMonthDays() {
      let year = this.currentDate.month === 0 ? this.currentDate.year - 1 : this.currentDate.year;
      let month = this.currentDate.month === 0 ? 12 : this.currentDate.month;
      return new Date(year, month, 0).getDate();
    },
    currentMonthDays() {
      return new Date(this.currentDate.year, this.currentDate.month + 1, 0).getDate();
    },
    currentMonthEvents() {
      const store = useEventsStore();
      return store.eventsForMonth(this.currentDate.year, this.currentDate.month);
    },
    staff() {
      return useStaffStore().staff;
    }
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
    async updateEvents(fn, event) {
      const store = useEventsStore();

      try {
        if (fn === "add") {
          await store.addEvent(event);
        } else {
          await store.removeEvent(event.id);
        }
      } catch (err) {
        console.warn(err);
      }
    },

    async updateStaff(staffFn) {
      const store = useStaffStore();
      const fn = staffFn[0];
      const person = staffFn[1];

      try {
        if (fn === "add") {
          await store.addStaff(person);
        } else {
          await store.removeStaff(person.id);
        }
      } catch (err) {
        console.warn(err);
      }
    },
  },
  created() {
    this.getCurrentDate();
  },
  watch: {
  currentDate: {
    handler(val) {
      useEventsStore().fetchEventsForMonth(val.year, val.month);
    },
    deep: true,
  },
},

  mounted() {
    useEventsStore().fetchEventsForMonth(this.currentDate.year, this.currentDate.month);
    useStaffStore().fetchStaff();
  },
};
</script>