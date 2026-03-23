import type { CalendarEvent, EventType } from '@/types/calendar';

export interface EventFilters {
  types: EventType[];
  staffIds: string[];
}

export const filterEvents = (events: CalendarEvent[], filters: EventFilters): CalendarEvent[] => {
  const hasTypeFilters = filters.types.length > 0;
  const hasStaffFilters = filters.staffIds.length > 0;

  if (!hasTypeFilters && !hasStaffFilters) {
    return events;
  }

  return events.filter((event) => {
    const matchesType = !hasTypeFilters || filters.types.includes(event.type);
    const matchesStaff =
      !hasStaffFilters ||
      event.staff.some((staffMember) => filters.staffIds.includes(staffMember.id));

    return matchesType && matchesStaff;
  });
};
