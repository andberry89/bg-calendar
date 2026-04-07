import type { EventType } from '@/types/calendar';

type DraftEventType = EventType | '';

export type EventTypeField = 'details' | 'staff';

export interface EventTypeConfig {
  requiredFields: EventTypeField[];
  showsSpecialDayReminder: boolean;
  colorVar: string;
  pillBg: string;
  pillBorder: string;
}

const eventTypeConfig: Readonly<Record<EventType, EventTypeConfig>> = {
  Vacation: {
    requiredFields: ['staff'],
    showsSpecialDayReminder: false,
    colorVar: '--event-type-vacation',
    pillBg: 'rgba(22, 163, 74, 0.16)',
    pillBorder: 'rgba(22, 163, 74, 0.3)'
  },
  'Sick Time': {
    requiredFields: ['staff'],
    showsSpecialDayReminder: false,
    colorVar: '--event-type-sick-time',
    pillBg: 'rgba(239, 68, 68, 0.16)',
    pillBorder: 'rgba(239, 68, 68, 0.3)'
  },
  Holiday: {
    requiredFields: [],
    showsSpecialDayReminder: false,
    colorVar: '--event-type-holiday',
    pillBg: 'rgba(192, 132, 26, 0.2)',
    pillBorder: 'rgba(192, 132, 26, 0.36)'
  },
  'Press Trip': {
    requiredFields: ['details', 'staff'],
    showsSpecialDayReminder: true,
    colorVar: '--event-type-press-trip',
    pillBg: 'rgba(37, 99, 235, 0.16)',
    pillBorder: 'rgba(37, 99, 235, 0.3)'
  },
  'Auto Show': {
    requiredFields: ['details', 'staff'],
    showsSpecialDayReminder: true,
    colorVar: '--event-type-auto-show',
    pillBg: 'rgba(234, 88, 12, 0.16)',
    pillBorder: 'rgba(234, 88, 12, 0.3)'
  },
  Birthday: {
    requiredFields: ['staff'],
    showsSpecialDayReminder: false,
    colorVar: '--event-type-birthday',
    pillBg: 'rgba(219, 39, 119, 0.16)',
    pillBorder: 'rgba(219, 39, 119, 0.3)'
  },
  'C/D Event': {
    requiredFields: ['details'],
    showsSpecialDayReminder: true,
    colorVar: '--event-type-cd-event',
    pillBg: 'rgba(124, 58, 237, 0.16)',
    pillBorder: 'rgba(124, 58, 237, 0.3)'
  },
  'Comp Day': {
    requiredFields: ['staff'],
    showsSpecialDayReminder: true,
    colorVar: '--event-type-comp-day',
    pillBg: 'rgba(15, 118, 110, 0.16)',
    pillBorder: 'rgba(15, 118, 110, 0.3)'
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

export function getEventTypeColor(type: DraftEventType): string | null {
  const config = getEventTypeConfig(type);
  return config ? `var(${config.colorVar})` : null;
}

export function getEventTypePillBg(type: DraftEventType): string | null {
  const config = getEventTypeConfig(type);

  return config ? config.pillBg : null;
}

export function getEventTypePillBorder(type: DraftEventType): string | null {
  const config = getEventTypeConfig(type);

  return config ? config.pillBorder : null;
}
