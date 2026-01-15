<template>
  <div
    v-click-outside="closeModal"
    :class="[
      'absolute top-[-25px] z-[99] w-[275px] rounded-[8px] border border-[var(--black)] bg-[var(--light-gray)] text-[var(--black)] px-[8px] pt-[12px] pb-[4px] text-left font-[\'Arial\',_sans-serif] text-[0.9rem] leading-[1]',
      day < 4 ? 'left-[25%]' : 'right-[25%]'
    ]"
  >
    <div
      class="absolute top-[-15px] left-[-12px] rounded-[10px] border border-[var(--black)]
             bg-[var(--ocean-event-detail)] px-[6px] py-[3px] transition duration-200
             hover:bg-[var(--white)] hover:text-[var(--black)] hover:cursor-pointer"
      @click="closeModal"
    >
      X
    </div>

    <div class="my-[5px]">
      <div class="my-[5px] border-b border-[var(--black)] text-[1rem] font-bold">
        <span class="font-normal">
          {{ event.class === "cd-event" ? event.details : event.type }}
          {{ event.class === "Birthday" ? "🎂" : "" }}
        </span>
      </div>

      <div class="my-[5px]">
        {{ eventDates }}
      </div>

      <div v-if="event.staff.length > 0" class="my-[5px]">
        <p
          v-for="person in event.staff"
          :key="person.lastName"
          class="m-0"
        >
          {{ person.shortName }}
        </p>
      </div>
    </div>

    <div class="mt-[35px] flex justify-end pt-[5px] text-[0.8rem]">
      <span
        class="inline-block transition duration-200 hover:text-[var(--ocean-event-detail)] hover:cursor-pointer"
        @click="deleteEvent"
      >
        Delete Event &#x2718;
      </span>
    </div>
  </div>
</template>

<script>
import { format, parseISO } from "date-fns";

export default {
  name: "EventModal",
  data() {
    return {
      showEdit: false,
    };
  },
  props: {
    day: {
      type: Number,
      required: true,
    },
    event: {
      type: Object,
      required: true,
    },
  },
  computed: {
    eventDates() {
      const startDate = new Date(this.event.start.replace(/-/g, "/"));
      const start = this.format(startDate, "MM/dd/yyyy");
      if (this.event.start === this.event.end) {
        return start;
      } else {
        const endDate = new Date(this.event.end.replace(/-/g, "/"));
        const end = this.format(endDate, "MM/dd/yyyy");
        return start + " - " + end;
      }
    },
  },
  methods: {
    format: format,
    parseISO: parseISO,
    closeEdit() {
      this.showEdit = false;
    },
    closeModal() {
      this.$emit("update");
    },
    deleteEvent() {
      this.$emit("delete", this.event);
    },
    openEdit() {
      this.showEdit = true;
    },
  },
};
</script>
