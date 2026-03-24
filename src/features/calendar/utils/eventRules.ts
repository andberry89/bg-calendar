import type { EventType } from '@/types/calendar';

type DraftEventType = EventType | '';

export interface EventReminder {
  message: string;
  linkHref: string;
  linkLabel: string;
}

export const specialDayReminderTypes: ReadonlySet<EventType> = new Set([
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

export function shouldShowSpecialDayReminder(type: DraftEventType): boolean {
  return type !== '' && specialDayReminderTypes.has(type);
}

export function getSpecialDayReminder(type: DraftEventType): EventReminder | null {
  return shouldShowSpecialDayReminder(type) ? specialDayReminder : null;
}

export function getEventReminder(type: DraftEventType): EventReminder | null {
  return getSpecialDayReminder(type);
}
