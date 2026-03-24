<template>
  <div
    :class="[
      dayClass,
      { weekend: isWeekend },
      { fullClose: hasFullClosureHoliday },
      { 'container--event-modal-open': showEventDetails },
      'container'
    ]"
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
    <div
      :class="[
        'date-text',
        {
          'date-text--interactive': canOpenDayModal,
          'date-text--filtered-empty': isFilteredEmptyDay
        }
      ]"
      @click.stop="openDayModal"
    >
      {{ date }}
      <span v-if="isFilteredEmptyDay" class="filtered-empty-note">Filtered</span>
    </div>

    <div v-if="holidays.length > 0" class="holiday-strip">
      <div v-for="(event, idx) in holidays" :key="'holiday-' + idx" class="holiday-chip">
        {{ event.details || event.type }}
      </div>
    </div>
    <CalendarEvent
      v-for="(event, idx) in visibleRegularEvents"
      :key="'event-' + idx"
      class="regular-event"
      :event="event"
      @click="openEventModal(event)"
      @update="updateEvents"
    />

    <button
      v-if="hiddenEventCount > 0"
      class="more-events"
      type="button"
      @click.stop="openDayModal"
    >
      +{{ hiddenEventCount }} more
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import CalendarEvent from '@/features/calendar/components/display/CalendarEvent.vue';
import EventModal from '@/features/calendar/components/modals/EventModal.vue';
import DayModal from '@/features/calendar/components/modals/DayModal.vue';
import type { CalendarEvent as CalendarEventType, CurrentDate } from '@/types/calendar';

type CalendarMonthOffset = 'prev' | 'next';

const props = withDefaults(
  defineProps<{
    date: number;
    dayClass: string;
    currentDate: CurrentDate;
    month?: CalendarMonthOffset;
    events?: CalendarEventType[];
    hasUnfilteredEvents?: boolean;
  }>(),
  {
    month: undefined,
    events: () => [],
    hasUnfilteredEvents: false
  }
);

const emit = defineEmits<{
  (e: 'delete', value: CalendarEventType): void;
  (e: 'update'): void;
}>();

const showEventDetails = ref(false);
const modalEvent = ref<CalendarEventType | null>(null);
const showDayModal = ref(false);

const eventsByDisplayType = computed(() => {
  const holidays: CalendarEventType[] = [];
  const regular: CalendarEventType[] = [];

  for (const event of props.events) {
    if (event.type === 'Holiday') {
      holidays.push(event);
    } else {
      regular.push(event);
    }
  }

  return {
    holidays,
    regular
  };
});

const holidays = computed((): CalendarEventType[] => eventsByDisplayType.value.holidays);

const regularEvents = computed((): CalendarEventType[] => eventsByDisplayType.value.regular);

const visibleRegularEvents = computed((): CalendarEventType[] => regularEvents.value.slice(0, 2));

const allEvents = computed((): CalendarEventType[] => [
  ...eventsByDisplayType.value.holidays,
  ...eventsByDisplayType.value.regular
]);

const canOpenDayModal = computed((): boolean => {
  return props.dayClass === 'day' && allEvents.value.length > 0;
});

const hiddenEventCount = computed((): number => {
  return Math.max(regularEvents.value.length - visibleRegularEvents.value.length, 0);
});

const isFilteredEmptyDay = computed((): boolean => {
  return props.dayClass === 'day' && props.hasUnfilteredEvents && allEvents.value.length === 0;
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
  if (!canOpenDayModal.value) {
    return;
  }

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
  margin-bottom: 4px;
  padding-bottom: 2px;
}

.date-text--interactive {
  cursor: pointer;
}

.date-text--filtered-empty {
  color: var(--ocean-gray);
}

.filtered-empty-note {
  margin-top: 2px;
  font-size: 0.58rem;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.holiday-strip {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%;
  margin: 0 0 4px;
}

.holiday-chip {
  width: 100%;
  padding: 3px 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  background-color: rgba(0, 0, 0, 0.16);
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.64rem;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: 0.05em;
  text-align: center;
  text-shadow: none;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-events {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 12px);
  margin: auto auto 6px;
  padding: 3px 6px;
  border: 1px solid var(--ocean-gray);
  border-radius: 999px;
  background-color: var(--md-tran-black);
  color: var(--white);
  font-size: 0.63rem;
  line-height: 1.1;
  text-align: center;
  cursor: pointer;
  visibility: hidden;

  &:hover {
    background-color: var(--ocean-lt-blue);
  }
}

@media (max-width: 640px) {
  .container {
    height: 130px;
    overflow: hidden;
  }

  .container--event-modal-open {
    overflow: visible;
    z-index: 2;
  }

  .date-text {
    font-size: 0.85rem;
    margin-bottom: 3px;
  }

  .filtered-empty-note {
    font-size: 0.5rem;
  }

  .holiday-strip {
    width: 100%;
    margin-bottom: 3px;
  }

  .holiday-chip {
    padding: 2px 3px;
    font-size: 0.54rem;
    letter-spacing: 0.04em;
  }

  .more-events {
    width: calc(100% - 8px);
    margin: 4px auto 0;
    padding: 3px 6px;
    font-size: 0.6rem;
    visibility: visible;
  }
}
</style>
