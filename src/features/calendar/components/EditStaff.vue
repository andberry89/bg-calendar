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
  gap: 12px;
  width: 100%;
  text-shadow: none;
}

.edit-staff__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.edit-staff__panel {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--layout-radius-sm);
  background-color: rgba(255, 255, 255, 0.05);
  box-sizing: border-box;
}

.staff-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 999px;
  padding: 7px 12px;
  background: transparent;
  color: var(--white);
  font:
    600 0.78rem/1 Arial,
    sans-serif;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.12);
  }

  &:disabled {
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.45);
    cursor: not-allowed;
  }

  &.active {
    border-color: var(--white);
    background-color: rgba(255, 255, 255, 0.14);
  }
}

.staff-button--primary {
  background-color: rgba(255, 255, 255, 0.12);

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.add-staff-form {
  display: grid;
  gap: 8px;

  input {
    width: 100%;
    border: 1px solid rgba(255, 255, 255, 0.24);
    border-radius: 8px;
    padding: 10px 12px;
    background-color: rgba(0, 0, 0, 0.18);
    color: var(--white);
    font:
      400 0.85rem/1.2 Arial,
      sans-serif;
    box-sizing: border-box;

    &::placeholder {
      color: rgba(255, 255, 255, 0.58);
    }

    &:focus {
      outline: 1px solid rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 255, 255, 0.38);
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
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  padding: 10px 12px;
  background-color: rgba(255, 255, 255, 0.06);
  color: var(--white);
  font:
    400 0.85rem/1.2 Arial,
    sans-serif;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.26);
    background-color: rgba(190, 40, 40, 0.28);
    transform: translateY(-1px);
  }
}

.remove-staff-name {
  font-weight: 600;
}

.remove-text {
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

@media (max-width: 640px) {
  .edit-staff {
    gap: 10px;
  }

  .edit-staff__actions {
    gap: 6px;
  }

  .edit-staff__panel {
    padding: 10px;
  }

  .staff-button {
    padding: 6px 10px;
    font-size: 0.72rem;
  }

  .add-staff-form input,
  .remove-staff-card {
    font-size: 0.8rem;
  }

  .remove-text {
    font-size: 0.68rem;
  }
}
</style>
