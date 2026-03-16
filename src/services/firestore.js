import { db, collections } from "./firebase";

export const getEventsCollection = () => {
  return db.collection(collections.events);
};

export const getStaffCollection = () => {
  return db.collection(collections.staff);
};
