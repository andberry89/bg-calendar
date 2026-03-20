import type { CalendarEvent, CurrentDate, EventsByYear } from '@/types/calendar';

export const getCurrentMonthEvents = (
  sortedEvents: EventsByYear,
  currentDate: CurrentDate
): CalendarEvent[] => {
  const currentYearEvents = sortedEvents[String(currentDate.year)];

  if (!currentYearEvents) {
    return [];
  }

  const targetMonth = currentDate.month;
  const monthEvents: { event: CalendarEvent; startTime: number }[] = [];

  for (const eventItem of currentYearEvents) {
    const startMonth = Number(eventItem.start.slice(5, 7)) - 1;
    const endMonth = Number(eventItem.end.slice(5, 7)) - 1;

    if (targetMonth === startMonth || targetMonth === endMonth) {
      monthEvents.push({
        event: eventItem,
        startTime: Date.parse(eventItem.start)
      });
    }
  }

  monthEvents.sort((a, b) => a.startTime - b.startTime);

  return monthEvents.map(({ event }) => event);
};
