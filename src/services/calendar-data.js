import { getEventsCollection, getStaffCollection } from '@/services';

export const fetchEvents = async () => {
  const snapshot = await getEventsCollection().get();
  const events = [];

  snapshot.forEach((doc) => {
    const appData = doc.data();
    appData.id = doc.id;
    events.push(appData);
  });

  return events;
};

export const fetchStaff = async () => {
  const snapshot = await getStaffCollection().get();
  const staff = [];

  snapshot.forEach((doc) => {
    const appData = doc.data();
    appData.id = doc.id;
    staff.push(appData);
  });

  return staff.sort((a, b) => (a.lastName > b.lastName ? 1 : b.lastName > a.lastName ? -1 : 0));
};
