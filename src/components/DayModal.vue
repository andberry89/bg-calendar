<template>
  <ModalOverlay @update="closeDayModal">
    <div class="day-modal">
      <div class="day-modal__header">
        <h3 class="day-modal__title">{{ title }}</h3>
        <button class="day-modal__close" type="button" @click="closeDayModal">×</button>
      </div>

      <div v-if="events.length > 0" class="day-modal__events">
        <button
          v-for="(calendarEvent, idx) in events"
          :key="`${calendarEvent.id}-${idx}`"
          class="day-modal__event"
          type="button"
          @click="openEventModal(calendarEvent)"
        >
          <span class="day-modal__event-type">
            {{ getEventLabel(calendarEvent) }}
          </span>
          <span class="day-modal__event-dates">
            {{ getEventDates(calendarEvent) }}
          </span>
        </button>
      </div>

      <p v-else class="day-modal__empty">No events for this day.</p>

      <EventModal
        v-if="showEventDetails"
        :event="modalEvent!"
        :day="day"
        @update="closeEventModal"
        @delete="deleteEvent"
      />
    </div>
  </ModalOverlay>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { format } from 'date-fns';
import ModalOverlay from '@/components/common/ModalOverlay.vue';
import EventModal from './EventModal.vue';
import type { CalendarEvent, CurrentDate } from '@/types/calendar';

const props = defineProps<{
  currentDate: CurrentDate;
  date: number;
  day: number;
  events: CalendarEvent[];
}>();

const emit = defineEmits<{
  (e: 'update'): void;
  (e: 'delete', value: CalendarEvent): void;
}>();

const showEventDetails = ref(false);
const modalEvent = ref<CalendarEvent | null>(null);

const title = computed((): string => {
  return format(
    new Date(props.currentDate.year, props.currentDate.month, props.date),
    'MMMM d, yyyy'
  );
});

function closeDayModal(): void {
  modalEvent.value = null;
  showEventDetails.value = false;
  emit('update');
}

function closeEventModal(): void {
  modalEvent.value = null;
  showEventDetails.value = false;
}

function openEventModal(event: CalendarEvent): void {
  modalEvent.value = event;
  showEventDetails.value = true;
}

function deleteEvent(event: CalendarEvent): void {
  emit('delete', event);
  closeDayModal();
}

function getEventDates(event: CalendarEvent): string {
  const start = format(new Date(event.start.replace(/-/g, '/')), 'MM/dd/yyyy');

  if (event.start === event.end) {
    return start;
  }

  const end = format(new Date(event.end.replace(/-/g, '/')), 'MM/dd/yyyy');
  return `${start} - ${end}`;
}

function getEventLabel(event: CalendarEvent): string {
  if (event.class === 'birthday') {
    return `${event.staff[0].shortName}'s Birthday 🎂`;
  }

  if (event.class === 'press-trip') {
    return `${event.staff[0].initials} Press Trip`;
  }

  if (event.class === 'vacation') {
    return `${event.staff[0].initials} Off (PTO)`;
  }

  if (event.class === 'auto-show') {
    return `Auto Show: ${event.details}`;
  }

  if (event.class === 'cd-event') {
    return event.details;
  }

  if (event.class === 'holiday') {
    const closure =
      event.closed === 'full' ? 'Office Closed' : event.closed === 'half' ? 'Early Close' : '';

    return closure ? `${event.details} — ${closure}` : event.details;
  }

  return event.type;
}
</script>

<style lang="scss" scoped>
.day-modal {
  position: relative;
  width: min(560px, 100%);
  background-color: var(--light-gray);
  color: var(--black);
  border-radius: 12px;
  padding: 16px;
  font:
    400 0.95rem/1.3 'Arial',
    sans-serif;
  box-sizing: border-box;
}

.day-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.day-modal__title {
  margin: 0;
  font-size: 1.15rem;
}

.day-modal__close {
  border: 1px solid var(--black);
  background-color: var(--white);
  color: var(--black);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 1rem;
  cursor: pointer;
}

.day-modal__events {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.day-modal__event {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: 1px solid var(--ocean-slate-blue);
  border-radius: 8px;
  background-color: var(--white);
  color: var(--black);
  cursor: pointer;
}

.day-modal__event-type {
  font-weight: 700;
}

.day-modal__event-dates {
  font-size: 0.85rem;
  color: var(--dark-gray);
}

.day-modal__empty {
  margin: 0;
}

@media (max-width: 640px) {
  .day-modal {
    padding: 12px;
  }

  .day-modal__event {
    padding: 8px 10px;
  }
}
</style>
