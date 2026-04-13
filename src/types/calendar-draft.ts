import type { EventType } from '@/types/calendar';

// Allows draft events to start without a selected type.
// An empty string represents an uninitialized form state.
export type DraftEventType = EventType | '';
