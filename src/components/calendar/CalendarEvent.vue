<template>
  <div :class="[event.class, 'event-container']">
    {{ event.details }}
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
  },
};
</script>
<style lang="scss" scoped>
.event-container {
  font: 400 10pt/1.1 "Roboto", "Verdana", sans-serif;
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
  font-weight: 700;

  &:hover {
    transform: none;
    cursor: default;
  }
}
.off {
  background-color: var(--ocean-off);
  opacity: 0.7;
}
.press-trip {
  background-color: var(--ocean-press-trip);
}
</style>
