import type { CalendarEvent, EventsByYear } from '@/types/calendar';

export const sortEvents = (events: CalendarEvent[]): EventsByYear => {
  const yearsWithEvents = events
    .map((event) => {
      const start = event.start.split('-')[0];
      const end = event.end.split('-')[0];

      return start === end ? start : [start, end];
    })
    .flat();

  const uniqueYears = [...new Set(yearsWithEvents)];
  const sortedEvents: EventsByYear = {};

  uniqueYears.forEach((year) => {
    const yearEvents = events.filter((event) => {
      const start = event.start.split('-')[0];
      const end = event.end.split('-')[0];

      return start === year || end === year;
    });

    sortedEvents[year] = yearEvents;
  });

  return sortedEvents;
};
