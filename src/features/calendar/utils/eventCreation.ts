import type {
  EventClass,
  EventType,
  HolidayClosure,
  NewCalendarEvent,
  Staff
} from '@/types/calendar';

export interface DraftCalendarEventInput {
  class: EventClass | '';
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

export function getEventClass(type: EventType): EventClass {
  return eventClassByType[type];
}

export function createNewCalendarEvent(event: DraftCalendarEventInput): NewCalendarEvent {
  return {
    ...event,
    closed: event.type === 'Holiday' ? event.closed || 'none' : 'none',
    staff: event.type === 'Holiday' ? [] : [...event.staff],
    class: getEventClass(event.type),
    type: event.type
  };
}
