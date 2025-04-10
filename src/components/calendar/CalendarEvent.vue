<template>
  <div
    :class="[event.class, 'event-container']"
    @click="emitEvent"
  >
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
    staffInitials() {
      let arr = [];
      this.event.staff.forEach((e) => {
        const split = e.split(" ");
        const first = split[0].charAt(0);
        const last = split[1].charAt(0);
        const initials = first + last;
        arr.push(initials);
      });

      return arr;
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
.event-container {
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
  font-weight: 700;

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
