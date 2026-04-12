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
  box-sizing: border-box;
  background: transparent;
  color: var(--calendar-text);
  text-shadow: none;
}

.manage-staff-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -2px -2px 14px;
  padding: 0 0 12px;

  h2 {
    margin: 0;
    color: #0f172a;
    font:
      700 1.1rem/1.2 Arial,
      sans-serif;
    letter-spacing: 0.01em;
  }
}

.manage-staff-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(51, 65, 85, 0.22);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.92) 100%);
  color: #0f172a;
  font:
    600 0.8rem/1 Arial,
    sans-serif;
  box-shadow:
    0 6px 14px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(37, 99, 235, 0.3);
    background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(239, 246, 255, 0.96) 100%);
    box-shadow:
      0 10px 20px rgba(15, 23, 42, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.82);
  }
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
    margin-bottom: 12px;
    padding-bottom: 10px;
  }
}
</style>
