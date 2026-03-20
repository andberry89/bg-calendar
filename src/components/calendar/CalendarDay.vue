<template>
  <div
    :class="[dayClass, { weekend: isWeekend }, { fullClose: hasFullClosureHoliday }, 'container']"
    @click="openDayModal"
  >
    <DayModal
      v-if="showDayModal"
      :currentDate="currentDate"
      :date="date"
      :day="getDay"
      :events="allEvents"
      @update="closeDayModal"
      @delete="deleteEvent"
      @click.stop
    />
    <EventModal
      v-if="showEventDetails"
      :event="modalEvent!"
      :day="getDay"
      @update="closeModal"
      @delete="deleteEvent($event)"
      @click.stop
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
import DayModal from './DayModal.vue';
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
const showDayModal = ref(false);

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

const allEvents = computed((): CalendarEventType[] => {
  return [...holidays.value, ...filteredEvents.value];
});

const displayDate = computed((): CurrentDate => {
  const { year, month } = props.currentDate;

  if (props.month === 'prev') {
    return month === 0
      ? { ...props.currentDate, year: year - 1, month: 11 }
      : { ...props.currentDate, month: month - 1 };
  }

  if (props.month === 'next') {
    return month === 11
      ? { ...props.currentDate, year: year + 1, month: 0 }
      : { ...props.currentDate, month: month + 1 };
  }

  return props.currentDate;
});

const getDay = computed((): number => {
  return new Date(displayDate.value.year, displayDate.value.month, props.date).getDay();
});

const hasFullClosureHoliday = computed((): boolean => {
  return holidays.value.some((event) => event.closed === 'full');
});

const isWeekend = computed((): boolean => {
  const day = new Date(displayDate.value.year, displayDate.value.month, props.date).getDay();
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

function openDayModal(): void {
  showDayModal.value = true;
}

function closeDayModal(): void {
  showDayModal.value = false;
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
