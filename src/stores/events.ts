import { defineStore } from 'pinia';
import { fetchEvents as fetchEventsData } from '@/services/calendar/calendar-data';
import { addEvent as addEventMutation, deleteEvent as deleteEventMutation } from '@/services';
import type { CalendarEvent, MutationResult, NewCalendarEvent } from '@/types/calendar';

interface EventsState {
  events: CalendarEvent[];
}

export const useEventsStore = defineStore('events', {
  state: (): EventsState => ({
    events: []
  }),

  actions: {
    async fetchEvents(): Promise<void> {
      this.events = await fetchEventsData();
    },

    async addEvent(event: NewCalendarEvent): Promise<MutationResult> {
      const result = await addEventMutation(event);

      if (result.success) {
        await this.fetchEvents();
      }

      return result;
    },

    async deleteEvent(id: string): Promise<MutationResult> {
      const result = await deleteEventMutation(id);

      if (result.success) {
        await this.fetchEvents();
      }

      return result;
    }
  }
});
