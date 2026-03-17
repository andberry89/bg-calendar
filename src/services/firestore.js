import { collection } from 'firebase/firestore';
import { db } from './firebase';

const collections = {
  events: 'calEvent',
  staff: 'staff'
};

export const getEventsCollection = () => {
  return collection(db, collections.events);
};

export const getStaffCollection = () => {
  return collection(db, collections.staff);
};
