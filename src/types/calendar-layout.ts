import type { AssignedCalendarEvent, CalendarEvent as CalendarEventType } from '@/types/calendar';

export type CalendarWeekCell = {
  date: number;
  month: 'prev' | 'current' | 'next';
};

export type CalendarWeekSegmentState = 'single' | 'start' | 'middle' | 'end';

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

export type CalendarWeekRegularEventPlacement = {
  event: AssignedCalendarEvent;
  laneIndex: number;
  startDayIndex: number;
  endDayIndex: number;
};

export type SelectedWeekSpanEvent = {
  event: CalendarEventType;
  day: number;
  anchorDay: number;
  weekIdx: number;
};
