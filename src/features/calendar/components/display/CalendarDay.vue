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
      v-if="showEventDetails && modalEvent"
      :event="modalEvent"
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
        <div class="regular-event-lanes" :style="regularEventLanesStyle">
          <div
            v-for="{ slot, rowIndex } in visibleRenderableRegularLaneSlots"
            :key="slot.event ? `${slot.event.id}-${rowIndex}` : `regular-lane-empty-${rowIndex}`"
            class="regular-event-lane"
            :style="getLaneStyle(rowIndex, slot.spanRows)"
          >
            <CalendarEvent
              v-if="slot.event"
              class="regular-event"
              :event="slot.event"
              @click="openEventModal(slot.event)"
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
import { computed, ref, toRef } from 'vue';
import CalendarEvent from '@/features/calendar/components/display/CalendarEvent.vue';
import EventModal from '@/features/calendar/components/modals/EventModal.vue';
import DayModal from '@/features/calendar/components/modals/DayModal.vue';
import { useMediaQuery } from '@/composables/useMediaQuery';
import { useCalendarDayDate } from '@/features/calendar/composables/useCalendarDayDate';
import { useCalendarDayEvents } from '@/features/calendar/composables/useCalendarDayEvents';
import type {
  CalendarEvent as CalendarEventType,
  CalendarEventLaneSlot,
  CurrentDate
} from '@/types/calendar';

type CalendarMonthOffset = 'prev' | 'next';

const MOBILE_BREAKPOINT_QUERY = '(max-width: 640px)';
const isMobile = useMediaQuery(MOBILE_BREAKPOINT_QUERY);

const props = withDefaults(
  defineProps<{
    date: number;
    dayClass: string;
    currentDate: CurrentDate;
    month?: CalendarMonthOffset;
    events?: CalendarEventType[];
    regularEventLaneSlots?: CalendarEventLaneSlot[];
    hasUnfilteredEvents?: boolean;
    hiddenSpanningEventCount?: number;
  }>(),
  {
    month: undefined,
    events: () => [],
    regularEventLaneSlots: () => [],
    hasUnfilteredEvents: false,
    hiddenSpanningEventCount: 0
  }
);

const emit = defineEmits<{
  (e: 'delete', value: CalendarEventType): void;
  (e: 'update'): void;
}>();

const showEventDetails = ref(false);
const modalEvent = ref<CalendarEventType | null>(null);
const showDayModal = ref(false);

const { getDay, isWeekend } = useCalendarDayDate({
  currentDate: toRef(props, 'currentDate'),
  date: toRef(props, 'date'),
  month: toRef(props, 'month')
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

const {
  holidays,
  primaryHolidayBadge,
  hiddenHolidayBadgeCount,
  holidayBadgeLabel,
  allEvents,
  canOpenDayModal,
  hasHalfClosureHoliday,
  hasFullClosureHoliday,
  visibleRenderableRegularLaneSlots,
  hiddenEventCount,
  isFilteredEmptyDay
} = useCalendarDayEvents({
  dayClass: toRef(props, 'dayClass'),
  events: toRef(props, 'events'),
  hasUnfilteredEvents: toRef(props, 'hasUnfilteredEvents'),
  hiddenSpanningEventCount: toRef(props, 'hiddenSpanningEventCount'),
  regularEventLaneSlots: toRef(props, 'regularEventLaneSlots'),
  visibleRegularLaneCount
});

const regularEventLanesStyle = computed((): Record<string, string> => {
  return {
    gridTemplateRows: `repeat(${visibleRegularLaneCount.value}, var(--calendar-lane-row-height))`,
    width: '100%'
  };
});

function getLaneStyle(rowIndex: number, spanRows: number): Record<string, string> {
  return {
    gridRow: `${rowIndex + 1} / span ${spanRows}`,
    width: '100%'
  };
}

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

.date-text--interactive .date-text__day {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.date-text--interactive .date-text__day::after {
  content: '↗';
  display: inline-block;
  color: #2563eb;
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 1;
  opacity: 0.75;
  transform: translateY(-1px);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    color 0.15s ease;
}

.date-text--interactive:hover .date-text__day::after {
  opacity: 1;
  transform: translateY(-1px) scale(1.1);
  color: #1d4ed8;
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
  --calendar-day-event-side-inset: 1px;

  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.regular-event-lanes {
  --calendar-lane-row-height: 38px;
  display: grid;
  align-content: start;
  gap: 1px;
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding-inline: var(--calendar-day-event-side-inset);
  box-sizing: border-box;
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
  justify-content: stretch;
  width: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
}

.regular-event {
  width: 100%;
  min-width: 0;
  height: 100%;
}

.regular-event-placeholder {
  width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 0;
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

  .regular-event-lanes {
    --calendar-lane-row-height: 34px;
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

  .regular-event-lanes {
    --calendar-lane-row-height: 28px;
  }

  .more-events {
    margin-top: 2px;
    padding: 3px 6px;
    font-size: 0.58rem;
    visibility: visible;
  }
  .date-text--interactive .date-text__day::after {
    font-size: 0.58rem;
    opacity: 0.85;
  }
}
</style>
