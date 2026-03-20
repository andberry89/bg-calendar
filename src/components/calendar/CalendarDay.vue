<template>
  <div
    :class="[dayClass, { weekend: isWeekend }, { fullClose: hasFullClosureHoliday }, 'container']"
  >
    <EventModal
      v-if="showEventDetails"
      :event="modalEvent!"
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
<script setup lang="ts">
import { computed, ref } from 'vue';
import CalendarEvent from './CalendarEvent.vue';
import EventModal from './EventModal.vue';
import type { CalendarEvent as CalendarEventType, CurrentDate } from '@/types/calendar';

type CalendarMonthOffset = 'prev' | 'next';

const props = withDefaults(
  defineProps<{
    date: number;
    dayClass: string;
    currentDate: CurrentDate;
    month?: CalendarMonthOffset;
    events?: CalendarEventType[];
  }>(),
  {
    month: undefined,
    events: () => []
  }
);

const emit = defineEmits<{
  (e: 'delete', value: CalendarEventType): void;
  (e: 'update'): void;
}>();

const showEventDetails = ref(false);
const modalEvent = ref<CalendarEventType | null>(null);

const eventGroups = computed(
  (): { holidays: CalendarEventType[]; regularEvents: CalendarEventType[] } => {
    return props.events.reduce(
      (groups, event) => {
        if (event.type === 'Holiday') {
          groups.holidays.push(event);
        } else {
          groups.regularEvents.push(event);
        }

        return groups;
      },
      {
        holidays: [] as CalendarEventType[],
        regularEvents: [] as CalendarEventType[]
      }
    );
  }
);

const holidays = computed((): CalendarEventType[] => eventGroups.value.holidays);

const filteredEvents = computed((): CalendarEventType[] => eventGroups.value.regularEvents);

const getDay = computed((): number => {
  const date = { ...props.currentDate };
  return new Date(date.year, date.month, props.date).getDay();
});

const hasFullClosureHoliday = computed((): boolean => {
  return holidays.value.some((event) => event.closed === 'full');
});

const isWeekend = computed((): boolean => {
  const date = { ...props.currentDate };

  if (props.month === 'prev') {
    if (date.month === 0) {
      date.month = 11;
      date.year -= 1;
    } else {
      date.month -= 1;
    }
  }

  if (props.month === 'next') {
    if (date.month === 11) {
      date.month = 0;
      date.year += 1;
    } else {
      date.month += 1;
    }
  }

  const day = new Date(date.year, date.month, props.date).getDay();
  return day === 0 || day === 6;
});

function closeModal(): void {
  modalEvent.value = null;
  showEventDetails.value = false;
}

function deleteEvent(event: CalendarEventType): void {
  emit('delete', event);
  closeModal();
}

function openEventModal(event: CalendarEventType): void {
  modalEvent.value = event;
  showEventDetails.value = true;
}

function updateEvents(): void {
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
