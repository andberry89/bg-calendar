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
      <div class="date-text__row">
        <div class="date-text__main">
          <span class="date-text__day">{{ date }}</span>
          <span v-if="isFilteredEmptyDay" class="filtered-empty-note">Filtered</span>
        </div>

        <div
          v-if="primaryHolidayBadge"
          class="date-badge"
          :class="{
            'date-badge--half': primaryHolidayBadge.closed === 'half',
            'date-badge--open':
              primaryHolidayBadge.closed === 'none' || primaryHolidayBadge.closed === ''
          }"
        >
          <span class="date-badge__label">
            {{ holidayBadgeLabel }}
          </span>
          <span v-if="hiddenHolidayBadgeCount > 0" class="date-badge__count">
            +{{ hiddenHolidayBadgeCount }}
          </span>
        </div>
      </div>
    </div>

    <div class="day-body">
      <div v-if="hasFullClosureHoliday" class="full-close-message">
        <span class="full-close-message__title">Office Closed</span>
        <span v-if="holidays[0]?.details" class="full-close-message__detail">
          {{ holidays[0].details }}
        </span>
      </div>

      <template v-else>
        <div class="regular-event-lanes">
          <div
            v-for="(laneEvent, idx) in visibleRegularLaneSlots"
            :key="'regular-lane-' + idx"
            class="regular-event-lane"
          >
            <CalendarEvent
              v-if="laneEvent"
              class="regular-event"
              :event="laneEvent"
              @click="openEventModal(laneEvent)"
              @update="updateEvents"
            />
            <div v-else class="regular-event-placeholder" aria-hidden="true" />
          </div>
        </div>

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
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import CalendarEvent from '@/features/calendar/components/display/CalendarEvent.vue';
import EventModal from '@/features/calendar/components/modals/EventModal.vue';
import DayModal from '@/features/calendar/components/modals/DayModal.vue';
import type {
  AssignedCalendarEvent,
  CalendarEvent as CalendarEventType,
  CurrentDate
} from '@/types/calendar';

type CalendarMonthOffset = 'prev' | 'next';

const MOBILE_BREAKPOINT_QUERY = '(max-width: 640px)';

