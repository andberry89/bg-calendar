import { getDocs } from 'firebase/firestore';
import { getEventsCollection, getStaffCollection } from '@/services';
import type { CalendarEvent, Staff } from '@/types/calendar';

export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  const snapshot = await getDocs(getEventsCollection());
  const events: CalendarEvent[] = [];

  snapshot.forEach((docSnapshot) => {
    const appData = docSnapshot.data() as Omit<CalendarEvent, 'id'>;

    events.push({
      ...appData,
      id: docSnapshot.id
    });
  });

  return events;
};

export const fetchStaff = async (): Promise<Staff[]> => {
  const snapshot = await getDocs(getStaffCollection());
  const staff: Staff[] = [];

  snapshot.forEach((docSnapshot) => {
    const appData = docSnapshot.data() as Omit<Staff, 'id'>;

    staff.push({
      ...appData,
      id: docSnapshot.id
    });
  });

  return staff.sort((a, b) => a.lastName.localeCompare(b.lastName));
};

export const fetchCalendarPageData = async (): Promise<{
  events: CalendarEvent[];
  staff: Staff[];
}> => {
  const [events, staff] = await Promise.all([fetchEvents(), fetchStaff()]);

  return {
    events,
    staff
  };
};
