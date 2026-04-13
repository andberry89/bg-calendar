<template>
  <BaseModal @update="cancelModal" @close="cancelModal">
    <div class="event-form-modal modal-panel">
      <div class="modal-panel__header">
        <h3 class="modal-panel__title">Edit Event</h3>
        <button class="modal-panel__close" type="button" @click="cancelModal">
          ×
        </button>
      </div>

      <EventForm
        v-model="editableEvent"
        :staff="staffStore.staff"
        submit-label="Save Changes"
        @submit="handleSubmit"
        @cancel="cancelModal"
      />
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import EventForm from '@/features/calendar/components/forms/EventForm.vue';
import type { DraftCalendarEventInput } from '@/features/calendar/utils';
import type { CalendarEvent, NewCalendarEvent } from '@/types/calendar';
import { useEventsStore } from '@/stores/events';
import { useStaffStore } from '@/stores/staff';

const { event } = defineProps<{
  event: CalendarEvent;
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'saved'): void;
}>();

const eventsStore = useEventsStore();
const staffStore = useStaffStore();

const editableEvent = ref<DraftCalendarEventInput>({
  // Start from a draft copy so edits stay local until save succeeds.
  closed: event.closed,
  details: event.details,
  end: event.end,
  type: event.type,
  start: event.start,
  staff: [...event.staff]
});

async function handleSubmit(updatedEvent: NewCalendarEvent): Promise<void> {
  const result = await eventsStore.updateEvent(event.id, {
    class: updatedEvent.class,
    closed: updatedEvent.closed,
    details: updatedEvent.details,
    end: updatedEvent.end,
    type: updatedEvent.type,
    start: updatedEvent.start,
    staff: [...updatedEvent.staff]
  });

  if (!result.success) {
    return;
  }

  emit('saved');
}

function cancelModal(): void {
  emit('cancel');
}
</script>

<style lang="scss" scoped>
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
