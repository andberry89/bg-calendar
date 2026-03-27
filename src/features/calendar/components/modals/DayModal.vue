<template>
  <BaseModal @update="closeDayModal" @close="closeDayModal">
    <div class="day-modal">
      <div class="day-modal__header">
        <h3 class="day-modal__title">{{ title }}</h3>
        <button class="day-modal__close" type="button" @click="closeDayModal">×</button>
      </div>

      <div v-if="events.length > 0" class="day-modal__content">
        <div class="day-modal__events">
          <button
            v-for="(calendarEvent, idx) in events"
            :key="`${calendarEvent.id}-${idx}`"
            class="day-modal__event"
            type="button"
            @click="selectEvent(calendarEvent)"
          >
            <span class="day-modal__event-type">
              {{ getEventLabel(calendarEvent) }}
            </span>
            <span class="day-modal__event-dates">
              {{ getEventDates(calendarEvent) }}
            </span>
          </button>
        </div>

        <div v-if="selectedEvent" class="day-modal__details">
          <div class="day-modal__details-header">
            <h4 class="day-modal__details-title">
              {{ selectedEvent.class === 'cd-event' ? selectedEvent.details : selectedEvent.type }}
              {{ selectedEvent.class === 'birthday' ? '🎂' : '' }}
            </h4>
            <button class="day-modal__details-close" type="button" @click="clearSelectedEvent">
              ×
            </button>
          </div>

          <div class="day-modal__details-dates">
            {{ getEventDates(selectedEvent) }}
          </div>

          <div v-if="selectedEvent.staff.length > 0" class="day-modal__details-staff">
            <p v-for="person in selectedEvent.staff" :key="person.lastName">
              {{ person.shortName }}
            </p>
          </div>

          <div class="day-modal__details-actions">
            <button class="day-modal__delete" type="button" @click="deleteEvent(selectedEvent)">
              Delete Event ✘
            </button>
          </div>
        </div>
        <div v-else class="day-modal__details day-modal__details--empty">
          <p>Click an event to view full details</p>
        </div>
      </div>

      <p v-else class="day-modal__empty">No events for this day.</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { format } from 'date-fns';
import BaseModal from '@/components/BaseModal.vue';
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

const selectedEvent = ref<CalendarEvent | null>(null);

const title = computed((): string => {
  return format(
    new Date(props.currentDate.year, props.currentDate.month, props.date),
    'MMMM d, yyyy'
  );
});

function closeDayModal(): void {
  selectedEvent.value = null;
  emit('update');
}

function selectEvent(event: CalendarEvent): void {
  selectedEvent.value = event;
}

function clearSelectedEvent(): void {
  selectedEvent.value = null;
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

  if (event.class === 'sick-time') {
    return `${event.staff[0].initials} Sick Time`;
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
  width: min(560px, calc(100vw - 24px));
  max-width: 560px;
  padding: 18px;
  box-sizing: border-box;
  background: transparent;
  color: var(--calendar-text);
  font:
    400 0.95rem/1.3 'Arial',
    sans-serif;
}

.day-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -2px -2px 14px;
  padding: 0 0 12px;
}

.day-modal__title {
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.day-modal__close {
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

.day-modal__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 14px;
  align-items: start;
  width: 100%;
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
  padding: 10px 12px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
  color: #0f172a;
  text-align: left;
  box-shadow:
    0 8px 18px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
  cursor: pointer;
  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease,
    box-shadow 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(37, 99, 235, 0.28);
    background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(239, 246, 255, 0.96) 100%);
    box-shadow:
      0 12px 22px rgba(15, 23, 42, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.82);
  }
}

.day-modal__event-type {
  font-weight: 700;
}

.day-modal__event-dates {
  font-size: 0.85rem;
  color: var(--calendar-text-muted);
}

.day-modal__details {
  padding: 12px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
  box-shadow:
    0 8px 18px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

.day-modal__details--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--calendar-text-muted);
  opacity: 0.7;
  font-size: 0.9rem;
  min-height: 120px;
  border-style: dashed;
}

.day-modal__details-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.day-modal__details-title {
  margin: 0;
  font-size: 1rem;
  color: #0f172a;
}

.day-modal__details-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
  padding: 0;
  border: 1px solid rgba(51, 65, 85, 0.22);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.92) 100%);
  color: #0f172a;
  cursor: pointer;
}

.day-modal__details-dates {
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: var(--calendar-text-muted);
}

.day-modal__details-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.day-modal__delete {
  border: 0;
  background: transparent;
  color: #dc2626;
  font-weight: 600;
  cursor: pointer;
}

.day-modal__empty {
  margin: 0;
  color: var(--calendar-text-muted);
}

@media (max-width: 640px) {
  .day-modal {
    padding: 14px;
  }

  .day-modal__content {
    grid-template-columns: 1fr;
  }

  .day-modal__event {
    padding: 9px 10px;
  }
}
</style>
