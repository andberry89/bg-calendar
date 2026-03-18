import { collection, type CollectionReference } from 'firebase/firestore';
import { db } from './firebase';
import type { CalendarEvent, Staff } from '@/types/calendar';

const collections = {
  events: 'calEvent',
  staff: 'staff'
} as const;

export const getEventsCollection = (): CollectionReference<CalendarEvent> => {
  return collection(db, collections.events) as CollectionReference<CalendarEvent>;
};

export const getStaffCollection = (): CollectionReference<Staff> => {
  return collection(db, collections.staff) as CollectionReference<Staff>;
};
