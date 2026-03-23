export interface CurrentDate {
  date: number;
  month: number;
  year: number;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  shortName: string;
}

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

export interface CalendarEvent {
  id: string;
  class: EventClass;
  closed: HolidayClosure;
  details: string;
  end: string;
  start: string;
  staff: Staff[];
  type: EventType;
}

export type CalendarEventDocument = Omit<CalendarEvent, 'id'>;
export type StaffDocument = Omit<Staff, 'id'>;
export type NewCalendarEvent = CalendarEventDocument;

export interface NewStaffInput {
  firstName: string;
  lastName: string;
}

export interface MutationResult {
  success: boolean;
  message: string;
  error?: unknown;
}

export type EventsByYear = Record<string, CalendarEvent[]>;

export type StaffUpdatePayload = ['add', NewStaffInput] | ['remove', Staff];
