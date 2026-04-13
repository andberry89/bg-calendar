import type { AssignedCalendarEvent, CalendarEvent } from '@/types/calendar';

const toDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const assignEvents = (
  arr: CalendarEvent[],
  currentMonth: number,
  currentMonthDays: number,
  currentYear: number
): AssignedCalendarEvent[][] => {
  const updatedEvents: AssignedCalendarEvent[][] = Array.from(
    { length: currentMonthDays },
    () => []
  );

  const visibleMonthStart = new Date(currentYear, currentMonth, 1);
  const visibleMonthEnd = new Date(currentYear, currentMonth, currentMonthDays);

  for (const event of arr) {
    const eventStart = toDate(event.start);
    const eventEnd = toDate(event.end);

    // Only assign the portion of the event that appears within the current month.
    const visibleStart = eventStart > visibleMonthStart ? eventStart : visibleMonthStart;
    const visibleEnd = eventEnd < visibleMonthEnd ? eventEnd : visibleMonthEnd;

    if (visibleStart > visibleEnd) {
      continue;
    }

    const boundedStartIdx = visibleStart.getDate() - 1;
    const boundedEndIdx = visibleEnd.getDate() - 1;
    const isMultiDay = event.start !== event.end;
    const visibleSpanLength = boundedEndIdx - boundedStartIdx + 1;

    for (let i = boundedStartIdx; i <= boundedEndIdx; i += 1) {
      const currentDay = new Date(currentYear, currentMonth, i + 1);

      updatedEvents[i].push({
        ...event,
        display: {
          startsToday: currentDay.getTime() === eventStart.getTime(),
          endsToday: currentDay.getTime() === eventEnd.getTime(),
          isMultiDay,
          spanIndex: i - boundedStartIdx,
          spanLength: visibleSpanLength
        }
      });
    }
  }

  return updatedEvents;
};

export default assignEvents;
