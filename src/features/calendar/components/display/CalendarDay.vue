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
      <span class="date-text__day">{{ date }}</span>
      <span v-if="isFilteredEmptyDay" class="filtered-empty-note">Filtered</span>
    </div>

    <div v-if="visibleHolidayChips.length > 0" class="holiday-strip">
      <div
        v-for="(event, idx) in visibleHolidayChips"
        :key="'holiday-' + idx"
        class="holiday-chip"
        :class="{
          'holiday-chip--half': event.closed === 'half',
          'holiday-chip--full': event.closed === 'full',
          'holiday-chip--open': event.closed === 'none' || event.closed === ''
        }"
      >
        <span v-if="event.closed !== 'half' || !isMobile" class="holiday-chip__title">
          {{ event.details || event.type }}
        </span>
        <span v-if="event.closed === 'half'" class="holiday-chip__meta">Early Close</span>
        <span v-if="event.closed === 'full'" class="holiday-chip__meta">Office Closed</span>
      </div>
    </div>

    <div v-if="hasFullClosureHoliday" class="full-close-message">
      <span class="full-close-message__title">Office Closed</span>
      <span v-if="holidays[0]?.details" class="full-close-message__detail">
        {{ holidays[0].details }}
      </span>
    </div>

    <template v-else>
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import CalendarEvent from '@/features/calendar/components/display/CalendarEvent.vue';
import EventModal from '@/features/calendar/components/modals/EventModal.vue';
import DayModal from '@/features/calendar/components/modals/DayModal.vue';
import type { CalendarEvent as CalendarEventType, CurrentDate } from '@/types/calendar';

type CalendarMonthOffset = 'prev' | 'next';

const MOBILE_BREAKPOINT_QUERY = '(max-width: 640px)';

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
const isMobile = ref(false);

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

const visibleHolidayChips = computed((): CalendarEventType[] => {
  return holidays.value.filter((event) => event.closed !== 'full');
});

const filteredEvents = computed((): CalendarEventType[] => eventGroups.value.regularEvents);

const allEvents = computed((): CalendarEventType[] => {
  return [...holidays.value, ...filteredEvents.value];
});

const canOpenDayModal = computed((): boolean => {
  return props.dayClass === 'day' && allEvents.value.length > 0;
});

const hasHalfClosureHoliday = computed((): boolean => {
  return holidays.value.some((event) => event.closed === 'half');
});

const visibleRegularEventLimit = computed((): number => {
  if (isMobile.value && hasHalfClosureHoliday.value) {
    return 1;
  }

  return 2;
});

const visibleRegularEvents = computed((): CalendarEventType[] => {
  return filteredEvents.value.slice(0, visibleRegularEventLimit.value);
});

