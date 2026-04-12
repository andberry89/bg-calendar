import { format } from 'date-fns';

type DateRange = {
  start: string;
  end: string;
};

export function formatEventDateRange({ start, end }: DateRange): string {
  const startDate = new Date(start.replace(/-/g, '/'));
  const endDate = new Date(end.replace(/-/g, '/'));

  const sameDay = start === end;
  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  if (sameDay) {
    return format(startDate, 'MMM d, yyyy');
  }

  if (sameYear) {
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  }

  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
}
