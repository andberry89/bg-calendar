<template>
  <div :class="['event-modal', day < 4 ? 'right' : 'left']" v-click-outside="closeModal">
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
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import type { CalendarEvent } from '@/types/calendar';

const { day, event } = defineProps<{
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
  position: absolute;
  top: -12px;
  z-index: 99;
  width: 275px;
  max-width: calc(100vw - 24px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  background-color: var(--light-gray);
  color: var(--black);
  padding: 12px 10px 8px;
  border: 1px solid var(--black);
  border-radius: 8px;
  font:
    400 0.95rem/1.35 'Arial',
    sans-serif;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.28);
  min-height: 140px;

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
    border-radius: 999px;
    border: 1px solid var(--black);
    background-color: var(--ocean-event-detail);
    color: var(--black);
    transition: 0.2s;
    line-height: 1;
    font: inherit;
    cursor: pointer;

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
      font-weight: 700;
      font-size: 1.05rem;
      border-bottom: 1px solid var(--black);

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
    padding-top: 10px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
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
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      color: var(--ocean-event-detail);
      border-color: var(--ocean-event-detail);
    }
  }
}

.left {
  right: 12px;
}

.right {
  left: 12px;
}

@media (max-width: 640px) {
  .event-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    right: auto;
    width: min(320px, calc(100vw - 16px));
    max-width: calc(100vw - 16px);
    max-height: min(420px, calc(100vh - 24px));
    padding: 12px 10px 10px;
    font-size: 0.85rem;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    transform: translate(-50%, -50%);
    margin: 0;
    box-sizing: border-box;
    scrollbar-gutter: stable;
  }

  .left,
  .right {
    left: 50%;
    right: auto;
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
