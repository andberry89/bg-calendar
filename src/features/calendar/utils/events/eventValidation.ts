import type { Staff } from '@/types/calendar';
import type { DraftEventType } from '@/types/calendar-draft';
import { getEventTypeConfig, type EventTypeField } from '@/features/calendar/utils';

interface EventValidationInput {
  type: DraftEventType;
  start: string;
  end: string;
  details: string;
  staff: Staff[];
}

export type EventField = EventTypeField;

export function getRequiredEventFields(type: DraftEventType): EventField[] {
  const config = getEventTypeConfig(type);
  return config ? config.requiredFields : [];
}

// Validates event input and returns a list of missing or invalid fields for the form.
export function validateEvent(input: EventValidationInput): string[] {
  const errors: string[] = [];

  if (!input.type) {
    errors.push('Event Type');
  }

  if (!input.start) {
    errors.push('Start Date');
  }

  if (!input.end) {
    errors.push('End Date');
  }

  if (getRequiredEventFields(input.type).includes('details') && !input.details) {
    errors.push('Event Details');
  }

  // These event types require exactly one staff member.
  if (input.type === 'Comp Day' || input.type === 'Birthday') {
    if (input.staff.length !== 1) {
      errors.push('Exactly 1 Staff Member');
    }

    return errors;
  }

  if (getRequiredEventFields(input.type).includes('staff') && input.staff.length === 0) {
    errors.push('Staff');
  }

  return errors;
}
