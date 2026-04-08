import type {
  EventClass,
  EventType,
  HolidayClosure,
  NewCalendarEvent,
  Staff
} from '@/types/calendar';

export interface DraftCalendarEventInput {
  closed: HolidayClosure;
  details: string;
  end: string;
  type: EventType | '';
  start: string;
  staff: Staff[];
}

const eventClassByType: Record<EventType, EventClass> = {
  'Auto Show': 'auto-show',
  'Press Trip': 'press-trip',
  'C/D Event': 'cd-event',
  'Comp Day': 'comp-day',
  Vacation: 'vacation',
  'Sick Time': 'sick-time',
  Holiday: 'holiday',
  Birthday: 'birthday'
};

function hasEventType(type: DraftCalendarEventInput['type']): type is EventType {
  return type !== '';
}

export function getEventClass(type: EventType): EventClass {
  return eventClassByType[type];
}

export function createNewCalendarEvent(event: DraftCalendarEventInput): NewCalendarEvent {
  if (!hasEventType(event.type)) {
    throw new Error('Cannot create calendar event without a valid event type.');
  }

  return {
    ...event,
    closed: event.type === 'Holiday' ? event.closed || 'none' : 'none',
    staff: event.type === 'Holiday' ? [] : [...event.staff],
    class: getEventClass(event.type),
    type: event.type
  };
}
