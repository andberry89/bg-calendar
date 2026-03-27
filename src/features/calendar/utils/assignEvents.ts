import type { AssignedCalendarEvent, CalendarEvent } from '@/types/calendar';

const assignEvents = (
  arr: CalendarEvent[],
  currentMonth: number,
  currentMonthDays: number
): AssignedCalendarEvent[][] => {
  const updatedEvents: AssignedCalendarEvent[][] = Array.from(
    { length: currentMonthDays },
    () => []
  );
  const targetMonth = currentMonth + 1;

  for (const event of arr) {
    const startMonth = Number(event.start.slice(5, 7));
    const endMonth = Number(event.end.slice(5, 7));
    const actualStartIdx = Number(event.start.slice(8, 10)) - 1;
    const actualEndIdx = Number(event.end.slice(8, 10)) - 1;

    let boundedStartIdx = actualStartIdx;
    let boundedEndIdx = actualEndIdx;

    if (startMonth !== endMonth) {
      if (startMonth < targetMonth) {
        boundedStartIdx = 0;
      }

      if (targetMonth < endMonth) {
        boundedEndIdx = currentMonthDays - 1;
      }
    }

    boundedStartIdx = Math.max(boundedStartIdx, 0);
    boundedEndIdx = Math.min(boundedEndIdx, currentMonthDays - 1);

    const isMultiDay = event.start !== event.end;
    const visibleSpanLength = boundedEndIdx - boundedStartIdx + 1;
    const startsInCurrentMonth = startMonth === targetMonth;
    const endsInCurrentMonth = endMonth === targetMonth;

    for (let i = boundedStartIdx; i <= boundedEndIdx; i += 1) {
      updatedEvents[i].push({
        ...event,
        display: {
          startsToday: startsInCurrentMonth && i === actualStartIdx,
          endsToday: endsInCurrentMonth && i === actualEndIdx,
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
