<template>
  <div
    :class="[dayClass, { weekend: isWeekend }, { fullClose: hasFullClosureHoliday }, 'container']"
  >
    <EventModal
      v-if="showEventDetails"
      :event="modalEvent"
      :day="getDay"
      @update="closeModal"
      @delete="deleteEvent($event)"
    />
    <div class="date-text">
      {{ date }}
      <CalendarEvent v-for="(event, idx) in holidays" :key="'holiday-' + idx" :event="event" />
    </div>
    <CalendarEvent
      v-for="(event, idx) in filteredEvents"
      :key="'event-' + idx"
      :event="event"
      @click="openEventModal(event)"
      @update="updateEvents"
    />
  </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import CalendarEvent from './CalendarEvent.vue';
import EventModal from './EventModal.vue';

const props = defineProps({
  date: Number,
  dayClass: String,
  currentDate: {
    type: Object
  },
  month: {
    type: String,
    required: false
  },
  events: {
    type: Array,
    default: () => [],
    required: false
  }
});

const emit = defineEmits(['delete', 'update']);

const showEventDetails = ref(false);
const modalEvent = ref({});

const holidays = computed(() => props.events.filter((e) => e.type === 'Holiday'));
const filteredEvents = computed(() => props.events.filter((e) => e.type !== 'Holiday'));

const getDay = computed(() => {
  const date = { ...props.currentDate };
  return new Date(date.year, date.month, props.date).getDay();
});

const hasFullClosureHoliday = computed(() => {
  return holidays.value.some((event) => event.closed === 'full');
});

const isWeekend = computed(() => {
  const date = { ...props.currentDate };

  if (props.month === 'prev') {
    if (date.month === 0) {
      date.month = 11;
      date.year--;
    } else {
      date.month--;
    }
  }

  if (props.month === 'next') {
    if (date.month === 11) {
      date.month = 0;
      date.year++;
    } else {
      date.month++;
    }
  }

  const day = new Date(date.year, date.month, props.date).getDay();
  return day === 0 || day === 6;
});

function closeModal() {
  modalEvent.value = {};
  showEventDetails.value = false;
}

function deleteEvent(event) {
  emit('delete', event);
  closeModal();
}

function openEventModal(event) {
  modalEvent.value = event;
  showEventDetails.value = true;
}

function updateEvents() {
  emit('update');
}
</script>
<style lang="scss" scoped>
.container {
  font-size: 0.75rem;
  height: 200px;
  position: relative;
}
.day {
  border: 1px solid var(--white);
  background-color: var(--ocean-md-blue);
  color: var(--white);

  // &:hover {
  //   background-color: var(--ocean-gray);
  //   color: var(--ocean-yellow);
  // }
}
.day-hidden {
  opacity: 0.5;
  border: 1px solid var(--ocean-gray);
  background-color: var(--ocean-dark-blue);

  .date-text {
    color: var(--white);
  }
}
.fullClose {
  background-color: var(--ocean-dark-gray);
}
.weekend {
  background-color: var(--ocean-dark-blue);

  // &:hover {
  //   color: var(--red);
  // }
}
.date-text {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  font-size: 1rem;
  border-bottom: 1px solid var(--ocean-gray);
  width: 100%;
  text-align: center;
  margin-bottom: 5px;
}
</style>
