<template>
  <!-- <article
    id="calendar"
    :style="{ 'background-image': 'url(' + require('@/assets/calendar/' + currentDate.month + '.jpg') + ')' }"
  > -->
  <article id="calendar">
    <CalendarHeader
      :currentDate="currentDate"
      :prevMonthDays="prevMonthDays"
      :currentMonthDays="currentMonthDays"
      @update="updateDate($event)"
    />
    <CalendarBody
      :currentDate="currentDate"
      :prevMonthDays="prevMonthDays"
      :currentMonthDays="currentMonthDays"
      @update="updateDate($event)"
    />
  </article>
</template>
<script>
import CalendarHeader from "./CalendarHeader.vue";
import CalendarBody from "./CalendarBody.vue";

export default {
  name: "Calendar",
  data() {
    return {
      currentDate: {
        date: 0,
        month: 0,
        year: 0,
      },
    };
  },
  components: {
    CalendarHeader,
    CalendarBody,
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
  },
  created() {
    this.getCurrentDate();
  },
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Anton");

#calendar {
  width: 1000px;
  height: 90vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  margin: 0 auto;
  background-color: var(--light-gray);
  font-family: "Anton";
  border-radius: 15px;
  overflow: hidden;
  background-size: cover;
  user-select: none;
}
</style>
