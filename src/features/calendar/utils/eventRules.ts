import type { EventType } from '@/types/calendar';

export interface EventReminder {
  message: string;
  linkHref: string;
  linkLabel: string;
}

const specialDayReminderTypes: ReadonlySet<EventType> = new Set([
  'Press Trip',
  'Auto Show',
  'C/D Event',
  'Comp Day'
]);

export const specialDayReminder: EventReminder = {
  message: 'Reminder: Update the Special Day Tracker.',
  linkHref: 'https://www.myhearst.com/group/magazines/in-office-resources',
  linkLabel: 'View In-Office Resources'
};

export function shouldShowSpecialDayReminder(type: EventType | ''): boolean {
  return type !== '' && specialDayReminderTypes.has(type);
}

export function getEventReminder(type: EventType | ''): EventReminder | null {
  return shouldShowSpecialDayReminder(type) ? specialDayReminder : null;
}
