<template>
  <section class="calendar-body">
    <div class="weekdays">
      <div class="weekday" v-for="(weekday, idx) in weekdays" :key="idx">
        {{ weekday }}
      </div>
    </div>

    <div class="date" v-if="dataReady">
      <template v-for="(week, wIdx) in weeks" :key="'week-' + wIdx">
        <div class="calendar-week">
          <CalendarDay
            v-for="(cell, dIdx) in week"
            :key="'day' + wIdx + '-' + dIdx"
            :dayClass="cell.month === 'current' ? 'day' : 'day-hidden'"
            :class="{ active: cell.month === 'current' && cell.date === currentDate.date }"
            @click="cell.month === 'current' && updateDate(cell.date)"
            @update="updateEvents"
            @delete="deleteEvent($event)"
            :date="cell.date"
            :currentDate="currentDate"
            :month="cell.month === 'current' ? undefined : cell.month"
            :events="cell.month === 'current' ? orderedWeekEvents[wIdx][dIdx] : undefined"
            :regularEventLaneSlots="
              cell.month === 'current' ? weekRegularEventLaneSlots[wIdx][dIdx] : undefined
            "
            :hasUnfilteredEvents="
              cell.month === 'current' ? unfilteredEvents[cell.date - 1]?.length > 0 : false
            "
            :hiddenSpanningEventCount="
              cell.month === 'current' ? hiddenWeekSpanningEventCounts[wIdx][dIdx] : 0
            "
          />

          <div class="calendar-week-spans">
            <div
              v-for="segment in weekSpanningSegments[wIdx]"
              :key="getEventKey(segment.event)"
              class="calendar-week-span"
              :class="getWeekSpanningSegmentClasses(segment)"
              :style="getWeekSpanningSegmentStyle(segment)"
              role="button"
              tabindex="0"
              @click.stop="openWeekSpanEventModal(segment, wIdx)"
              @keydown.enter.stop.prevent="openWeekSpanEventModal(segment, wIdx)"
              @keydown.space.stop.prevent="openWeekSpanEventModal(segment, wIdx)"
            >
              <CalendarEvent :event="segment.event" />
            </div>

            <div
              v-if="selectedWeekSpanEvent && selectedWeekSpanEvent.weekIdx === wIdx"
              class="calendar-week-span-modal"
              @click.stop
              @mousedown.stop
              @pointerdown.stop
              @keydown.stop
            >
              <EventModal
                :day="selectedWeekSpanEvent.anchorDay"
                :event="selectedWeekSpanEvent.event"
                @update="closeWeekSpanEventModal"
                @delete="deleteWeekSpanEvent"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import CalendarDay from '@/features/calendar/components/display/CalendarDay.vue';
import CalendarEvent from '@/features/calendar/components/display/CalendarEvent.vue';
import EventModal from '@/features/calendar/components/modals/EventModal.vue';
import { assignEvents } from '@/features/calendar/utils';
import type {
  AssignedCalendarEvent,
  CalendarEvent as CalendarEventType,
  CalendarEventLaneSlot,
  CurrentDate
} from '@/types/calendar';

type CalendarWeekCell = {
  date: number;
  month: 'prev' | 'current' | 'next';
};

type CalendarWeekSegmentState = 'single' | 'start' | 'middle' | 'end';

type CalendarWeekSpanningSegment = {
  event: AssignedCalendarEvent;
  laneIndex: number;
  startDayIndex: number;
  endDayIndex: number;
  state: CalendarWeekSegmentState;
  isClippedLeft: boolean;
  isClippedRight: boolean;
  isFullCloseStart: boolean;
};

type CalendarWeekRegularEventPlacement = {
  event: AssignedCalendarEvent;
  laneIndex: number;
  startDayIndex: number;
  endDayIndex: number;
};

type SelectedWeekSpanEvent = {
  event: CalendarEventType;
  day: number;
  anchorDay: number;
  weekIdx: number;
};

const {
  currentDate,
  prevMonthDays,
  currentMonthDays,
  currentMonthEvents,
  unfilteredCurrentMonthEvents
} = defineProps<{
  currentDate: CurrentDate;
  prevMonthDays: number;
  currentMonthDays: number;
  currentMonthEvents: CalendarEventType[];
  unfilteredCurrentMonthEvents: CalendarEventType[];
}>();

const emit = defineEmits<{
  (e: 'date', value: CurrentDate): void;
  (e: 'delete', value: CalendarEventType): void;
}>();

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

