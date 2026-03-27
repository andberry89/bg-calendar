<template>
  <div class="edit-staff">
    <div class="edit-staff__actions">
      <button
        type="button"
        class="staff-button"
        :class="{ active: showForm.add }"
        @click="toggleEditStaffForm('add')"
      >
        Add Staff
      </button>
      <button
        type="button"
        class="staff-button"
        :class="{ active: showForm.remove }"
        @click="toggleEditStaffForm('remove')"
      >
        Remove Staff
      </button>
    </div>

    <div v-if="showForm.add" class="edit-staff__panel">
      <div class="add-staff-form">
        <input
          id="newFirstName"
          ref="firstNameInput"
          v-model.trim="newStaff.firstName"
          type="text"
          name="newFirstName"
          placeholder="First Name"
        />
        <input
          id="newLastName"
          v-model.trim="newStaff.lastName"
          type="text"
          name="newLastName"
          placeholder="Last Name"
        />
        <button
          type="button"
          class="staff-button staff-button--primary"
          :disabled="!canAddStaff"
          @click="emitStaff('add')"
        >
          Add {{ pendingStaffLabel }}
        </button>
      </div>
    </div>

    <div v-if="showForm.remove" class="edit-staff__panel">
      <div class="remove-staff-form">
        <button
          v-for="(person, idx) in staff"
          :key="'staff-' + idx"
          type="button"
          class="remove-staff-card"
          @click="emitStaff(person)"
        >
          <span class="remove-staff-name">{{ person.firstName }} {{ person.lastName }}</span>
          <span class="remove-text">Remove</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import type { NewStaffInput, Staff, StaffUpdatePayload } from '@/types/calendar';

defineProps<{
  staff: Staff[];
}>();

const emit = defineEmits<{
  (e: 'update', value: StaffUpdatePayload): void;
}>();

const firstNameInput = ref<HTMLInputElement | null>(null);

const newStaff = ref<NewStaffInput>({
  firstName: '',
  lastName: ''
});

const showForm = ref<{
  add: boolean;
  remove: boolean;
}>({
  add: false,
  remove: false
});

const canAddStaff = computed((): boolean => {
  return newStaff.value.firstName.trim().length > 0 && newStaff.value.lastName.trim().length > 0;
});

const pendingStaffLabel = computed((): string => {
  const firstName = newStaff.value.firstName.trim();
  const lastName = newStaff.value.lastName.trim();

  if (firstName.length === 0 && lastName.length === 0) {
    return 'Staff Member';
  }

  return `${firstName} ${lastName}`.trim();
});

function emitStaff(payload: 'add' | Staff): void {
  if (payload === 'add') {
    if (!canAddStaff.value) {
      return;
    }

    emit('update', [
      'add',
      {
        firstName: newStaff.value.firstName.trim(),
        lastName: newStaff.value.lastName.trim()
      }
    ]);
  } else {
    emit('update', ['remove', payload]);
  }

  newStaff.value.firstName = '';
  newStaff.value.lastName = '';
  showForm.value.add = false;
  showForm.value.remove = false;
}

function toggleEditStaffForm(form: 'add' | 'remove'): void {
  if (form === 'add') {
    showForm.value.remove = false;
    showForm.value.add = !showForm.value.add;

    if (showForm.value.add) {
      nextTick(() => {
        firstNameInput.value?.focus();
      });
    }
  } else {
    showForm.value.add = false;
    showForm.value.remove = !showForm.value.remove;
  }
}
</script>

<style lang="scss" scoped>
.edit-staff {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  padding-top: 8px;
  color: var(--calendar-text);
  text-shadow: none;
}

.edit-staff__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.edit-staff__panel {
  width: 100%;
  padding: 14px;
  box-sizing: border-box;
  border: 1px solid rgba(148, 163, 184, 0.26);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(248, 250, 252, 0.92) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 10px 24px rgba(15, 23, 42, 0.05);
}

.staff-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 8px 14px;
  border: 1px solid rgba(148, 163, 184, 0.42);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.92) 100%);
  color: #0f172a;
  font:
    600 0.8rem/1 Arial,
    sans-serif;
  box-shadow:
    0 6px 14px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.74);
  cursor: pointer;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease,
    color 0.16s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: rgba(37, 99, 235, 0.34);
    background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(239, 246, 255, 0.96) 100%);
    box-shadow:
      0 10px 18px rgba(15, 23, 42, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.82);
  }

  &:disabled {
    border-color: rgba(148, 163, 184, 0.24);
    background: linear-gradient(
      180deg,
      rgba(248, 250, 252, 0.9) 0%,
      rgba(241, 245, 249, 0.82) 100%
    );
    color: rgba(100, 116, 139, 0.68);
    box-shadow: none;
    cursor: not-allowed;
  }

  &.active {
    border-color: rgba(37, 99, 235, 0.34);
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.94) 0%, rgba(45, 212, 191, 0.82) 100%);
    color: #f8fafc;
    box-shadow:
      0 12px 22px rgba(37, 99, 235, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }
}

.staff-button--primary {
  border-color: rgba(37, 99, 235, 0.3);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.94) 0%, rgba(45, 212, 191, 0.82) 100%);
  color: #f8fafc;
  box-shadow:
    0 12px 22px rgba(37, 99, 235, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);

  &:hover:not(:disabled) {
    border-color: rgba(29, 78, 216, 0.44);
    background: linear-gradient(135deg, rgba(29, 78, 216, 0.98) 0%, rgba(20, 184, 166, 0.88) 100%);
    box-shadow:
      0 14px 26px rgba(37, 99, 235, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.22);
  }
}

.add-staff-form {
  display: grid;
  gap: 10px;

  input {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 1px solid rgba(148, 163, 184, 0.5);
    border-radius: 10px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(248, 250, 252, 0.96) 100%
    );
    color: #0f172a;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.74),
      0 1px 2px rgba(15, 23, 42, 0.04);
    font:
      400 0.9rem/1.2 Arial,
      sans-serif;

    &::placeholder {
      color: rgba(71, 85, 105, 0.72);
    }

    &:focus {
      outline: none;
      border-color: rgba(37, 99, 235, 0.4);
      box-shadow:
        0 0 0 3px rgba(37, 99, 235, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.82);
    }
  }
}

.remove-staff-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.remove-staff-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
  color: #0f172a;
  text-align: left;
  box-shadow:
    0 8px 18px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
  font:
    400 0.88rem/1.2 Arial,
    sans-serif;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease,
    box-shadow 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(220, 38, 38, 0.28);
    background: linear-gradient(
      180deg,
      rgba(254, 242, 242, 0.98) 0%,
      rgba(254, 226, 226, 0.9) 100%
    );
    box-shadow:
      0 12px 20px rgba(220, 38, 38, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.82);
  }
}

.remove-staff-name {
  font-weight: 600;
}

.remove-text {
  flex: 0 0 auto;
  color: rgba(185, 28, 28, 0.82);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 640px) {
  .edit-staff {
    gap: 12px;
    padding-top: 4px;
  }

  .edit-staff__actions {
    gap: 6px;
  }

  .edit-staff__panel {
    padding: 12px;
  }

  .staff-button {
    min-height: 34px;
    padding: 7px 12px;
    font-size: 0.74rem;
  }

  .add-staff-form input,
  .remove-staff-card {
    font-size: 0.82rem;
  }

  .remove-text {
    font-size: 0.68rem;
  }
}
</style>
