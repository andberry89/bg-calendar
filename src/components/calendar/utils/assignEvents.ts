import type { CalendarEvent } from '@/types/calendar';

const assignEvents = (
  arr: CalendarEvent[],
  currentMonth: number,
  currentMonthDays: number
): CalendarEvent[][] => {
  const updatedEvents: CalendarEvent[][] = Array.from({ length: currentMonthDays }, () => []);

  arr.forEach((event) => {
    const start = event.start.split('-');
    const end = event.end.split('-');
    const startMonth = parseInt(start[1], 10);
    const endMonth = parseInt(end[1], 10);
    let startIdx = parseInt(start[2], 10) - 1;
    let endIdx = parseInt(end[2], 10) - 1;

    const sameMonth = start[1] === end[1];

    if (!sameMonth) {
      const eventStartedBeforeThisMonth = startMonth < currentMonth + 1;
      const eventExtendsBeyondThisMonth = currentMonth + 1 < endMonth;

      if (eventStartedBeforeThisMonth) startIdx = 0;
      if (eventExtendsBeyondThisMonth) endIdx = currentMonthDays - 1;
    }

    for (let i = startIdx; i < endIdx + 1; i += 1) {
      updatedEvents[i].push(event);
    }
  });

  return updatedEvents;
};

export default assignEvents;
