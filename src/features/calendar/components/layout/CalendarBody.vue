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
          />
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CalendarDay from '@/features/calendar/components/display/CalendarDay.vue';
import assignEvents from '@/features/calendar/utils/assignEvents';
import type {
  AssignedCalendarEvent,
  CalendarEvent,
  CalendarEventLaneSlot,
  CurrentDate
} from '@/types/calendar';

type CalendarWeekCell = {
  date: number;
  month: 'prev' | 'current' | 'next';
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
  currentMonthEvents: CalendarEvent[];
  unfilteredCurrentMonthEvents: CalendarEvent[];
}>();

const emit = defineEmits<{
  (e: 'date', value: CurrentDate): void;
  (e: 'delete', value: CalendarEvent): void;
}>();

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

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
let cachedSourceEvents: CalendarEvent[] | null = null;
let cachedUnfilteredEvents: AssignedCalendarEvent[][] = [];
let cachedUnfilteredMonth = -1;
let cachedUnfilteredMonthDays = -1;
let cachedUnfilteredSourceEvents: CalendarEvent[] | null = null;

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

  cachedEvents = assignEvents(currentMonthEvents, currentDate.month, currentMonthDays);
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
    currentMonthDays
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

function getEventKey(event: CalendarEvent): string {
  return event.id ?? `${event.type}-${event.start}-${event.end}`;
}

function getEventRowSpan(event: AssignedCalendarEvent): number {
  return event.class === 'auto-show' ? 2 : 1;
}

const weekRegularEventOrder = computed((): AssignedCalendarEvent[][] => {
  return weekEvents.value.map((week) => {
    const map = new Map<string, AssignedCalendarEvent>();

    week.forEach((dayEvents) => {
      dayEvents.forEach((event) => {
        if (event.type === 'Holiday') {
          return;
        }

        const key = getEventKey(event);

        if (!map.has(key)) {
          map.set(key, event);
        }
      });
    });

    return Array.from(map.values());
  });
});

const weekRegularEventLanePlan = computed(() => {
  return weekRegularEventOrder.value.map((orderedEvents) => {
    const laneIndexByKey = new Map<string, { startRow: number; spanRows: number }>();
    let totalRows = 0;

    orderedEvents.forEach((event) => {
      const spanRows = getEventRowSpan(event);
      laneIndexByKey.set(getEventKey(event), {
        startRow: totalRows,
        spanRows
      });
      totalRows += spanRows;
    });

    return {
      laneIndexByKey,
      totalRows
    };
  });
});

const orderedWeekEvents = computed((): AssignedCalendarEvent[][][] => {
  return weekEvents.value.map((week, weekIdx) => {
    const regularEventOrderIndex = new Map<string, number>();

    weekRegularEventOrder.value[weekIdx].forEach((event, index) => {
      regularEventOrderIndex.set(getEventKey(event), index);
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

const dataReady = computed((): boolean => {
  return currentMonthDays > 0;
});

function deleteEvent(event: CalendarEvent): void {
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
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px 2px;
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
  .weekdays,
  .calendar-week {
    gap: 6px 2px;
  }

  .date {
    gap: 6px 0;
  }

  .weekdays {
    font-size: 0.95rem;
  }
}
</style>
