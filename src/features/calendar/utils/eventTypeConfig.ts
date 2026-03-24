import type { EventType } from '@/types/calendar';

type DraftEventType = EventType | '';

export type EventTypeField = 'details' | 'staff';

export interface EventTypeConfig {
  requiredFields: EventTypeField[];
  showsSpecialDayReminder: boolean;
}

const eventTypeConfig: Readonly<Record<EventType, EventTypeConfig>> = {
  Vacation: {
    requiredFields: ['staff'],
    showsSpecialDayReminder: false
  },
  'Sick Time': {
    requiredFields: ['details', 'staff'],
    showsSpecialDayReminder: false
  },
  Holiday: {
    requiredFields: [],
    showsSpecialDayReminder: false
  },
  'Press Trip': {
    requiredFields: ['details', 'staff'],
    showsSpecialDayReminder: true
  },
  'Auto Show': {
    requiredFields: ['details', 'staff'],
    showsSpecialDayReminder: true
  },
  Birthday: {
    requiredFields: ['staff'],
    showsSpecialDayReminder: false
  },
  'C/D Event': {
    requiredFields: ['details'],
    showsSpecialDayReminder: true
  },
  'Comp Day': {
    requiredFields: ['staff'],
    showsSpecialDayReminder: true
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
