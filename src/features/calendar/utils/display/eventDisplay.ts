import type { CalendarEvent } from '@/types/calendar';

export interface EventDisplayContent {
  primary: string;
  secondary: string;
  emoji: string;
}

interface EventDisplayOptions {
  staffDisplayName?: string;
}

function getHolidayClosureLabel(event: CalendarEvent): string {
  if (event.closed === 'half') {
    return 'Early Close';
  }

  if (event.closed === 'full') {
    return 'Office Closed';
  }

  return '';
}

// Returns the text and emoji shown for an event in the calendar UI.
export function getEventDisplayContent(
  event: CalendarEvent,
  options: EventDisplayOptions = {}
): EventDisplayContent {
  const staffDisplayName = options.staffDisplayName?.trim() || 'Staff';

  switch (event.class) {
    case 'birthday':
      return {
        primary: `${staffDisplayName} Birthday`,
        secondary: '',
        emoji: '🎂'
      };

    case 'press-trip':
      return {
        primary: staffDisplayName,
        secondary: 'Press Trip',
        emoji: ''
      };

    case 'vacation':
      return {
        primary: staffDisplayName,
        secondary: 'Off (PTO)',
        emoji: ''
      };

    case 'sick-time':
      return {
        primary: staffDisplayName,
        secondary: 'Sick Time',
        emoji: ''
      };

    case 'comp-day':
      return {
        primary: staffDisplayName,
        secondary: 'Comp Day',
        emoji: ''
      };

    case 'auto-show':
      return {
        primary: 'Auto Show',
        secondary: event.details,
        emoji: ''
      };

    case 'cd-event':
      return {
        primary: event.details || 'C/D Event',
        secondary: '',
        emoji: ''
      };

    case 'holiday':
      return {
        primary: event.details || event.type,
        secondary: getHolidayClosureLabel(event),
        emoji: ''
      };

    default:
      return {
        primary: event.type,
        secondary: '',
        emoji: ''
      };
  }
}
