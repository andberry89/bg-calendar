<template>
  <div
    class="event-container"
    @click="emitEvent"
  >
    <div
      v-if="event.class === 'birthday'"
      :class="event.class"
    >
      {{ event.staff[0].shortName }}'s Birthday! 🎂
    </div>
    <div
      v-if="event.class === 'press-trip'"
      :class="event.class"
    >
      {{ event.staff[0].initials }} Press Trip
    </div>
    <div
      v-if="event.class === 'vacation'"
      :class="event.class"
    >
      {{ event.staff[0].initials }} Off (Vacation)
    </div>
    <div
      v-if="event.class === 'auto-show'"
      :class="event.class"
    >
      {{ event.details }}
    </div>
    <div
      v-if="event.class === 'cd-event'"
      :class="event.class"
    >
      {{ event.details }}
    </div>
    <div
      v-if="event.class === 'holiday'"
      :class="event.class"
    >
      <strong>{{ event.details }}</strong>
    </div>
  </div>
</template>
<script>
import { differenceInDays } from "date-fns";

export default {
  name: "CalendarEvent",
  props: {
    event: {
      type: Object,
    },
  },
  computed: {
    numberOfDays() {
      return differenceInDays(this.event.end, this.event.start) + 1;
    },
  },
  methods: {
    differenceInDays: differenceInDays,
    emitEvent() {
      this.$emit("update", this.event);
    },
  },
};
</script>
<style lang="scss" scoped>
.event-container div {
  font: 400 9pt/1.1 "Roboto", "Verdana", sans-serif;
  text-align: center;
  padding: 4px;
  margin: 2px 0;
  border-radius: 8px;
  width: 115px;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }
}
.auto-show {
  background-color: var(--ocean-auto-show);
}
.birthday {
  background-color: var(--ocean-birthday);
}
.cd-event {
  background-color: var(--ocean-cd-event);
}
.holiday {
  width: 100%;
  color: var(--white);

  &:hover {
    transform: none;
    cursor: default;
  }
}
.vacation {
  background-color: var(--ocean-off);
  opacity: 0.7;
}
.press-trip {
  background-color: var(--ocean-press-trip);
}
</style>

// TODO: format calendar events based on type