const selectedWeekSpanEvent = ref<SelectedWeekSpanEvent | null>(null);
const viewportWidth = ref<number>(window.innerWidth);

const firstMonthDay = computed((): number => {
  const firstDay = new Date(currentDate.year, currentDate.month, 1).getDay();
  return firstDay + 1;
});

const previousMonthVisibleDays = computed((): number[] => {
  return Array.from(
    { length: firstMonthDay.value - 1 },
    (_, idx) => prevMonthDays + idx + 2 - firstMonthDay.value
  );
});

const currentMonthVisibleDays = computed((): number[] => {
  return Array.from({ length: currentMonthDays }, (_, idx) => idx + 1);
});

const nextMonthVisibleDays = computed((): number[] => {
  return Array.from({ length: 43 - (currentMonthDays + firstMonthDay.value) }, (_, idx) => idx + 1);
});

let cachedEvents: AssignedCalendarEvent[][] = [];
let cachedMonth = -1;
let cachedMonthDays = -1;
let cachedSourceEvents: CalendarEventType[] | null = null;
let cachedUnfilteredSourceEvents: CalendarEventType[] | null = null;
let cachedUnfilteredMonth = -1;
let cachedUnfilteredMonthDays = -1;
let cachedUnfilteredEvents: AssignedCalendarEvent[][] = [];

const events = computed((): AssignedCalendarEvent[][] => {
  if (!currentMonthDays || !currentMonthEvents.length) {
    cachedEvents = [];
    cachedMonth = currentDate.month;
    cachedMonthDays = currentMonthDays;
    cachedSourceEvents = currentMonthEvents;

    return cachedEvents;
  }

  if (
    cachedSourceEvents === currentMonthEvents &&
    cachedMonth === currentDate.month &&
    cachedMonthDays === currentMonthDays
  ) {
    return cachedEvents;
  }

  cachedEvents = assignEvents(
    currentMonthEvents,
    currentDate.month,
    currentMonthDays,
    currentDate.year
  );
  cachedMonth = currentDate.month;
  cachedMonthDays = currentMonthDays;
  cachedSourceEvents = currentMonthEvents;

  return cachedEvents;
});

const unfilteredEvents = computed((): AssignedCalendarEvent[][] => {
  if (!currentMonthDays || !unfilteredCurrentMonthEvents.length) {
    cachedUnfilteredEvents = [];
    cachedUnfilteredMonth = currentDate.month;
    cachedUnfilteredMonthDays = currentMonthDays;
    cachedUnfilteredSourceEvents = unfilteredCurrentMonthEvents;

    return cachedUnfilteredEvents;
  }

  if (
    cachedUnfilteredSourceEvents === unfilteredCurrentMonthEvents &&
    cachedUnfilteredMonth === currentDate.month &&
    cachedUnfilteredMonthDays === currentMonthDays
  ) {
    return cachedUnfilteredEvents;
  }

  cachedUnfilteredEvents = assignEvents(
    unfilteredCurrentMonthEvents,
    currentDate.month,
    currentMonthDays,
    currentDate.year
  );
  cachedUnfilteredMonth = currentDate.month;
  cachedUnfilteredMonthDays = currentMonthDays;
  cachedUnfilteredSourceEvents = unfilteredCurrentMonthEvents;

  return cachedUnfilteredEvents;
});

const weeks = computed((): CalendarWeekCell[][] => {
  const cells: CalendarWeekCell[] = [
    ...previousMonthVisibleDays.value.map((date) => ({
      date,
      month: 'prev' as const
    })),
    ...currentMonthVisibleDays.value.map((date) => ({
      date,
      month: 'current' as const
    })),
    ...nextMonthVisibleDays.value.map((date) => ({
      date,
      month: 'next' as const
    }))
  ];

  const rows: CalendarWeekCell[][] = [];

  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return rows;
});

const weekEvents = computed((): AssignedCalendarEvent[][][] => {
  return weeks.value.map((week) => {
    return week.map((cell) => {
      if (cell.month !== 'current') {
        return [];
      }

      return events.value[cell.date - 1] ?? [];
    });
  });
});

function getEventKey(event: CalendarEventType): string {
  return event.id ?? `${event.type}-${event.start}-${event.end}`;
}

function getEventRowSpan(_event: AssignedCalendarEvent): number {
  return 1;
}

