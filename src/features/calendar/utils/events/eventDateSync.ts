import { compareDesc, parse } from 'date-fns';
import type { DraftEventType } from '@/types/calendar-draft';

export type DateSyncTarget = 'start' | 'end';

export interface SyncEventDatesInput {
  start: string;
  end: string;
  type: DraftEventType;
  target: DateSyncTarget;
}

export interface SyncEventDatesResult {
  start: string;
  end: string;
}

// Keeps draft event dates in a valid order as the user edits them.// Keeps start and end dates in order as the user edits them.
// If one date is moved past the other, the other field is updated to match.
export function syncEventDates(input: SyncEventDatesInput): SyncEventDatesResult {
  const nextDates: SyncEventDatesResult = {
    start: input.start,
    end: input.end
  };

  if (nextDates.end === '') {
    nextDates.end = nextDates.start;
    return nextDates;
  }

  if (nextDates.start === '') {
    nextDates.start = nextDates.end;
    return nextDates;
  }

  // Birthdays always stay on a single day.
  if (input.type === 'Birthday') {
    nextDates.end = nextDates.start;
    return nextDates;
  }

  const startDate = parse(nextDates.start, 'yyyy-MM-dd', new Date());
  const endDate = parse(nextDates.end, 'yyyy-MM-dd', new Date());
  const result = compareDesc(startDate, endDate);

  // If the range flips, pull back the field the user just changed.
  if (result < 0) {
    if (input.target === 'end') {
      nextDates.end = nextDates.start;
    }

    if (input.target === 'start') {
      nextDates.start = nextDates.end;
    }
  }

  return nextDates;
}
