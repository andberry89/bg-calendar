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
    let startIdx = Number(event.start.slice(8, 10)) - 1;
    let endIdx = Number(event.end.slice(8, 10)) - 1;

    if (startMonth !== endMonth) {
      if (startMonth < targetMonth) {
        startIdx = 0;
      }

      if (targetMonth < endMonth) {
        endIdx = currentMonthDays - 1;
      }
    }

    const boundedStartIdx = Math.max(startIdx, 0);
    const boundedEndIdx = Math.min(endIdx, currentMonthDays - 1);
    const spanLength = boundedEndIdx - boundedStartIdx + 1;
    const isMultiDay = spanLength > 1;

    for (let i = boundedStartIdx; i <= boundedEndIdx; i += 1) {
      updatedEvents[i].push({
        ...event,
        display: {
          startsToday: i === boundedStartIdx,
          endsToday: i === boundedEndIdx,
          isMultiDay,
          spanIndex: i - boundedStartIdx,
          spanLength
        }
      });
    }
  }

  return updatedEvents;
};

export default assignEvents;
