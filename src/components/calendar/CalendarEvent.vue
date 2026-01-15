<template>
  <div @click="emitEvent">
    <div
      v-if="event.class === 'birthday'"
      class="event-chip bg-[var(--ocean-birthday)]"
    >
      {{ event.staff[0].shortName }}'s Birthday! 🎂
    </div>

    <div
      v-if="event.class === 'press-trip'"
      class="event-chip bg-[var(--ocean-press-trip)]"
    >
      {{ event.staff[0].initials }} Press Trip
    </div>

    <div
      v-if="event.class === 'vacation'"
      class="event-chip bg-[var(--ocean-off)] opacity-70"
    >
      {{ event.staff[0].initials }} Off (PTO)
    </div>

    <div
      v-if="event.class === 'auto-show'"
      class="event-chip bg-[var(--ocean-auto-show)]"
    >
      <strong>Auto Show</strong><br />
      {{ event.details }}
    </div>

    <div
      v-if="event.class === 'cd-event'"
      class="event-chip bg-[var(--ocean-cd-event)]"
    >
      {{ event.details }}
    </div>

    <div
      v-if="event.class === 'holiday'"
      class="event-chip w-full bg-[var(--ocean-red)] text-[var(--white)] hover:transform-none hover:cursor-default"
    >
      <strong>{{ event.details }}</strong><br />
      <span v-if="event.closed === 'half'">Early Close</span>
      <span v-if="event.closed === 'full'">Office Closed</span>
    </div>
  </div>
</template>

<script>
import { differenceInDays } from "date-fns";

export default {
  name: "CalendarEvent",
  props: {
    event: { type: Object },
  },
  computed: {
    numberOfDays() {
      return differenceInDays(this.event.end, this.event.start) + 1;
    },
  },
  methods: {
    emitEvent() {
      this.$emit("update", this.event);
    },
  },
};
</script>
