import type { EventType, Staff } from '@/types/calendar';

type DraftEventType = EventType | '';

interface EventValidationInput {
  type: DraftEventType;
  start: string;
  end: string;
  details: string;
  staff: Staff[];
}

export type EventField = 'details' | 'staff';

export function getRequiredEventFields(type: DraftEventType): EventField[] {
  if (!type) {
    return [];
  }

  const requiredFields: EventField[] = [];

  if (requiresDetails(type)) {
    requiredFields.push('details');
  }

  if (type === 'Comp Day' || type === 'Birthday') {
    requiredFields.push('staff');
    return requiredFields;
  }

  if (requiresStaff(type)) {
    requiredFields.push('staff');
  }

  return requiredFields;
}

export function isFieldRequired(type: DraftEventType, field: EventField): boolean {
  return getRequiredEventFields(type).includes(field);
}

const detailOptionalTypes: ReadonlySet<EventType> = new Set([
  'Vacation',
  'Sick Time',
  'Birthday',
  'Comp Day'
]);

const staffOptionalTypes: ReadonlySet<EventType> = new Set(['Holiday', 'C/D Event']);

function requiresDetails(type: DraftEventType): boolean {
  return type !== '' && !detailOptionalTypes.has(type);
}

function requiresStaff(type: DraftEventType): boolean {
  return type !== '' && !staffOptionalTypes.has(type);
}

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

  if (requiresDetails(input.type) && !input.details) {
    errors.push('Event Details');
  }

  if (input.type === 'Comp Day' || input.type === 'Birthday') {
    if (input.staff.length !== 1) {
      errors.push('Exactly 1 Staff Member');
    }

    return errors;
  }

  if (requiresStaff(input.type) && input.staff.length === 0) {
    errors.push('Staff');
  }

  return errors;
}
