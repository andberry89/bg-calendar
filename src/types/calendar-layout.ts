import type { AssignedCalendarEvent, CalendarEvent as CalendarEventType } from '@/types/calendar';

// Represents a single visible cell in the calendar grid.
// Indicates whether the day belongs to the current month or an adjacent one.
export type CalendarWeekCell = {
  date: number;
  month: 'prev' | 'current' | 'next';
};

export type CalendarWeekSegmentState = 'single' | 'start' | 'middle' | 'end';

// Represents the portion of a multi-day event that appears within this week.
// Flags indicate if the event continues before or after the visible range.
export type CalendarWeekSpanningSegment = {
  event: AssignedCalendarEvent;
  laneIndex: number;
  startDayIndex: number;
  endDayIndex: number;
  state: CalendarWeekSegmentState;
  isClippedLeft: boolean;
  isClippedRight: boolean;
  isFullCloseStart: boolean;
};

// Stores where a regular event appears in the week and how many days it spans.
export type CalendarWeekRegularEventPlacement = {
  event: AssignedCalendarEvent;
  laneIndex: number;
  startDayIndex: number;
  endDayIndex: number;
};

// Represents the event and day the user clicked within a week.
export type SelectedWeekSpanEvent = {
  event: CalendarEventType;
  day: number;
  anchorDay: number;
  weekIdx: number;
};
