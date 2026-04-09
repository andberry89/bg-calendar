// Calendar navigation / date state
export interface CurrentDate {
  date: number;
  month: number;
  year: number;
}

export type CalendarDateString = string;

// Staff
export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  shortName: string;
}

export type StaffDocument = Omit<Staff, 'id'>;

export interface NewStaffInput {
  firstName: string;
  lastName: string;
}

export type StaffUpdatePayload = ['add', NewStaffInput] | ['remove', Staff];

// Event taxonomy
export type EventType =
  | 'Vacation'
  | 'Sick Time'
  | 'Holiday'
  | 'Press Trip'
  | 'Auto Show'
  | 'Birthday'
  | 'C/D Event'
  | 'Comp Day';

export type EventClass =
  | ''
  | 'vacation'
  | 'sick-time'
  | 'holiday'
  | 'press-trip'
  | 'auto-show'
  | 'birthday'
  | 'cd-event'
  | 'comp-day';

export type HolidayClosure = '' | 'none' | 'half' | 'full';

// Calendar events
export interface CalendarEvent {
  id: string;
  class: EventClass;
  closed: HolidayClosure;
  details: string;
  end: CalendarDateString;
  start: CalendarDateString;
  staff: Staff[];
  type: EventType;
}

export interface AssignedCalendarEvent extends CalendarEvent {
  display: {
    startsToday: boolean;
    endsToday: boolean;
    isMultiDay: boolean;
    spanIndex: number;
    spanLength: number;
  };
}

export interface CalendarEventLaneSlot {
  event: AssignedCalendarEvent | null;
  spanRows: number;
  isReserved: boolean;
  occupiedBySpan: boolean;
}

export type CalendarEventDocument = Omit<CalendarEvent, 'id'>;
export type NewCalendarEvent = CalendarEventDocument;
export type EventsByYear = Record<string, CalendarEvent[]>;

// Shared service/store results
export interface MutationResult {
  success: boolean;
  message: string;
  error?: unknown;
}
