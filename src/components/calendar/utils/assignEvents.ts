import type { CalendarEvent } from '@/types/calendar';

const assignEvents = (
  arr: CalendarEvent[],
  currentMonth: number,
  currentMonthDays: number
): CalendarEvent[][] => {
  const updatedEvents: CalendarEvent[][] = Array.from({ length: currentMonthDays }, () => []);
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

    for (let i = startIdx; i <= endIdx; i += 1) {
      updatedEvents[i].push(event);
    }
  }

  return updatedEvents;
};

export default assignEvents;
