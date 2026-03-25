import type { EventType } from '@/types/calendar';

type DraftEventType = EventType | '';

export type EventTypeField = 'details' | 'staff';

export interface EventTypeConfig {
  requiredFields: EventTypeField[];
  showsSpecialDayReminder: boolean;
  colorVar: string;
}

const eventTypeConfig: Readonly<Record<EventType, EventTypeConfig>> = {
  Vacation: {
    requiredFields: ['staff'],
    showsSpecialDayReminder: false,
    colorVar: '--event-type-vacation'
  },
  'Sick Time': {
    requiredFields: ['details', 'staff'],
    showsSpecialDayReminder: false,
    colorVar: '--event-type-sick-time'
  },
  Holiday: {
    requiredFields: [],
    showsSpecialDayReminder: false,
    colorVar: '--event-type-holiday'
  },
  'Press Trip': {
    requiredFields: ['details', 'staff'],
    showsSpecialDayReminder: true,
    colorVar: '--event-type-press-trip'
  },
  'Auto Show': {
    requiredFields: ['details', 'staff'],
    showsSpecialDayReminder: true,
    colorVar: '--event-type-auto-show'
  },
  Birthday: {
    requiredFields: ['staff'],
    showsSpecialDayReminder: false,
    colorVar: '--event-type-birthday'
  },
  'C/D Event': {
    requiredFields: ['details'],
    showsSpecialDayReminder: true,
    colorVar: '--event-type-cd-event'
  },
  'Comp Day': {
    requiredFields: ['staff'],
    showsSpecialDayReminder: true,
    colorVar: '--event-type-comp-day'
  }
};

export function getEventTypeConfig(type: DraftEventType): EventTypeConfig | null {
  return type ? eventTypeConfig[type] : null;
}

export function isEventFieldRequired(type: DraftEventType, field: EventTypeField): boolean {
  const config = getEventTypeConfig(type);

  return config ? config.requiredFields.includes(field) : false;
}

export function showsSpecialDayReminder(type: DraftEventType): boolean {
  const config = getEventTypeConfig(type);

  return config ? config.showsSpecialDayReminder : false;
}
