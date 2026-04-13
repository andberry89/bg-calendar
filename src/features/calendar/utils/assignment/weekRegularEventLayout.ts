import { computed, type ComputedRef } from 'vue';
import type {
  AssignedCalendarEvent,
  CalendarEvent as CalendarEventType,
  CalendarEventLaneSlot
} from '@/types/calendar';
import type { CalendarWeekRegularEventPlacement } from '@/types/calendar-layout';

type WeekRegularEventLanePlan = {
  laneIndexByKey: Map<string, { startRow: number; spanRows: number }>;
  totalRows: number;
};

type UseWeekRegularEventLayoutParams = {
  weekEvents: ComputedRef<AssignedCalendarEvent[][][]>;
  getEventKey: (event: CalendarEventType) => string;
  getEventRowSpan: () => number;
};

export function useWeekRegularEventLayout({
  weekEvents,
  getEventKey,
  getEventRowSpan
}: UseWeekRegularEventLayoutParams) {
  // -------------------------
  // Event placements
  // -------------------------
  // Collect each regular event once per week and track which days it appears on.
  // Holiday events stay out of this step so they can keep their separate display order.
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

      // Keep earlier events ahead of later ones so row placement stays stable.
      // When two events cover the same days, fall back to the event key.
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

  // -------------------------
  // Lane plan
  // -------------------------
  // Keep each regular event in the same row for the full week.
  const weekRegularEventLanePlan = computed((): WeekRegularEventLanePlan[] => {
    return weekRegularEventPlacements.value.map((placements) => {
      const laneIndexByKey = new Map<string, { startRow: number; spanRows: number }>();

      placements.forEach((placement) => {
        laneIndexByKey.set(getEventKey(placement.event), {
          startRow: placement.laneIndex,
          spanRows: getEventRowSpan()
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

  // -------------------------
  // Ordered day events
  // -------------------------
  // Keep holidays first, then order regular events by their assigned row.
  // This keeps the visible event order consistent from day to day.
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

  // -------------------------
  // Lane slots
  // -------------------------
  // Build the visible row slots for each day from the shared weekly row plan.
  // Reserved slots keep taller events aligned even when a row has no card that day.
  const weekRegularEventLaneSlots = computed((): CalendarEventLaneSlot[][][] => {
    return weekEvents.value.map((week, weekIdx) => {
      const lanePlan = weekRegularEventLanePlan.value[weekIdx];

      return week.map((dayEvents) => {
        const laneSlots: CalendarEventLaneSlot[] = Array.from(
          { length: lanePlan.totalRows },
          () => ({
            event: null,
            spanRows: 1,
            isReserved: false,
            occupiedBySpan: false
          })
        );

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

  return {
    weekRegularEventPlacements,
    weekRegularEventLanePlan,
    orderedWeekEvents,
    weekRegularEventLaneSlots
  };
}
