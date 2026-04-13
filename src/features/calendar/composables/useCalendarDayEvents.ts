import { computed, type Ref } from 'vue';
import type {
  AssignedCalendarEvent,
  CalendarEvent as CalendarEventType,
  CalendarEventLaneSlot
} from '@/types/calendar';

type UseCalendarDayEventsParams = {
  dayClass: Ref<string>;
  events: Ref<CalendarEventType[]>;
  hasUnfilteredEvents: Ref<boolean>;
  hiddenSpanningEventCount: Ref<number>;
  regularEventLaneSlots: Ref<CalendarEventLaneSlot[]>;
  visibleRegularLaneCount: Readonly<Ref<number>>;
};

function isAssignedCalendarEvent(
  event: CalendarEventType | AssignedCalendarEvent | null
): event is AssignedCalendarEvent {
  return (
    event !== null &&
    'display' in event &&
    typeof event.display === 'object' &&
    event.display !== null
  );
}

export function useCalendarDayEvents({
  dayClass,
  events,
  hasUnfilteredEvents,
  hiddenSpanningEventCount,
  regularEventLaneSlots,
  visibleRegularLaneCount
}: UseCalendarDayEventsParams) {
  const eventGroups = computed(
    (): { holidays: CalendarEventType[]; regularEvents: CalendarEventType[] } => {
      return events.value.reduce(
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

  // Full-closure holidays do not render as badge pills in the day cell.
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

    if (primaryHolidayBadge.value.closed === 'half') {
      return 'Early Close';
    }

    if (primaryHolidayBadge.value.closed === 'none' || primaryHolidayBadge.value.closed === '') {
      return primaryHolidayBadge.value.details || 'Holiday';
    }

    return 'Holiday';
  });

  const filteredEvents = computed((): CalendarEventType[] => eventGroups.value.regularEvents);

  const allEvents = computed((): CalendarEventType[] => {
    return [...holidays.value, ...filteredEvents.value];
  });

  const canOpenDayModal = computed((): boolean => {
    return dayClass.value === 'day' && allEvents.value.length > 0;
  });

  const hasHalfClosureHoliday = computed((): boolean => {
    return holidays.value.some((event) => event.closed === 'half');
  });

  const hasFullClosureHoliday = computed((): boolean => {
    return holidays.value.some((event) => event.closed === 'full');
  });

  // Clear multi-day events out of the regular lane slots so they are not rendered twice.
  const normalizedRegularEventLaneSlots = computed((): CalendarEventLaneSlot[] => {
    return regularEventLaneSlots.value.map((slot) => {
      if (!isAssignedCalendarEvent(slot.event) || slot.event.display.isMultiDay !== true) {
        return slot;
      }

      return {
        ...slot,
        event: null
      };
    });
  });

  const visibleRegularLaneSlots = computed((): CalendarEventLaneSlot[] => {
    const visibleRows = normalizedRegularEventLaneSlots.value.slice(
      0,
      visibleRegularLaneCount.value
    );

    if (visibleRows.length === visibleRegularLaneCount.value) {
      return visibleRows;
    }

    return [
      ...visibleRows,
      ...Array.from({ length: visibleRegularLaneCount.value - visibleRows.length }, () => ({
        event: null,
        spanRows: 1,
        isReserved: false,
        occupiedBySpan: false
      }))
    ];
  });

  const renderableRegularLaneSlots = computed((): CalendarEventLaneSlot[] => {
    return normalizedRegularEventLaneSlots.value.filter((slot) => !slot.occupiedBySpan);
  });

  const visibleRenderableRegularLaneSlots = computed(() => {
    return visibleRegularLaneSlots.value
      .map((slot, rowIndex) => ({
        slot,
        rowIndex
      }))
      .filter(({ slot }) => !slot.occupiedBySpan);
  });

  const visibleRegularEventCount = computed((): number => {
    return visibleRenderableRegularLaneSlots.value.filter(({ slot }) => slot.event !== null).length;
  });

  // Count hidden regular events and add any hidden spanning events shown behind the more button.
  const hiddenEventCount = computed((): number => {
    const totalRenderableRegularEventCount = renderableRegularLaneSlots.value.filter(
      (slot) => slot.event !== null
    ).length;

    const hiddenRegularEventCount = Math.max(
      totalRenderableRegularEventCount - visibleRegularEventCount.value,
      0
    );

    return hiddenRegularEventCount + hiddenSpanningEventCount.value;
  });

  const isFilteredEmptyDay = computed((): boolean => {
    return dayClass.value === 'day' && hasUnfilteredEvents.value && allEvents.value.length === 0;
  });

  return {
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
  };
}
