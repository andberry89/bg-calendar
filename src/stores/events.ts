import { defineStore } from "pinia";
import { collection, getDocs } from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { addEvent as addEventApi, deleteEvent as deleteEventApi } from "@/router/events";

export type CalEvent = {
  id?: string;
  staff: any[];
  start: string;
  end: string;
  closed: string;
  details: string;
  class: string;
  type: string;
  startAt?: Timestamp;
  endAt?: Timestamp;
};

function sortByStartAsc(a: CalEvent, b: CalEvent) {
  return (
    new Date(a.start.replace(/-/g, "/").replace(/T.+/, "")).getTime() -
    new Date(b.start.replace(/-/g, "/").replace(/T.+/, "")).getTime()
  );
}

export const useEventsStore = defineStore("events", {
  state: () => ({
    events: [] as CalEvent[],
    loading: false,
    error: "" as string | null,
  }),
  getters: {
    eventsByYear: (state) => {
      const years = state.events
        .map((e) => {
          const startY = e.start.split("-")[0];
          const endY = e.end.split("-")[0];
          return startY === endY ? [startY] : [startY, endY];
        })
        .flat();

      const uniqueYears = [...new Set(years)];
      const byYear: Record<string, CalEvent[]> = {};

      uniqueYears.forEach((year) => {
        byYear[year] = state.events.filter((e) => {
          const startY = e.start.split("-")[0];
          const endY = e.end.split("-")[0];
          return startY === year || endY === year;
        });
      });

      return byYear;
    },

    // Usage: store.eventsForMonth(year, month0)
    eventsForMonth: (state) => {
      return (year: number, month0: number) => {
        const yearStr = String(year);

        const yearEvents = state.events.filter((e) => {
          const startY = e.start.split("-")[0];
          const endY = e.end.split("-")[0];
          return startY === yearStr || endY === yearStr;
        });

        return yearEvents
          .filter((e) => {
            const startM = Number(e.start.split("-")[1]) - 1;
            const endM = Number(e.end.split("-")[1]) - 1;
            return startM === month0 || endM === month0;
          })
          .slice()
          .sort(sortByStartAsc);
      };
    },
  },

  actions: {
    async fetchEvents() {
      this.loading = true;
      this.error = null;

      try {
        const snap = await getDocs(collection(db, "calEvent"));
        const events: CalEvent[] = [];
        snap.forEach((doc) => events.push({ id: doc.id, ...(doc.data() as Omit<CalEvent, "id">) }));
        this.events = events;
      } catch(e: any) {
        this.error = e?.message ?? "Failed to fetch events";
      } finally {
        this.loading = false;
      }
    },

    async addEvent(event: Omit<CalEvent, "id">) {
      this.error = null;
      const res = await addEventApi(event);

      if (!res?.success) {
        this.error = res?.message ?? "Failed to add event";
        return res;
      }

      await this.fetchEvents();
      return res;
    },

    async removeEvent(id: string) {
      this.error = null;
      const res = await deleteEventApi(id);

      if (!res?.success) {
        this.error = res?.message ?? "Failed to delete event";
        return res;
      }

      await this.fetchEvents();
      return res;
    },
  },
})