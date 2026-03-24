<template>
  <div class="event-container" @click.stop="emitEvent">
    <div :class="event.class">
      <template v-if="event.class === 'holiday'">
        <strong>{{ primaryText }}</strong
        ><br />
        <span v-if="secondaryText" class="office-closure">{{ secondaryText }}</span>
      </template>

      <template v-else-if="event.class === 'auto-show'">
        <strong>{{ primaryText }}</strong
        ><br />
        {{ secondaryText }}
      </template>

      <template v-else>
        {{ primaryText }}
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CalendarEvent } from '@/types/calendar';

const { event } = defineProps<{
  event: CalendarEvent;
}>();

const emit = defineEmits<{
  (e: 'update', value: CalendarEvent): void;
}>();

const primaryText = computed((): string => {
  switch (event.class) {
    case 'birthday':
      return `${event.staff[0].firstName}'s Birthday! 🎂`;
    case 'press-trip':
      return `${event.staff[0].initials} Press Trip`;
    case 'vacation':
      return `${event.staff[0].initials} Off (PTO)`;
    case 'sick-time':
      return `${event.staff[0].initials} Sick Time`;
    case 'auto-show':
      return 'Auto Show';
    case 'cd-event':
      return event.details;
    case 'comp-day':
      return `${event.staff[0].initials} Comp Day`;
    case 'holiday':
      return event.details;
    default:
      return '';
  }
});

const secondaryText = computed((): string => {
  switch (event.class) {
    case 'auto-show':
      return event.details;
    case 'holiday':
      if (event.closed === 'half') {
        return 'Early Close';
      }

      if (event.closed === 'full') {
        return 'Office Closed';
      }

      return '';
    default:
      return '';
  }
});

function emitEvent(): void {
  emit('update', event);
}
</script>

<style lang="scss" scoped>
.event-container {
  width: 100%;
}

.event-container div {
  font:
    400 0.75rem/1.15 'Roboto',
    'Verdana',
    sans-serif;
  text-align: center;
  padding: 4px 6px;
  margin: 2px 0;
  border-radius: 8px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  transition:
    transform 0.2s,
    opacity 0.2s;
  word-break: break-word;

  &:hover {
    transform: scale(1.02);
    cursor: pointer;
  }
}

.auto-show {
  background-color: var(--ocean-auto-show);
}

.birthday {
  background-color: var(--ocean-birthday);
}

.cd-event {
  background-color: var(--ocean-cd-event);
}

.comp-day {
  background-color: var(--ocean-comp-day);
}

.holiday {
  width: 100%;
  color: var(--white);

  &:hover {
    transform: none;
    cursor: default;
  }
}

.vacation {
  background-color: var(--ocean-off);
  opacity: 0.7;
}

.sick-time {
  background-color: var(--ocean-yellow);
}

.press-trip {
  background-color: var(--ocean-press-trip);
}

@media (max-width: 900px) {
  .event-container div {
    font-size: 0.68rem;
    padding: 3px 4px;
    border-radius: 6px;
  }
}

@media (max-width: 640px) {
  .event-container div {
    font-size: 0.62rem;
    line-height: 1.05;
    padding: 2px 3px;
    margin: 1px 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