const weekRegularEventPlacements = computed((): CalendarWeekRegularEventPlacement[][] => {
  return weekEvents.value.map((week) => {
    const eventBoundsByKey = new Map<
      string,
      {
        event: AssignedCalendarEvent;
        startDayIndex: number;
        endDayIndex: number;
      }
    >();

    week.forEach((dayEvents, dayIdx) => {
      dayEvents.forEach((event) => {
        if (event.type === 'Holiday') {
          return;
        }

        const key = getEventKey(event);
        const existing = eventBoundsByKey.get(key);

        if (!existing) {
          eventBoundsByKey.set(key, {
            event,
            startDayIndex: dayIdx,
            endDayIndex: dayIdx
          });

          return;
        }

        existing.startDayIndex = Math.min(existing.startDayIndex, dayIdx);
        existing.endDayIndex = Math.max(existing.endDayIndex, dayIdx);
      });
    });

    const orderedEvents = Array.from(eventBoundsByKey.values()).sort((left, right) => {
      if (left.startDayIndex !== right.startDayIndex) {
        return left.startDayIndex - right.startDayIndex;
      }

      if (left.endDayIndex !== right.endDayIndex) {
        return left.endDayIndex - right.endDayIndex;
      }

      return getEventKey(left.event).localeCompare(getEventKey(right.event));
    });

    const laneEndDayIndices: number[] = [];

    return orderedEvents.map(({ event, startDayIndex, endDayIndex }) => {
      let laneIndex = laneEndDayIndices.findIndex(
        (laneEndDayIndex) => laneEndDayIndex < startDayIndex
      );

      if (laneIndex === -1) {
        laneIndex = laneEndDayIndices.length;
        laneEndDayIndices.push(endDayIndex);
      } else {
        laneEndDayIndices[laneIndex] = endDayIndex;
      }

      return {
        event,
        laneIndex,
        startDayIndex,
        endDayIndex
      };
    });
  });
});

const weekRegularEventLanePlan = computed(() => {
  return weekRegularEventPlacements.value.map((placements) => {
    const laneIndexByKey = new Map<string, { startRow: number; spanRows: number }>();

    placements.forEach((placement) => {
      laneIndexByKey.set(getEventKey(placement.event), {
        startRow: placement.laneIndex,
        spanRows: getEventRowSpan(placement.event)
      });
    });

    const totalRows =
      placements.reduce((maxLaneIndex, placement) => {
        return Math.max(maxLaneIndex, placement.laneIndex);
      }, -1) + 1;

    return {
      laneIndexByKey,
      totalRows
    };
  });
});

const orderedWeekEvents = computed((): AssignedCalendarEvent[][][] => {
  return weekEvents.value.map((week, weekIdx) => {
    const regularEventOrderIndex = new Map<string, number>();

    weekRegularEventPlacements.value[weekIdx].forEach((placement) => {
      regularEventOrderIndex.set(getEventKey(placement.event), placement.laneIndex);
    });

    return week.map((dayEvents) => {
      const holidays = dayEvents.filter((event) => event.type === 'Holiday');
      const regularEvents = dayEvents
        .filter((event) => event.type !== 'Holiday')
        .sort((a, b) => {
          return (
            (regularEventOrderIndex.get(getEventKey(a)) ?? Number.MAX_SAFE_INTEGER) -
            (regularEventOrderIndex.get(getEventKey(b)) ?? Number.MAX_SAFE_INTEGER)
          );
        });

      return [...holidays, ...regularEvents];
    });
  });
});

const weekRegularEventLaneSlots = computed((): CalendarEventLaneSlot[][][] => {
  return weekEvents.value.map((week, weekIdx) => {
    const lanePlan = weekRegularEventLanePlan.value[weekIdx];

    return week.map((dayEvents) => {
      const laneSlots: CalendarEventLaneSlot[] = Array.from({ length: lanePlan.totalRows }, () => ({
        event: null,
        spanRows: 1,
        isReserved: false,
        occupiedBySpan: false
      }));

      lanePlan.laneIndexByKey.forEach(({ startRow, spanRows }) => {
        laneSlots[startRow] = {
          event: null,
          spanRows,
          isReserved: false,
          occupiedBySpan: false
        };

        for (let offset = 1; offset < spanRows; offset += 1) {
          laneSlots[startRow + offset] = {
            event: null,
            spanRows: 1,
            isReserved: true,
            occupiedBySpan: false
          };
        }
      });

      dayEvents.forEach((event) => {
        if (event.type === 'Holiday') {
          return;
        }

        const lanePosition = lanePlan.laneIndexByKey.get(getEventKey(event));

        if (!lanePosition) {
          return;
        }

        laneSlots[lanePosition.startRow] = {
          event,
          spanRows: lanePosition.spanRows,
          isReserved: false,
          occupiedBySpan: false
        };

        for (let offset = 1; offset < lanePosition.spanRows; offset += 1) {
          laneSlots[lanePosition.startRow + offset] = {
            event: null,
            spanRows: 1,
            isReserved: true,
            occupiedBySpan: true
          };
        }
      });

      return laneSlots;
    });
  });
});

