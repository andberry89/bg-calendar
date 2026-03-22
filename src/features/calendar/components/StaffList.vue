<template>
  <article id="staff-list">
    <h2>Staff List</h2>
    <div v-for="(s, idx) in staff" :key="idx" class="staff-card">
      <div class="profile-picture">
        <img :src="imgUrl(s.lastName)" :alt="s.firstName + ' ' + s.lastName" />
      </div>
      <div class="staff-name">
        <span class="first-name">{{ s.firstName }}</span
        ><br />
        <span class="last-name">{{ s.lastName }}</span>
      </div>
    </div>
    <hr />
    <EditStaff :staff="staff" key="edit-staff" @update="emitStaff($event)" />
  </article>
</template>
<script setup lang="ts">
import EditStaff from './EditStaff.vue';
import type { Staff, StaffUpdatePayload } from '@/types/calendar';

defineProps<{
  staff: Staff[];
}>();

const emit = defineEmits<{
  (e: 'update', value: StaffUpdatePayload): void;
}>();

const images = import.meta.glob('@/assets/staff/*.{jpg,png}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

function emitStaff(staffUpdate: StaffUpdatePayload): void {
  emit('update', staffUpdate);
}

function imgUrl(name: string): string {
  return (
    images[`/src/assets/staff/${name}.jpg`] ||
    images[`/src/assets/staff/${name}.png`] ||
    images['/src/assets/staff/user.png']
  );
}
</script>
<style lang="scss" scoped>
#staff-list {
  font:
    400 12px/1.2 'Arial',
    sans-serif;
  min-width: 0;

  h2 {
    margin-bottom: var(--layout-gap-sm);
  }

  .staff-card {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: var(--layout-gap-sm);
    height: 70px;
    background-color: var(--white);
    color: var(--dark-gray);
    border-radius: var(--layout-radius-sm);
    border: 1px solid var(--ocean-slate-blue);
    overflow: hidden;
    margin: var(--layout-gap-sm) 0;
    padding: 6px 8px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--ocean-gray);
      cursor: pointer;
    }

    .profile-picture {
      overflow: hidden;
      position: relative;
      height: 60px;
      width: 60px;
      border-radius: var(--layout-radius-sm);
      border: 1px solid var(--ocean-slate-blue);

      img {
        height: auto;
        width: 60px;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }

    .staff-name {
      font-family: 'Arial';
      font-size: 12px;

      .last-name {
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
}
</style>
