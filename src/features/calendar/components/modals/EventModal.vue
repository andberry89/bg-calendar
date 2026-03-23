<template>
  <div :class="['event-modal', day < 4 ? 'right' : 'left']" v-click-outside="closeModal">
    <div class="close-btn" @click="closeModal">X</div>
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
      <span @click="deleteEvent">Delete Event &#x2718;</span>
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
  width: min(275px, calc(100vw - 24px));
  max-width: calc(100vw - 24px);
  box-sizing: border-box;
  text-align: left;
  background-color: var(--light-gray);
  color: var(--black);
  padding: 12px 10px 8px;
  border: 1px solid var(--black);
  border-radius: 8px;
  font:
    400 0.9rem/1.2 'Arial',
    sans-serif;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.28);

  div {
    margin: 5px 0;
  }

  .close-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 2px 7px;
    border-radius: 999px;
    border: 1px solid var(--black);
    background-color: var(--ocean-event-detail);
    transition: 0.2s;
    line-height: 1;

    &:hover {
      background-color: var(--white);
      border-color: var(--black);
      color: var(--black);
      cursor: pointer;
    }
  }

  .event-header {
    padding-right: 34px;

    .event-name {
      font-weight: 700;
      font-size: 1rem;
      border-bottom: 1px solid var(--black);

      .event-type {
        font-weight: 400;
      }
    }

    .event-staff {
      p {
        margin: 0;
      }
    }
  }

  .event-options {
    margin-top: 20px;
    padding-top: 5px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    font-size: 0.8rem;

    span {
      display: inline-block;
      transition: 0.2s;

      &:hover {
        color: var(--ocean-event-detail);
        cursor: pointer;
      }
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
    top: -6px;
    width: min(240px, calc(100vw - 16px));
    max-width: calc(100vw - 16px);
    padding: 10px 8px 8px;
    font-size: 0.8rem;

    .close-btn {
      top: 5px;
      right: 5px;
      padding: 2px 6px;
    }

    .event-header {
      padding-right: 30px;

      .event-name {
        font-size: 0.9rem;
      }
    }

    .event-options {
      margin-top: 14px;
      font-size: 0.74rem;
    }
  }

  .left {
    right: 4px;
  }

  .right {
    left: 4px;
  }
}
</style>
