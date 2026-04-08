<template>
  <BaseModal @update="cancelModal" @close="cancelModal">
    <div class="edit-event-modal">
      <div class="edit-event-modal__header">
        <h3 class="edit-event-modal__title">Edit Event</h3>
        <button class="edit-event-modal__close" type="button" @click="cancelModal">×</button>
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
.edit-event-modal {
  position: relative;
  width: min(560px, calc(100vw - 24px));
  max-width: 560px;
  box-sizing: border-box;
  padding: 18px;
  color: var(--calendar-text);
  background: transparent;
}

.edit-event-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -2px -2px 14px;
  padding: 0 0 12px;
}

.edit-event-modal__title {
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.edit-event-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  min-height: 34px;
  padding: 0;
  border: 1px solid rgba(51, 65, 85, 0.22);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.92) 100%);
  color: #0f172a;
  font-size: 1rem;
  line-height: 1;
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
  .edit-event-modal {
    padding: 14px;
  }

  .edit-event-modal__header {
    margin-bottom: 12px;
    padding-bottom: 10px;
  }
}
</style>
