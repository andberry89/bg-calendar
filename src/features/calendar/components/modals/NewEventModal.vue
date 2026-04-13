<template>
  <div class="new-event-container">
    <Button @click="openForm">New Event</Button>

    <BaseModal v-if="showForm" @update="closeForm" @close="closeForm">
      <div class="event-form-modal modal-panel">
        <div class="modal-panel__header">
          <h3 class="modal-panel__title">New Event</h3>
          <button class="modal-panel__close" type="button" @click="closeForm">
            ×
          </button>
        </div>

        <EventForm
          v-model="newEvent"
          :staff="staff"
          submit-label="Add Event"
          @submit="handleSubmit"
          @cancel="closeForm"
        />
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/Button.vue';
import BaseModal from '@/components/BaseModal.vue';
import EventForm from '@/features/calendar/components/forms/EventForm.vue';
import type { DraftCalendarEventInput } from '@/features/calendar/utils';
import type { NewCalendarEvent, Staff } from '@/types/calendar';

const { staff } = defineProps<{
  staff: Staff[];
}>();

const emit = defineEmits<{
  (e: 'update', value: NewCalendarEvent): void;
}>();

const createEmptyEvent = (): DraftCalendarEventInput => ({
  closed: '',
  details: '',
  end: '',
  type: '',
  start: '',
  staff: []
});

const showForm = ref(false);
const newEvent = ref<DraftCalendarEventInput>(createEmptyEvent());

function handleSubmit(event: NewCalendarEvent): void {
  emit('update', event);
  closeForm();
}

function resetNewEvent(): void {
  newEvent.value = createEmptyEvent();
}

function openForm(): void {
  // Always start from a fresh draft when opening the create modal.
  resetNewEvent();
  showForm.value = true;
}

function closeForm(): void {
  // Clear the draft on close so canceled event data does not reappear later.
  resetNewEvent();
  showForm.value = false;
}
</script>
<style lang="scss" scoped>
.new-event-container {
  display: inline-flex;
  width: auto;
  max-width: max-content;
  font:
    400 1rem/1 'Arial',
    sans-serif;
  color: var(--black);
  text-shadow: none;
}

.event-form-modal {
  width: min(560px, calc(100vw - 24px));
  max-width: 560px;
  padding: 18px;
}

@media (max-width: 640px) {
  .event-form-modal {
    padding: 14px;
  }
}
</style>
