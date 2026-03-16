import { db } from './firebase';

const collections = {
  events: 'calEvent',
  staff: 'staff'
};

export const getEventsCollection = () => {
  return db.collection(collections.events);
};

export const getStaffCollection = () => {
  return db.collection(collections.staff);
};
