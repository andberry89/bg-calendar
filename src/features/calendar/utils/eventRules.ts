import type { EventType } from '@/types/calendar';

export const specialDayReminderTypes: EventType[] = [
  'Press Trip',
  'Auto Show',
  'C/D Event',
  'Comp Day'
];

export function shouldShowSpecialDayReminder(type: EventType | ''): boolean {
  return specialDayReminderTypes.includes(type as EventType);
}
