<template>
  <div class="manage-staff">
    <button type="button" class="manage-staff-button" @click="openModal">Manage Staff</button>

    <BaseModal v-if="showModal" @update="closeModal" @close="closeModal">
      <section class="manage-staff-modal">
        <header class="manage-staff-modal__header">
          <h2>Manage Staff</h2>
          <button type="button" class="manage-staff-modal__close" @click="closeModal">Close</button>
        </header>

        <EditStaff :staff="staff" @update="emitStaffUpdate" />
      </section>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import EditStaff from '@/features/calendar/components/EditStaff.vue';
import type { Staff, StaffUpdatePayload } from '@/types/calendar';

defineProps<{
  staff: Staff[];
}>();

const emit = defineEmits<{
  (e: 'update', value: StaffUpdatePayload): void;
}>();

const showModal = ref(false);

function openModal(): void {
  showModal.value = true;
}

function closeModal(): void {
  showModal.value = false;
}

function emitStaffUpdate(payload: StaffUpdatePayload): void {
  emit('update', payload);
  closeModal();
}
</script>

<style lang="scss" scoped>
.manage-staff {
  display: inline-flex;
}

.manage-staff-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--white);
  border-radius: 8px;
  padding: 4px 14px;
  background: transparent;
  color: var(--light-gray);
  font: inherit;
  font-size: 14px;
  line-height: 1;
  text-shadow: inherit;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background-color: var(--ocean-lt-blue);
  }
}

.manage-staff-modal {
  width: min(560px, calc(100vw - 24px));
  max-width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--layout-radius-md);
  padding: 16px;
  background-color: var(--layout-panel-bg);
  color: var(--white);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  text-shadow: none;
}

.manage-staff-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;

  h2 {
    margin: 0;
    font:
      600 1rem/1.2 Arial,
      sans-serif;
    color: var(--white);
  }
}

.manage-staff-modal__close {
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 999px;
  padding: 4px 10px;
  background: transparent;
  color: var(--white);
  font:
    600 0.75rem/1 Arial,
    sans-serif;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

@media (max-width: 640px) {
  .manage-staff-button {
    padding: 3px 10px;
    font-size: 12px;
  }

  .manage-staff-modal {
    padding: 12px;
  }

  .manage-staff-modal__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
