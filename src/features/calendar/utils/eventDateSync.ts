import { compareDesc, parse } from 'date-fns';
import type { EventType } from '@/types/calendar';

export type DateSyncTarget = 'start' | 'end';

type DraftEventType = EventType | '';

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

  if (input.type === 'Birthday') {
    nextDates.end = nextDates.start;
    return nextDates;
  }

  const startDate = parse(nextDates.start, 'yyyy-MM-dd', new Date());
  const endDate = parse(nextDates.end, 'yyyy-MM-dd', new Date());
  const result = compareDesc(startDate, endDate);

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
