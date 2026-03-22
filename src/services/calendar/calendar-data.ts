import { getDocs } from 'firebase/firestore';
import { getEventsCollection, getStaffCollection } from '@/services';
import type { CalendarEvent, CalendarEventDocument, Staff, StaffDocument } from '@/types/calendar';

const mapEvent = (id: string, data: CalendarEventDocument): CalendarEvent => {
  return {
    id,
    ...data
  };
};

const mapStaff = (id: string, data: StaffDocument): Staff => {
  return {
    id,
    ...data
  };
};

export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  const snapshot = await getDocs(getEventsCollection());

  return snapshot.docs.map((doc) => mapEvent(doc.id, doc.data()));
};

export const fetchStaff = async (): Promise<Staff[]> => {
  const snapshot = await getDocs(getStaffCollection());

  const staff = snapshot.docs.map((doc) => mapStaff(doc.id, doc.data()));

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
