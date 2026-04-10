import { computed, type ComputedRef, type Ref } from 'vue';
import type { AssignedCalendarEvent, CalendarEvent as CalendarEventType } from '@/types/calendar';
import type {
  CalendarWeekCell,
  CalendarWeekSegmentState,
  CalendarWeekSpanningSegment
} from '@/types/calendar-layout';

type UseCalendarWeekSpansParams = {
  weeks: ComputedRef<CalendarWeekCell[][]>;
  weekEvents: ComputedRef<AssignedCalendarEvent[][][]>;
  orderedWeekEvents: ComputedRef<AssignedCalendarEvent[][][]>;
  weekRegularEventPlacements: ComputedRef<
    {
      event: AssignedCalendarEvent;
      laneIndex: number;
      startDayIndex: number;
      endDayIndex: number;
    }[][]
  >;
  weekRegularEventLanePlan: ComputedRef<
    {
      laneIndexByKey: Map<string, { startRow: number; spanRows: number }>;
      totalRows: number;
    }[]
  >;
  currentDate: {
    year: number;
    month: number;
  };
  viewportWidth: Ref<number>;
  getEventKey: (event: CalendarEventType) => string;
};

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

export function useCalendarWeekSpans({
  weeks,
  weekEvents,
  orderedWeekEvents,
  weekRegularEventPlacements,
  weekRegularEventLanePlan,
  currentDate,
  viewportWidth,
  getEventKey
}: UseCalendarWeekSpansParams) {
  function isFullCloseStart(weekIdx: number, dayIdx: number): boolean {
    return (
      weeks.value[weekIdx][dayIdx]?.month === 'current' &&
      orderedWeekEvents.value[weekIdx][dayIdx]?.some(
        (event) => event.type === 'Holiday' && event.closed === 'full'
      ) === true
    );
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
      gridRow: `${segment.laneIndex + 1} / span 1`
    };
  }

  return {
    hiddenWeekSpanningEventCounts,
    maxVisibleWeekSpanRows,
    weekSpanningSegments,
    getWeekSpanningSegmentClasses,
    getWeekSpanningSegmentStyle
  };
}
