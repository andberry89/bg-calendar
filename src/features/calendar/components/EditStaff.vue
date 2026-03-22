<template>
  <div class="edit-staff-container">
    <button class="staff-button" @click="toggleEditStaffForm('add')">Add Staff</button>
    <button class="staff-button" @click="toggleEditStaffForm('remove')">Remove Staff</button>
    <div class="edit-staff-form">
      <div class="add-staff-form" v-if="showForm.add">
        <input
          type="text"
          placeholder="First Name"
          v-model="newStaff.firstName"
          name="newFirstName"
          id="newFirstName"
          ref="firstNameInput"
        />
        <input
          type="text"
          placeholder="Last Name"
          v-model="newStaff.lastName"
          name="newLastName"
          id="newLastName"
        />
        <button class="staff-button" @click="emitStaff('add')">
          Add {{ newStaff.firstName + ' ' + newStaff.lastName }}
        </button>
      </div>
      <div class="remove-staff-form" v-if="showForm.remove">
        <div
          v-for="(person, idx) in staff"
          :key="'staff-' + idx"
          class="remove-staff-card"
          @click="emitStaff(person)"
        >
          <div class="remove-staff-name">{{ person.firstName + ' ' + person.lastName }}</div>
          <div class="remove-text">Remove?</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, nextTick } from 'vue';
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

function emitStaff(payload: 'add' | Staff): void {
  if (payload === 'add') {
    emit('update', ['add', newStaff.value]);
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
.edit-staff-container {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  gap: 5px;

  .staff-button {
    font:
      400 14px/1.2 'Public Sans',
      sans-serif;
    background-color: #c4a1ff;
    margin: 0 2px;
    padding: 5px 8px;
    transition: all 0.3s;

    &:hover {
      color: var(--ocean-gray);
      background-color: #a388ee;
      cursor: pointer;
    }
  }

  .edit-staff-form {
    margin-top: 15px;

    .add-staff-form {
      display: flex;
      flex-flow: column nowrap;
      gap: 3px;
    }

    .remove-staff-form {
      display: flex;
      flex-flow: column nowrap;
      gap: 5px;

      .remove-staff-card {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(var(--ocean-red) 0 0) var(--p, 0) / var(--p, 0) no-repeat;
        transition:
          0.5s,
          background-position 0s;
        padding: 3px;
        font:
          400 14px/1.2 'Arial',
          sans-serif;

        &:hover {
          cursor: pointer;
          --p: 100%;
          background-position: right;
          color: var(--white);
        }

        .remove-text {
          font-size: 12px;
          color: var(--white);
        }
      }
    }
  }
}
</style>
