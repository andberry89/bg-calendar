import type { CalendarEvent, CurrentDate, EventsByYear } from '@/types/calendar';

export const getCurrentMonthEvents = (
  sortedEvents: EventsByYear,
  currentDate: CurrentDate
): CalendarEvent[] => {
  const currentYearEvents = sortedEvents[String(currentDate.year)];

  if (!currentYearEvents) {
    return [];
  }

  return currentYearEvents
    .filter((eventItem) => {
      const startMonth = Number(eventItem.start.split('-')[1]) - 1;
      const endMonth = Number(eventItem.end.split('-')[1]) - 1;

      return currentDate.month === startMonth || currentDate.month === endMonth;
    })
    .sort((a, b) => {
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
};
