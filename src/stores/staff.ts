// src/stores/staff.ts
import { defineStore } from "pinia";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { addStaff as addStaffApi, deleteStaff as deleteStaffApi } from "@/router/staff";

export type StaffMember = {
  id: string;
  firstName: string;
  lastName: string;
  initials?: string;
  shortName?: string;
};

export const useStaffStore = defineStore("staff", {
  state: () => ({
    staff: [] as StaffMember[],
    loading: false,
    error: "" as string | null,
  }),

  actions: {
    async fetchStaff() {
      this.loading = true;
      this.error = null;

      try {
        const snap = await getDocs(collection(db, "staff"));
        const staff: StaffMember[] = [];

        snap.forEach((doc) => {
          staff.push({ id: doc.id, ...(doc.data() as Omit<StaffMember, "id">) });
        });

        this.staff = staff.sort((a, b) =>
          a.lastName > b.lastName ? 1 : b.lastName > a.lastName ? -1 : 0
        );
      } catch (e: any) {
        this.error = e?.message ?? "Failed to fetch staff";
      } finally {
        this.loading = false;
      }
    },

    async addStaff(person: Omit<StaffMember, "id">) {
      this.error = null;
      const res = await addStaffApi(person);

      if (!res?.success) {
        this.error = res?.message ?? "Failed to add staff";
        return res;
      }

      await this.fetchStaff();
      return res;
    },

    async removeStaff(id: string) {
      this.error = null;
      const res = await deleteStaffApi(id);

      if (!res?.success) {
        this.error = res?.message ?? "Failed to remove staff";
        return res;
      }

      await this.fetchStaff();
      return res;
    },
  },
});
