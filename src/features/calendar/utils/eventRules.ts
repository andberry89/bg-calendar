import type { EventType } from '@/types/calendar';

const specialDayReminderTypeSet: ReadonlySet<EventType> = new Set([
  'Press Trip',
  'Auto Show',
  'C/D Event',
  'Comp Day'
]);

export const specialDayReminder = {
  types: specialDayReminderTypeSet,
  message: 'Reminder: Update the Special Day Tracker.',
  link: 'https://www.myhearst.com/group/magazines/in-office-resources',
  linkLabel: 'View In-Office Resources'
};

export function shouldShowSpecialDayReminder(type: EventType | ''): boolean {
  return type !== '' && specialDayReminder.types.has(type);
}
