import type { EventType } from '@/types/calendar';
import { showsSpecialDayReminder } from '@/features/calendar/utils/eventTypeConfig';

type DraftEventType = EventType | '';

export interface EventReminder {
  message: string;
  linkHref: string;
  linkLabel: string;
}

export const specialDayReminder: EventReminder = {
  message: 'Reminder: Update the Special Day Tracker.',
  linkHref: 'https://www.myhearst.com/group/magazines/in-office-resources',
  linkLabel: 'View In-Office Resources'
};

export function shouldShowSpecialDayReminder(type: DraftEventType): boolean {
  return showsSpecialDayReminder(type);
}

export function getSpecialDayReminder(type: DraftEventType): EventReminder | null {
  return shouldShowSpecialDayReminder(type) ? specialDayReminder : null;
}

export function getEventReminder(type: DraftEventType): EventReminder | null {
  return getSpecialDayReminder(type);
}