function getWeekSegmentState(startsInView: boolean, endsInView: boolean): CalendarWeekSegmentState {
  if (startsInView && endsInView) {
    return 'single';
  }

  if (startsInView) {
    return 'start';
  }

  if (endsInView) {
    return 'end';
  }

  return 'middle';
}

function isFullCloseStart(weekIdx: number, dayIdx: number): boolean {
  return (
    weeks.value[weekIdx][dayIdx]?.month === 'current' &&
    orderedWeekEvents.value[weekIdx][dayIdx]?.some(
      (event) => event.type === 'Holiday' && event.closed === 'full'
    ) === true
  );
}

function getDateParts(value: string | number | Date): { year: number; month: number; day: number } {
  if (value instanceof Date) {
    return {
      year: value.getFullYear(),
      month: value.getMonth(),
      day: value.getDate()
    };
  }

  if (typeof value === 'string') {
    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (dateOnlyMatch) {
      return {
        year: Number(dateOnlyMatch[1]),
        month: Number(dateOnlyMatch[2]) - 1,
        day: Number(dateOnlyMatch[3])
      };
    }
  }

  const parsed = new Date(value);

  return {
    year: parsed.getFullYear(),
    month: parsed.getMonth(),
    day: parsed.getDate()
  };
}

function getDateKey(value: string | number | Date): string {
  const { year, month, day } = getDateParts(value);
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getVisibleCellDateKey(cell: CalendarWeekCell): string {
  return getDateKey(new Date(currentDate.year, currentDate.month, cell.date));
}

const maxVisibleWeekSpanRows = computed((): number => {
  return viewportWidth.value <= 640 ? 2 : 3;
});

const weekSpanningSegments = computed((): CalendarWeekSpanningSegment[][] => {
  return weeks.value.map((week, weekIdx) => {
    const lanePlan = weekRegularEventLanePlan.value[weekIdx];
    const segments: CalendarWeekSpanningSegment[] = [];

    weekRegularEventPlacements.value[weekIdx].forEach((placement) => {
      const event = placement.event;
      if (!event.display?.isMultiDay) {
        return;
      }

      const lane = lanePlan.laneIndexByKey.get(getEventKey(event));

      if (!lane || lane.startRow >= maxVisibleWeekSpanRows.value) {
        return;
      }

      const visibleDayIndices = week.reduce<number[]>((indices, cell, dayIdx) => {
        if (cell.month !== 'current') {
          return indices;
        }

        const hasEvent = weekEvents.value[weekIdx][dayIdx].some(
          (dayEvent) => getEventKey(dayEvent) === getEventKey(event)
        );

        if (hasEvent) {
          indices.push(dayIdx);
        }

        return indices;
      }, []);

      if (!visibleDayIndices.length) {
        return;
      }

      const startDayIndex = visibleDayIndices[0];
      const endDayIndex = visibleDayIndices[visibleDayIndices.length - 1];

      const startBoundaryEvent = weekEvents.value[weekIdx][startDayIndex].find(
        (dayEvent) => getEventKey(dayEvent) === getEventKey(event)
      );
      const endBoundaryEvent = weekEvents.value[weekIdx][endDayIndex].find(
        (dayEvent) => getEventKey(dayEvent) === getEventKey(event)
      );

      if (!startBoundaryEvent || !endBoundaryEvent) {
        return;
      }

      const visibleStartDateKey = getVisibleCellDateKey(week[startDayIndex]);
      const visibleEndDateKey = getVisibleCellDateKey(week[endDayIndex]);
      const eventStartDateKey = getDateKey(event.start);
      const eventEndDateKey = getDateKey(event.end);

      const startsInView = eventStartDateKey === visibleStartDateKey;
      const endsInView = eventEndDateKey === visibleEndDateKey;
      const isClippedLeft = eventStartDateKey < visibleStartDateKey;
      const isClippedRight = eventEndDateKey > visibleEndDateKey;

      segments.push({
        event: startBoundaryEvent,
        laneIndex: lane.startRow,
        startDayIndex,
        endDayIndex,
        state: getWeekSegmentState(startsInView, endsInView),
        isClippedLeft,
        isClippedRight,
        isFullCloseStart: isFullCloseStart(weekIdx, startDayIndex)
      });
    });

    return segments;
  });
});

const hiddenWeekSpanningEventCounts = computed((): number[][] => {
  return weeks.value.map((week, weekIdx) => {
    const hiddenCounts = Array.from({ length: week.length }, () => 0);
    const lanePlan = weekRegularEventLanePlan.value[weekIdx];

    weekRegularEventPlacements.value[weekIdx].forEach((placement) => {
      const event = placement.event;
      if (!event.display?.isMultiDay) {
        return;
      }

      const lane = lanePlan.laneIndexByKey.get(getEventKey(event));

      if (!lane || lane.startRow < maxVisibleWeekSpanRows.value) {
        return;
      }

      week.forEach((cell, dayIdx) => {
        if (cell.month !== 'current') {
          return;
        }

        const hasEvent = weekEvents.value[weekIdx][dayIdx].some(
          (dayEvent) => getEventKey(dayEvent) === getEventKey(event)
        );

        if (hasEvent) {
          hiddenCounts[dayIdx] += 1;
        }
      });
    });

    return hiddenCounts;
  });
});

function getWeekSpanningSegmentClasses(
  segment: CalendarWeekSpanningSegment
): Record<string, boolean> {
  return {
    [`calendar-week-span--${segment.state}`]: true,
    'calendar-week-span--clipped-left': segment.isClippedLeft,
    'calendar-week-span--clipped-right': segment.isClippedRight,
    'calendar-week-span--full-close-start': segment.isFullCloseStart
  };
}

function getWeekSpanningSegmentStyle(segment: CalendarWeekSpanningSegment): {
  gridColumn: string;
  gridRow: string;
} {
  return {
    gridColumn: `${segment.startDayIndex + 1} / ${segment.endDayIndex + 2}`,
    gridRow: `${segment.laneIndex + 1} / span ${getEventRowSpan(segment.event)}`
  };
}

function openWeekSpanEventModal(segment: CalendarWeekSpanningSegment, weekIdx: number): void {
  const fullEvent = currentMonthEvents.find((e) => getEventKey(e) === getEventKey(segment.event));

  if (!fullEvent) {
    return;
  }

  const anchorDayIndex = segment.startDayIndex >= 4 ? segment.endDayIndex : segment.startDayIndex;

  selectedWeekSpanEvent.value = {
    event: fullEvent,
    day: weeks.value[weekIdx][segment.startDayIndex]?.date ?? 1,
    anchorDay: weeks.value[weekIdx][anchorDayIndex]?.date ?? 1,
    weekIdx
  };
}

function closeWeekSpanEventModal(): void {
  selectedWeekSpanEvent.value = null;
}

function deleteWeekSpanEvent(event: CalendarEventType): void {
  closeWeekSpanEventModal();
  deleteEvent(event);
}

const dataReady = computed((): boolean => {
  return currentMonthDays > 0;
});

function updateViewportWidth(): void {
  viewportWidth.value = window.innerWidth;
}

onMounted(() => {
  updateViewportWidth();
  window.addEventListener('resize', updateViewportWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportWidth);
});

function deleteEvent(event: CalendarEventType): void {
  emit('delete', event);
}

function updateDate(date: number): void {
  emit('date', { ...currentDate, date });
}

function updateEvents(): void {
  // keep emit path unchanged for child interactions
}
</script>

<style lang="scss" scoped>
@mixin calendar-layout($padding) {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px 2px;
  padding: $padding;

  div {
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;
    align-items: center;
    border-radius: 5px;
    min-width: 0;
  }
}

.calendar-body {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  min-width: 0;
  height: 100%;
}

.weekdays {
  @include calendar-layout(10px 20px 10px);
  background-color: var(--md-tran-black);
  border-bottom: 1px solid var(--white);
  font-size: clamp(1rem, 1.5vw, 1.5rem);
  color: var(--ocean-gray);

  div:first-child,
  div:nth-child(7n) {
    color: var(--red);
  }
}

.date {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px 0;
  padding: 10px 20px 20px;
  background-color: var(--layout-panel-overlay);
  flex-grow: 4;

  .active {
    background-color: var(--ocean-lt-blue);
  }
}

.calendar-week {
  --calendar-span-top-offset: 44px;
  --calendar-span-row-height: 38px;
  --calendar-span-side-inset: 1px;

  position: relative;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px 2px;
}

.calendar-week-spans {
  position: absolute;
  top: var(--calendar-span-top-offset);
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: var(--calendar-span-row-height);
  column-gap: 2px;
  pointer-events: none;
  z-index: 2;
}

.calendar-week-span {
  display: flex;
  align-items: stretch;
  min-width: 0;
  min-height: 0;
  padding-inline: 1px;
  box-sizing: border-box;
  overflow: hidden;
  pointer-events: auto;
  cursor: pointer;
}

.calendar-week-span:focus-visible {
  outline: 2px solid var(--ocean-lt-blue);
  outline-offset: 1px;
  border-radius: 10px;
}

.calendar-week-span-modal {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}

.calendar-week-span-modal :deep(.event-modal) {
  pointer-events: auto;
}

.calendar-week-span :deep(.event-container) {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.calendar-week-span :deep(.event-pill) {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 4px 4px;
  gap: 3px;
  border-color: color-mix(in srgb, var(--event-pill-border) 78%, transparent 22%);
  background: color-mix(in srgb, var(--event-pill-bg) 100%, white 0%);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.12) inset,
    0 1px 2px rgba(15, 23, 42, 0.1);
  border-radius: 10px !important;
}

.calendar-week-span--clipped-left :deep(.event-pill) {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.calendar-week-span--clipped-right :deep(.event-pill) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.calendar-week-span--full-close-start :deep(.event-pill) {
  border-color: rgba(15, 23, 42, 0.68);
  background: color-mix(in srgb, var(--event-pill-bg) 48%, white 52%);
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.42) inset,
    0 1px 2px rgba(15, 23, 42, 0.08);
}

.calendar-week-span--full-close-start :deep(.event-pill__primary) {
  color: #0f172a;
  font-weight: 700;
}

.calendar-week-span--full-close-start :deep(.event-pill__secondary) {
  color: rgba(15, 23, 42, 0.82);
  font-weight: 600;
}

.calendar-week-span--full-close-start :deep(.event-pill__avatar) {
  background: rgba(255, 255, 255, 0.72);
  color: #0f172a;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.18) inset;
}

.calendar-week-span--full-close-start :deep(.event-pill__avatar-fallback) {
  color: inherit;
}

.calendar-week-span :deep(.event-pill__primary),
.calendar-week-span :deep(.event-pill__secondary) {
  text-shadow: none;
}

.calendar-week-span :deep(.event-pill__avatar) {
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
}

.calendar-week-span :deep(.event-pill__avatar-fallback) {
  font-size: 0.68rem;
}

@media (max-width: 900px) and (min-width: 641px) {
  .calendar-week {
    --calendar-span-top-offset: 40px;
    --calendar-span-row-height: 34px;
  }

  .calendar-week-span :deep(.event-pill) {
    border-radius: 8px !important;
  }

  .calendar-week-span--clipped-left :deep(.event-pill) {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  .calendar-week-span--clipped-right :deep(.event-pill) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .calendar-week-span :deep(.event-pill__avatar) {
    width: 26px;
    height: 26px;
    flex: 0 0 26px;
  }
}

@media (max-width: 900px) {
  .weekdays {
    padding: 10px 12px;
  }

  .date {
    padding: 10px 12px 12px;
  }
}

@media (max-width: 640px) {
  .calendar-week {
    --calendar-span-top-offset: 33px;
    --calendar-span-row-height: 28px;
    --calendar-span-side-inset: 1px;

    gap: 6px 2px;
  }

  .calendar-week-spans {
    column-gap: 2px;
  }

  .calendar-week-span {
    padding-inline: 1px;
  }

  .calendar-week-span :deep(.event-pill) {
    border-radius: 8px !important;
  }

  .calendar-week-span--clipped-left :deep(.event-pill) {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  .calendar-week-span--clipped-right :deep(.event-pill) {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  .calendar-week-span :deep(.event-pill__avatar) {
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
  }

  .weekdays {
    gap: 6px 2px;
    font-size: 0.95rem;
  }

  .date {
    gap: 6px 0;
  }
}
</style>
