<template>
  <section class="calendar-body">
    <div class="weekdays">
      <div class="weekday" v-for="(weekday, idx) in weekdays" :key="idx">
        {{ weekday }}
      </div>
    </div>
    <div class="date" v-if="dataReady">
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
        :class="{ active: n === activeDate.date }"
        @click="updateDate(n)"
        @update="updateEvents"
        @delete="deleteEvent($event)"
        :key="'day' + idx"
        :date="n"
        :currentDate="activeDate"
        :events="events[n - 1]"
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
<script setup>
import { computed, ref, watch } from 'vue';
import CalendarDay from './CalendarDay.vue';
import assignEvents from './utils/assignEvents';

const props = defineProps({
  currentDate: {
    type: Object,
    required: true
  },
  prevMonthDays: Number,
  currentMonthDays: Number,
  currentMonthEvents: Array
});

const emit = defineEmits(['date', 'delete']);

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const activeDate = ref({
  date: 0,
  month: 0,
  year: 0
});

watch(
  () => props.currentDate,
  (val) => {
    activeDate.value = { ...val };
  },
  { deep: true, immediate: true }
);

const firstMonthDay = computed(() => {
  const firstDay = new Date(activeDate.value.year, activeDate.value.month, 1).getDay();
  return firstDay + 1;
});

const events = computed(() => {
  if (!props.currentMonthDays || !props.currentMonthEvents) {
    return [];
  }

  return assignEvents(props.currentMonthEvents, props.currentDate.month, props.currentMonthDays);
});

const dataReady = computed(() => events.value.length > 0 || props.currentMonthDays > 0);

function deleteEvent(event) {
  emit('delete', event);
}

function updateDate(date) {
  activeDate.value.date = date;
  emit('date', { ...activeDate.value });
}

function updateEvents() {
  // keep emit path unchanged for child interactions
}
</script>
<style lang="scss" scoped>
@mixin calendar-layout($property) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  grid-gap: 10px 2px;
  padding: $property;

  div {
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;
    align-items: center;
    border-radius: 5px;
  }
}

.calendar-body {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: 100%;
}

.weekdays {
  @include calendar-layout(10px 20px 10px);
  background-color: var(--md-tran-black);
  border-bottom: 1px solid var(--white);
  font-size: 1.5em;
  color: var(--ocean-gray);

  div:first-child,
  div:nth-child(7n) {
    color: var(--red);
  }
}

.date {
  @include calendar-layout(10px 20px 20px);
  background-color: var(--lt-tran-black);
  flex-grow: 4;

  .active {
    background-color: var(--ocean-lt-blue);
  }
}
</style>
