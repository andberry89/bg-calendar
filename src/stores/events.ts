import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import type { Timestamp as TsType } from "firebase/firestore";
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
  startAt?: TsType;
  endAt?: TsType;
};

function monthKey(year: number, month0: number) {
  return `${year}-${String(month0 + 1).padStart(2, "0")}`;
}

function monthBoundsUtc(year: number, month0: number) {
  const start = Timestamp.fromDate(new Date(Date.UTC(year, month0, 1, 0, 0, 0)));
  const end = Timestamp.fromDate(new Date(Date.UTC(year, month0 + 1, 0, 23, 59, 59)));
  return { start, end };
}

function sortByStartAsc(a: CalEvent, b: CalEvent) {
  return (
    new Date(a.start.replace(/-/g, "/").replace(/T.+/, "")).getTime() -
    new Date(b.start.replace(/-/g, "/").replace(/T.+/, "")).getTime()
  );
}

export const useEventsStore = defineStore("events", {
  state: () => ({
    // cache: monthKey -> events for that month
    eventsByMonth: {} as Record<string, CalEvent[]>,
    loading: false,
    error: "" as string | null,
  }),

  getters: {
    // Usage: store.eventsForMonth(year, month0)
    eventsForMonth: (state) => {
      return (year: number, month0: number) => {
        const key = monthKey(year, month0);
        return (state.eventsByMonth[key] ?? []).slice().sort(sortByStartAsc);
      };
    },
  },

  actions: {
    async fetchEventsForMonth(year: number, month0: number) {
      const key = monthKey(year, month0);
      if (this.eventsByMonth[key]) return;

      this.loading = true;
      this.error = null;

      try {
        const { start, end } = monthBoundsUtc(year, month0);

        // overlap query: startAt <= monthEnd AND endAt >= monthStart
        const q = query(
          collection(db, "calEvent"),
          where("startAt", "<=", end),
          where("endAt", ">=", start)
        );

        const snap = await getDocs(q);
        const events: CalEvent[] = [];
        snap.forEach((d) => events.push({ id: d.id, ...(d.data() as Omit<CalEvent, "id">) }));

        this.eventsByMonth[key] = events;
      } catch (e: any) {
        // If you haven't created the composite index yet, Firestore throws and provides a link.
        this.error = e?.message ?? "Failed to fetch events for month";
      } finally {
        this.loading = false;
      }
    },

    // After mutations, invalidate cache for simplicity
    async addEvent(event: Omit<CalEvent, "id">) {
      this.error = null;
      const res = await addEventApi(event);

      if (!res?.success) {
        this.error = res?.message ?? "Failed to add event";
        return res;
      }

      // simplest: clear cache so UI refreshes correctly
      this.eventsByMonth = {};
      return res;
    },

    async removeEvent(id: string) {
      this.error = null;
      const res = await deleteEventApi(id);

      if (!res?.success) {
        this.error = res?.message ?? "Failed to delete event";
        return res;
      }

      this.eventsByMonth = {};
      return res;
    },
  },
});
