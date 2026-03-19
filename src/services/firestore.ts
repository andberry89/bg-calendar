import { collection, type CollectionReference } from 'firebase/firestore';
import { db } from './firebase';
import type { CalendarEventDocument, StaffDocument } from '@/types/calendar';

const collections = {
  events: 'calEvent',
  staff: 'staff'
} as const;

export const getEventsCollection = (): CollectionReference<CalendarEventDocument> => {
  return collection(db, collections.events) as CollectionReference<CalendarEventDocument>;
};

export const getStaffCollection = (): CollectionReference<StaffDocument> => {
  return collection(db, collections.staff) as CollectionReference<StaffDocument>;
};