const props = withDefaults(
  defineProps<{
    date: number;
    dayClass: string;
    currentDate: CurrentDate;
    month?: CalendarMonthOffset;
    events?: CalendarEventType[];
    regularEventLaneSlots?: (AssignedCalendarEvent | CalendarEventType | null)[];
    hasUnfilteredEvents?: boolean;
  }>(),
  {
    month: undefined,
    events: () => [],
    regularEventLaneSlots: () => [],
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

const visibleHolidayBadges = computed((): CalendarEventType[] => {
  return holidays.value.filter((event) => event.closed !== 'full');
});

const primaryHolidayBadge = computed((): CalendarEventType | null => {
  return visibleHolidayBadges.value[0] ?? null;
});

const hiddenHolidayBadgeCount = computed((): number => {
  return Math.max(visibleHolidayBadges.value.length - 1, 0);
});

const holidayBadgeLabel = computed((): string => {
  if (!primaryHolidayBadge.value) {
    return '';
  }

  return primaryHolidayBadge.value.closed === 'half' ? 'Early Close' : 'Holiday';
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

  return isMobile.value ? 2 : 3;
});

const visibleRegularLaneCount = computed((): number => {
  return visibleRegularEventLimit.value;
});

const normalizedRegularEventLaneSlots = computed(
  (): (AssignedCalendarEvent | CalendarEventType | null)[] => {
    if (props.regularEventLaneSlots.length > 0) {
      return props.regularEventLaneSlots;
    }

    return filteredEvents.value.map((event) => event);
  }
);

const visibleRegularLaneSlots = computed(
  (): (AssignedCalendarEvent | CalendarEventType | null)[] => {
    const visibleSlots = normalizedRegularEventLaneSlots.value.slice(
      0,
      visibleRegularLaneCount.value
    );

    if (visibleSlots.length === visibleRegularLaneCount.value) {
      return visibleSlots;
    }

    return [
      ...visibleSlots,
      ...Array.from({ length: visibleRegularLaneCount.value - visibleSlots.length }, () => null)
    ];
  }
);

const visibleRegularEventCount = computed((): number => {
  return visibleRegularLaneSlots.value.filter((event) => event !== null).length;
});

const hiddenEventCount = computed((): number => {
  return Math.max(filteredEvents.value.length - visibleRegularEventCount.value, 0);
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
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
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
  align-items: stretch;
  justify-content: center;
  gap: 2px;
  width: 100%;
  height: 34px;
  min-height: 34px;
  margin-bottom: 0;
  padding: 0 0 6px;
  border-bottom: 1px solid var(--calendar-border-subtle);
  color: var(--calendar-text);
  text-align: left;
  box-sizing: border-box;
  overflow: hidden;
}

.date-text__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
  min-width: 0;
  min-height: 0;
}

.date-text__main {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  min-width: 0;
  min-height: 0;
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

.date-badge {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  flex: 1 1 auto;
  min-width: 0;
  max-width: none;
  height: 24px;
  min-height: 24px;
  padding: 2px 8px;
  border: 1px solid color-mix(in srgb, var(--holiday-open-border) 70%, transparent 30%);
  border-radius: 8px;
  background: color-mix(in srgb, var(--holiday-open-bg) 82%, white 18%);
  color: var(--calendar-text);
  text-align: left;
  box-sizing: border-box;
  overflow: hidden;
}

.date-badge--half {
  border-color: color-mix(in srgb, var(--holiday-halfday-border) 72%, transparent 28%);
  background: color-mix(in srgb, var(--holiday-halfday-bg) 88%, white 12%);
  box-shadow: none;
}

.date-badge__label,
.date-badge__count {
  line-height: 1.1;
  text-transform: none;
}

.date-badge__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.03em;
}

.date-badge__count {
  flex: 0 0 auto;
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  opacity: 0.72;
}

.day-body {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  min-height: 0;
  overflow: hidden;
}

.regular-event-lanes {
  display: grid;
  grid-auto-rows: min-content;
  align-content: start;
  gap: 0;
  min-height: 0;
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

.regular-event-lane {
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 38px;
  min-height: 38px;
  max-height: 38px;
  overflow: hidden;
}

.regular-event {
  width: 100%;
}

.regular-event-placeholder {
  width: 100%;
  height: 38px;
  min-height: 38px;
  max-height: 38px;
}

.more-events {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 4px;
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

  &:hover {
    background: color-mix(in srgb, var(--calendar-surface-muted) 70%, white 30%);
    transform: translateY(-1px);
  }
}

@media (max-width: 900px) and (min-width: 641px) {
  .date-text {
    height: 30px;
    min-height: 30px;
  }

  .date-text__row {
    gap: 5px;
  }

  .date-badge {
    height: 22px;
    min-height: 22px;
    gap: 5px;
    padding: 2px 7px;
  }

  .date-badge__label {
    font-size: 0.8rem;
  }

  .date-badge__count {
    font-size: 0.64rem;
  }

  .regular-event-lane,
  .regular-event-placeholder {
    height: 34px;
    min-height: 34px;
    max-height: 34px;
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
    height: 26px;
    min-height: 26px;
    padding-bottom: 4px;
  }

  .date-text__row {
    align-items: center;
    gap: 4px;
  }

  .date-text__day {
    font-size: 0.82rem;
  }

  .filtered-empty-note {
    font-size: 0.48rem;
  }

  .date-badge {
    height: 20px;
    min-height: 20px;
    gap: 4px;
    padding: 2px 6px;
  }

  .date-badge__label {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.68rem;
    font-weight: 400;
    letter-spacing: 0.02em;
  }

  .date-badge__count {
    font-size: 0.52rem;
    font-weight: 400;
    letter-spacing: 0.02em;
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

  .regular-event-lane,
  .regular-event-placeholder {
    height: 28px;
    min-height: 28px;
    max-height: 28px;
  }

  .more-events {
    margin-top: 2px;
    padding: 3px 6px;
    font-size: 0.58rem;
    visibility: visible;
  }
}
</style>
