export interface CurrentDate {
  date: number;
  month: number;
  year: number;
}

export type NewCalendarEvent = Omit<CalendarEvent, 'id'>;

export interface NewStaffInput {
  firstName: string;
  lastName: string;
}

export interface MutationResult {
  success: boolean;
  message: string;
  error?: unknown;
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
  | 'Holiday'
  | 'Press Trip'
  | 'Auto Show'
  | 'Birthday'
  | 'C/D Event';

export type EventClass =
  | ''
  | 'vacation'
  | 'holiday'
  | 'press-trip'
  | 'auto-show'
  | 'birthday'
  | 'cd-event';

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

export type EventsByYear = Record<string, CalendarEvent[]>;

export type StaffDocument = Omit<Staff, 'id'>;

export type StaffUpdatePayload = ['add', NewStaffInput] | ['remove', Staff];
