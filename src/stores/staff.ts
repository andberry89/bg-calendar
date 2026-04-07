import { defineStore } from 'pinia';
import { fetchStaff as fetchStaffData } from '@/services/calendar/calendar-data';
import { addStaff as addStaffMutation, deleteStaff as deleteStaffMutation } from '@/services';
import { getPersonColorKeyByIndex, type PersonColorKey } from '@/features/calendar/utils';
import type { MutationResult, NewStaffInput, Staff } from '@/types/calendar';

interface StaffState {
  staff: Staff[];
}

export const useStaffStore = defineStore('staff', {
  state: (): StaffState => ({
    staff: []
  }),

  getters: {
    staffColorKeyById(state): Record<string, PersonColorKey> {
      const sortedStaff = [...state.staff].sort((left, right) => left.id.localeCompare(right.id));

      return Object.fromEntries(
        sortedStaff.map((member, index) => [member.id, getPersonColorKeyByIndex(index)])
      );
    }
  },

  actions: {
    async fetchStaff(): Promise<void> {
      this.staff = await fetchStaffData();
    },

    async addStaff(person: NewStaffInput): Promise<MutationResult> {
      const result = await addStaffMutation(person);

      if (result.success) {
        await this.fetchStaff();
      }

      return result;
    },

    async deleteStaff(id: string): Promise<MutationResult> {
      const result = await deleteStaffMutation(id);

      if (result.success) {
        await this.fetchStaff();
      }

      return result;
    }
  }
});
