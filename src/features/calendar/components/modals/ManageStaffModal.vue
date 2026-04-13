<template>
  <div class="manage-staff">
    <button type="button" class="manage-staff-button" @click="openModal">Manage Staff</button>

    <BaseModal v-if="showModal" @update="closeModal" @close="closeModal">
      <section class="manage-staff-modal modal-panel">
        <header class="modal-panel__header">
          <h2 class="modal-panel__title manage-staff-modal__title">Manage Staff</h2>
          <button type="button" class="modal-panel__close manage-staff-modal__close" @click="closeModal">
            Close
          </button>
        </header>

        <EditStaff :staff="staff" @update="emitStaffUpdate" />
      </section>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import EditStaff from '@/features/calendar/components/staff/EditStaff.vue';
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
  // Close after a successful staff action so the header stays the single entry point.
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
  min-height: 34px;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.44);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  font: inherit;
  font-size: 14px;
  line-height: 1;
  text-shadow: inherit;
  white-space: nowrap;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 8px 18px rgba(15, 23, 42, 0.14);
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    transform 0.16s ease,
    box-shadow 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.62);
    background: rgba(255, 255, 255, 0.16);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 12px 22px rgba(15, 23, 42, 0.18);
  }
}

.manage-staff-modal {
  width: min(560px, calc(100vw - 24px));
  max-width: 100%;
  padding: 18px;
  text-shadow: none;
}

.manage-staff-modal__title {
  font:
    700 1.1rem/1.2 Arial,
    sans-serif;
}

.manage-staff-modal__close {
  padding: 0 12px;
  font:
    600 0.8rem/1 Arial,
    sans-serif;
}

@media (max-width: 640px) {
  .manage-staff-button {
    min-height: 32px;
    padding: 5px 12px;
    font-size: 12px;
  }

  .manage-staff-modal {
    padding: 14px;
  }

  .manage-staff-modal__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
