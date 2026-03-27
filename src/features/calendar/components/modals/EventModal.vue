<template>
  <BaseModal @update="closeModal" @close="closeModal">
    <div class="event-modal">
      <button class="close-btn" type="button" aria-label="Close event details" @click="closeModal">
        ×
      </button>

      <div class="event-header">
        <div class="event-name">
          <span class="event-type"
            >{{ event.class === 'cd-event' ? event.details : event.type }}
            {{ event.class === 'birthday' ? '🎂' : '' }}</span
          >
        </div>

        <div class="event-dates">
          {{ eventDates }}
        </div>

        <div class="event-staff" v-if="event.staff.length > 0">
          <p v-for="person in event.staff" :key="person.lastName">
            {{ person.shortName }}
          </p>
        </div>
      </div>

      <div class="event-options">
        <button class="delete-btn" type="button" @click="deleteEvent">Delete Event ✘</button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import BaseModal from '@/components/BaseModal.vue';
import type { CalendarEvent } from '@/types/calendar';

const { event } = defineProps<{
  day: number;
  event: CalendarEvent;
}>();

const emit = defineEmits<{
  (e: 'update'): void;
  (e: 'delete', value: CalendarEvent): void;
}>();

const eventDates = computed((): string => {
  const startDate = new Date(event.start.replace(/-/g, '/'));
  const start = format(startDate, 'MM/dd/yyyy');

  if (event.start === event.end) {
    return start;
  }

  const endDate = new Date(event.end.replace(/-/g, '/'));
  const end = format(endDate, 'MM/dd/yyyy');

  return start + ' - ' + end;
});

function closeModal(): void {
  emit('update');
}

function deleteEvent(): void {
  emit('delete', event);
}
</script>

<style lang="scss" scoped>
.event-modal {
  position: relative;
  width: min(275px, calc(100vw - 24px));
  max-width: calc(100vw - 24px);
  min-height: 140px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 10px 8px;
  border: 1px solid var(--black);
  border-radius: 8px;
  background-color: var(--light-gray);
  color: var(--black);
  text-align: left;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.28);
  font:
    400 0.95rem/1.35 'Arial',
    sans-serif;

  .close-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    min-height: 32px;
    padding: 0;
    border: 1px solid var(--black);
    border-radius: 999px;
    background-color: var(--ocean-event-detail);
    color: var(--black);
    line-height: 1;
    font: inherit;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      background-color: var(--white);
      border-color: var(--black);
      color: var(--black);
    }
  }

  .event-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 34px;

    .event-name {
      border-bottom: 1px solid var(--black);
      font-size: 1.05rem;
      font-weight: 700;

      .event-type {
        font-weight: 400;
      }
    }

    .event-staff {
      display: flex;
      flex-direction: column;
      gap: 4px;

      p {
        margin: 0;
      }
    }
  }

  .event-options {
    margin-top: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    padding-top: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    font-size: 0.8rem;
  }

  .delete-btn {
    min-height: 32px;
    padding: 6px 10px;
    border: 1px solid var(--black);
    border-radius: 8px;
    background-color: var(--white);
    color: var(--black);
    font: inherit;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      color: var(--ocean-event-detail);
      border-color: var(--ocean-event-detail);
    }
  }
}

@media (max-width: 640px) {
  .event-modal {
    width: min(320px, calc(100vw - 16px));
    max-width: calc(100vw - 16px);
    max-height: min(420px, calc(100vh - 24px));
    margin: 0;
    padding: 12px 10px 10px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    -webkit-overflow-scrolling: touch;
    font-size: 0.85rem;
  }

  .event-modal .close-btn {
    top: 6px;
    right: 6px;
    min-width: 36px;
    min-height: 36px;
  }

  .event-modal .delete-btn {
    min-height: 36px;
    padding: 8px 12px;
  }

  .event-modal .event-header {
    padding-right: 38px;

    .event-name {
      font-size: 1rem;
      line-height: 1.4;
    }
  }

  .event-modal .event-options {
    margin-top: 8px;
    font-size: 0.8rem;
  }
}
</style>
