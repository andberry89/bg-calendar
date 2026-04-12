import type { CalendarEvent, CurrentDate, EventsByYear } from '@/types/calendar';

const toDate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const getCurrentMonthEvents = (
  sortedEvents: EventsByYear,
  currentDate: CurrentDate
): CalendarEvent[] => {
  const currentYearEvents = sortedEvents[String(currentDate.year)];

  if (!currentYearEvents) {
    return [];
  }

  const monthStart = new Date(currentDate.year, currentDate.month, 1);
  const monthEnd = new Date(currentDate.year, currentDate.month + 1, 0);

  return currentYearEvents
    .filter((event) => {
      const eventStart = toDate(event.start);
      const eventEnd = toDate(event.end);

      return eventStart <= monthEnd && eventEnd >= monthStart;
    })
    .sort((a, b) => toDate(a.start).getTime() - toDate(b.start).getTime());
};