const hiddenEventCount = computed((): number => {
  return Math.max(filteredEvents.value.length - visibleRegularEventLimit.value, 0);
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

let mediaQueryList: MediaQueryList | null = null;

function syncMobileState(event?: MediaQueryListEvent): void {
  if (event) {
    isMobile.value = event.matches;
    return;
  }

  if (typeof window === 'undefined') {
    isMobile.value = false;
    return;
  }

  mediaQueryList = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
  isMobile.value = mediaQueryList.matches;
}

onMounted((): void => {
  syncMobileState();

  if (!mediaQueryList) {
    return;
  }

  mediaQueryList.addEventListener('change', syncMobileState);
});

onBeforeUnmount((): void => {
  mediaQueryList?.removeEventListener('change', syncMobileState);
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 200px;
  padding: 6px;
  font-size: 0.75rem;
  background: var(--calendar-surface);
  color: var(--calendar-text);
  box-sizing: border-box;
}

.day {
  border: 1px solid var(--calendar-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(246, 248, 251, 0.98) 100%);
}

.day-hidden {
  border: 1px solid var(--calendar-border);
  background: color-mix(in srgb, var(--calendar-surface-muted) 72%, #cbd5e1 28%);
  opacity: 0.72;

  .date-text {
    color: var(--calendar-text-muted);
  }
}

.weekend {
  background: linear-gradient(180deg, rgba(238, 243, 248, 0.94) 0%, rgba(226, 232, 240, 0.96) 100%);
}

.fullClose {
  background: var(--holiday-closed-bg);
  border-color: color-mix(in srgb, var(--holiday-closed-surface) 70%, black 30%);
  color: var(--holiday-closed-text);
}

.date-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  margin-bottom: 2px;
  padding: 0 0 6px;
  border-bottom: 1px solid var(--calendar-border-subtle);
  color: var(--calendar-text);
  text-align: left;
}

.date-text__day {
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1;
}

.date-text--interactive {
  cursor: pointer;
}

.date-text--filtered-empty {
  color: var(--calendar-text-muted);
}

.fullClose .date-text,
.fullClose .date-text--filtered-empty {
  border-bottom-color: rgba(248, 250, 252, 0.14);
  color: var(--holiday-closed-text);
}

.filtered-empty-note {
  margin-top: 1px;
  font-size: 0.54rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.72;
}

.holiday-strip {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  margin: 0 0 2px;
}

.holiday-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 7px 8px;
  border: 1px solid var(--holiday-open-border);
  border-radius: 10px;
  background: var(--holiday-open-bg);
  color: var(--calendar-text);
  text-align: center;
  box-sizing: border-box;
}

.holiday-chip--half {
  border-color: var(--holiday-halfday-border);
  background: var(--holiday-halfday-bg);
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.25);
}

.holiday-chip__title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.95;
}

.holiday-chip__meta {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.7rem;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.9;
}

.full-close-message {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: 1px dashed rgba(248, 250, 252, 0.2);
  border-radius: 10px;
  background: rgba(248, 250, 252, 0.08);
  text-align: center;
}

.full-close-message__title {
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.full-close-message__detail {
  font-size: 0.62rem;
  line-height: 1.15;
  opacity: 0.88;
}

.more-events {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  padding: 4px 8px;
  border: 1px solid var(--calendar-border-strong);
  border-radius: var(--radius-pill);
  background: var(--calendar-surface-muted);
  color: var(--calendar-text);
  font-size: 0.63rem;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    transform 0.16s ease;
  visibility: hidden;

  &:hover {
    background: color-mix(in srgb, var(--calendar-surface-muted) 70%, white 30%);
    transform: translateY(-1px);
  }
}

@media (max-width: 640px) {
  .container {
    height: 130px;
    padding: 4px;
    gap: 3px;
    overflow: hidden;
  }

  .container--event-modal-open {
    overflow: visible;
    z-index: 2;
  }

  .date-text {
    padding-bottom: 4px;
  }

  .date-text__day {
    font-size: 0.82rem;
  }

  .filtered-empty-note {
    font-size: 0.48rem;
  }

  .holiday-strip {
    gap: 3px;
    margin-bottom: 1px;
  }

  .holiday-chip {
    align-items: center;
    gap: 2px;
    padding: 5px 6px;
    border-radius: 8px;
    text-align: center;
  }

  .holiday-chip--half {
    min-height: 32px;
    justify-content: center;
  }

  .holiday-chip__title {
    display: none;
  }

  .holiday-chip__meta {
    overflow: visible;
    text-overflow: unset;
    white-space: normal;
    font-size: 0.56rem;
    line-height: 1.05;
    word-break: normal;
    overflow-wrap: break-word;
    max-width: 100%;
  }

  .full-close-message {
    padding: 6px 4px;
    border-radius: 8px;
  }

  .full-close-message__title {
    font-size: 0.58rem;
  }

  .full-close-message__detail {
    font-size: 0.52rem;
  }

  .more-events {
    margin-top: 2px;
    padding: 3px 6px;
    font-size: 0.58rem;
    visibility: visible;
  }
}
</style>
