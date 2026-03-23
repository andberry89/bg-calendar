<template>
  <div class="filters">
    <!-- Staff -->
    <div class="staff-filters">
      <button
        v-for="member in staff"
        :key="member.id"
        type="button"
        class="staff-avatar"
        :class="{ active: isStaffSelected(member.id) }"
        @click="toggleStaff(member.id)"
      >
        <img :src="imgUrl(member.lastName)" :alt="member.shortName" />
        <span class="label">{{ member.shortName }}</span>
      </button>
    </div>

    <!-- Event Types -->
    <div class="type-filters">
      <button
        v-for="type in eventTypes"
        :key="type"
        type="button"
        class="type-pill"
        :class="{ active: isTypeSelected(type) }"
        @click="toggleType(type)"
      >
        {{ type }}
      </button>
    </div>

    <!-- Reset -->
    <button type="button" class="reset-button" :disabled="!hasActiveFilters" @click="reset">
      Reset
    </button>
  </div>
</template>

<script setup lang="ts">
import type { EventFilters } from '@/features/calendar/utils/filterEvents';
import type { EventType, Staff } from '@/types/calendar';

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

function imgUrl(name: string): string {
  return (
    images[`/src/assets/staff/${name}.jpg`] ||
    images[`/src/assets/staff/${name}.png`] ||
    images['/src/assets/staff/user.png']
  );
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
  emit('filters', { types: [], staffIds: [] });
}

const hasActiveFilters = props.filters.types.length > 0 || props.filters.staffIds.length > 0;
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

/* STAFF */

.staff-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.staff-avatar {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;
  padding: 2px;
  background: transparent;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }

  .label {
    max-width: 0;
    opacity: 0;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.2s ease;
    font-size: 0.7rem;
  }

  &:hover .label,
  &.active .label {
    max-width: 80px;
    opacity: 1;
    margin-right: 6px;
  }

  &.active {
    border-color: var(--white);
    background: rgba(255, 255, 255, 0.15);
  }
}

/* TYPES */

.type-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.type-pill {
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.7rem;
  background: transparent;
  color: var(--white);
  cursor: pointer;

  &.active {
    background: var(--white);
    color: var(--black);
  }
}

/* RESET */

.reset-button {
  align-self: center;
  font-size: 0.7rem;
}
</style>
