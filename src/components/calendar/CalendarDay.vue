<template>
  <div :class="{ weekend: isWeekend }">{{ date }}<br /></div>
</template>
<script>
export default {
  name: "CalendarDay",
  props: {
    dayClass: String,
    date: Number,
    currentDate: {
      type: Object,
    },
    month: {
      type: String,
      required: false,
    },
  },
  computed: {
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
};
</script>
<style lang="scss" scoped>
.day {
  cursor: pointer;
  border: 1px solid var(--white);
  height: 100%;

  &:hover {
    background-color: var(--white);
    color: var(--slate-green);
  }
}

.day-hidden {
  opacity: 0.4;
  border: 1px solid var(--light-gray);
}
</style>
