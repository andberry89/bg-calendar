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

const props = defineProps<{
  day: number;
  event: CalendarEvent;
}>();

const emit = defineEmits<{
  (e: 'update'): void;
  (e: 'delete', value: CalendarEvent): void;
}>();

const eventDates = computed((): string => {
  const startDate = new Date(props.event.start.replace(/-/g, '/'));
  const start = format(startDate, 'MM/dd/yyyy');

  if (props.event.start === props.event.end) {
    return start;
  }

  const endDate = new Date(props.event.end.replace(/-/g, '/'));
  const end = format(endDate, 'MM/dd/yyyy');

  return start + ' - ' + end;
});

function closeModal(): void {
  emit('update');
}

function deleteEvent(): void {
  emit('delete', props.event);
}
</script>
<style lang="scss" scoped>
.event-modal {
  position: absolute;
  text-align: left;
  width: 275px;
  top: -25px;
  z-index: 99;
  background-color: var(--light-gray);
  color: var(--black);
  padding: 12px 8px 4px;
  border: 1px solid var(--black);
  border-radius: 8px;
  font:
    400 0.9rem/1 'Arial',
    sans-serif;

  div {
    margin: 5px 0;
  }

  .close-btn {
    position: absolute;
    padding: 3px 6px;
    border-radius: 10px;
    border: 1px solid var(--black);
    background-color: var(--ocean-event-detail);
    transition: 0.2s;
    top: -15px;
    left: -12px;

    &:hover {
      background-color: var(--white);
      border-color: var(--black);
      color: var(--black);
      cursor: pointer;
    }
  }

  .event-header {
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
    margin-top: 35px;
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
  right: 25%;
}
.right {
  left: 25%;
}
</style>
