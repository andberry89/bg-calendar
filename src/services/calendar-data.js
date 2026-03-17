import { getDocs } from 'firebase/firestore';
import { getEventsCollection, getStaffCollection } from '@/services';

export const fetchEvents = async () => {
  const snapshot = await getDocs(getEventsCollection());
  const events = [];

  snapshot.forEach((docSnapshot) => {
    const appData = docSnapshot.data();
    appData.id = docSnapshot.id;
    events.push(appData);
  });

  return events;
};

export const fetchStaff = async () => {
  const snapshot = await getDocs(getStaffCollection());
  const staff = [];

  snapshot.forEach((docSnapshot) => {
    const appData = docSnapshot.data();
    appData.id = docSnapshot.id;
    staff.push(appData);
  });

  return staff.sort((a, b) => a.lastName.localeCompare(b.lastName));
};

export const fetchCalendarPageData = async () => {
  const [events, staff] = await Promise.all([fetchEvents(), fetchStaff()]);

  return {
    events,
    staff
  };
};
