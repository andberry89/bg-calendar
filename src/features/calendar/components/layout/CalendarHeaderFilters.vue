<template>
  <div class="filters">
    <div class="filters-row">
      <div class="staff-filters">
        <button
          v-for="member in staff"
          :key="member.id"
          type="button"
          class="staff-filter"
          :class="{ active: isStaffSelected(member.id) }"
          @click="toggleStaff(member.id)"
        >
          <span class="staff-avatar">
            <img :src="imgUrl(member.lastName)" :alt="member.shortName" />
          </span>
          <span class="staff-label">{{ member.shortName }}</span>
        </button>
      </div>

      <button type="button" class="reset-button" :disabled="!hasActiveFilters" @click="reset">
        Reset
      </button>
    </div>

    <div class="type-filters">
      <button
        v-for="type in eventTypes"
        :key="type"
        type="button"
        class="type-pill"
        :class="[getEventClass(type), { active: isTypeSelected(type) }]"
        @click="toggleType(type)"
      >
        {{ type }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { EventFilters } from '@/features/calendar/utils/filterEvents';
import type { EventClass, EventType, Staff } from '@/types/calendar';

const props = defineProps<{
  staff: Staff[];
  filters: EventFilters;
}>();

const emit = defineEmits<{
  (e: 'filters', value: EventFilters): void;
}>();

const eventTypes: EventType[] = [
  'Vacation',
  'Sick Time',
  'Holiday',
  'Press Trip',
  'Auto Show',
  'Birthday',
  'C/D Event'
];

const images = import.meta.glob('@/assets/staff/*.{jpg,png}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const eventClassByType: Record<EventType, EventClass> = {
  Vacation: 'vacation',
  'Sick Time': 'sick-time',
  Holiday: 'holiday',
  'Press Trip': 'press-trip',
  'Auto Show': 'auto-show',
  Birthday: 'birthday',
  'C/D Event': 'cd-event'
};

const hasActiveFilters = computed((): boolean => {
  return props.filters.types.length > 0 || props.filters.staffIds.length > 0;
});

function imgUrl(name: string): string {
  return (
    images[`/src/assets/staff/${name}.jpg`] ||
    images[`/src/assets/staff/${name}.png`] ||
    images['/src/assets/staff/user.png']
  );
}

function getEventClass(type: EventType): EventClass {
  return eventClassByType[type];
}

function isStaffSelected(id: string): boolean {
  return props.filters.staffIds[0] === id;
}

function isTypeSelected(type: EventType): boolean {
  return props.filters.types[0] === type;
}

function toggleStaff(id: string): void {
  const current = props.filters.staffIds[0];

  emit('filters', {
    ...props.filters,
    staffIds: current === id ? [] : [id]
  });
}

function toggleType(type: EventType): void {
  const current = props.filters.types[0];

  emit('filters', {
    ...props.filters,
    types: current === type ? [] : [type]
  });
}

function reset(): void {
  emit('filters', {
    types: [],
    staffIds: []
  });
}
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.filters-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.staff-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.staff-filter {
  display: inline-flex;
  align-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--white);
  cursor: pointer;
  text-shadow: none;
}

.staff-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 999px;
  background-color: rgba(0, 0, 0, 0.22);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.staff-label {
  display: inline-flex;
  align-items: center;
  max-width: 0;
  margin-left: 0;
  padding: 0;
  overflow: hidden;
  opacity: 0;
  white-space: nowrap;
  font:
    600 0.72rem/1 Arial,
    sans-serif;
  letter-spacing: 0.01em;
  transition:
    max-width 0.2s ease,
    margin-left 0.2s ease,
    padding 0.2s ease,
    opacity 0.18s ease;
}

.staff-filter:hover .staff-label,
.staff-filter:focus-visible .staff-label,
.staff-filter.active .staff-label {
  max-width: 96px;
  margin-left: 6px;
  padding: 0 10px 0 0;
  opacity: 1;
}

.staff-filter:hover .staff-avatar,
.staff-filter:focus-visible .staff-avatar,
.staff-filter.active .staff-avatar {
  border-color: var(--white);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.14);
}

.staff-filter:focus-visible {
  outline: none;
}

.type-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.type-pill {
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  padding: 4px 10px;
  color: var(--dark-gray);
  font:
    600 0.72rem/1 Arial,
    sans-serif;
  text-shadow: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.type-pill:hover {
  transform: translateY(-1px);
}

.type-pill.active {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.22);
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
  background-color: rgba(255, 255, 255, 0.16);
  color: var(--white);
}

.vacation {
  background-color: var(--ocean-off);
  opacity: 0.85;
}

.sick-time {
  background-color: var(--ocean-yellow);
}

.press-trip {
  background-color: var(--ocean-press-trip);
}

.reset-button {
  flex: 0 0 auto;
  align-self: center;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 999px;
  padding: 4px 10px;
  background: transparent;
  color: var(--white);
  font:
    600 0.72rem/1 Arial,
    sans-serif;
  text-shadow: none;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.reset-button:hover:not(:disabled) {
  background-color: var(--ocean-lt-blue);
}

.reset-button:disabled {
  border-color: rgba(255, 255, 255, 0.24);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }

  .reset-button {
    align-self: flex-start;
  }
}

@media (max-width: 640px) {
  .filters {
    gap: 8px;
  }

  .staff-filters {
    gap: 6px;
  }

  .staff-avatar {
    width: 30px;
    height: 30px;
    flex-basis: 30px;
  }

  .staff-filter:hover .staff-label,
  .staff-filter:focus-visible .staff-label,
  .staff-filter.active .staff-label {
    max-width: 84px;
    padding-right: 8px;
  }

  .type-filters {
    gap: 5px;
  }

  .type-pill,
  .reset-button {
    font-size: 0.68rem;
  }
}
</style>
