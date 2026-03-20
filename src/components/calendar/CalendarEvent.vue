<template>
  <div class="event-container" @click="emitEvent">
    <div v-if="event.class === 'birthday'" :class="event.class">
      {{ event.staff[0].shortName }}'s Birthday! 🎂
    </div>
    <div v-if="event.class === 'press-trip'" :class="event.class">
      {{ event.staff[0].initials }} Press Trip
    </div>
    <div v-if="event.class === 'vacation'" :class="event.class">
      {{ event.staff[0].initials }} Off (PTO)
    </div>
    <div v-if="event.class === 'auto-show'" :class="event.class">
      <strong>Auto Show</strong><br />
      {{ event.details }}
    </div>
    <div v-if="event.class === 'cd-event'" :class="event.class">
      {{ event.details }}
    </div>
    <div v-if="event.class === 'holiday'" :class="event.class">
      <strong>{{ event.details }}</strong
      ><br />
      <span class="office-closure" v-if="event.closed === 'half'">Early Close</span>
      <span class="office-closure" v-if="event.closed === 'full'">Office Closed</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CalendarEvent } from '@/types/calendar';

const { event } = defineProps<{
  event: CalendarEvent;
}>();

const emit = defineEmits<{
  (e: 'update', value: CalendarEvent): void;
}>();

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
