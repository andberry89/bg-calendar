<template>
  <div class="filters">
    <div class="filters-left">
      <div class="staff-filters">
        <button
          v-for="member in staff"
          :key="member.id"
          type="button"
          class="staff-filter"
          :class="{ active: isStaffSelected(member.id) }"
          :style="getStaffColorStyle(member.id)"
          :title="member.shortName"
          @click="toggleStaff(member.id)"
        >
          <span class="staff-avatar">
            <img :src="imgUrl(member.lastName)" :alt="member.shortName" />
          </span>
          <span class="staff-label">{{ member.shortName }}</span>
        </button>
      </div>
    </div>

    <div class="filters-right">
      <div class="type-filters">
        <button
          v-for="type in filterableEventTypes"
          :key="type"
          type="button"
          class="type-pill"
          :class="{
            active: isTypeSelected(type),
            inactive: hasActiveTypeFilter && !isTypeSelected(type),
            dimmed: !hasActiveTypeFilter
          }"
          :style="getTypePillStyle(type)"
          @click="toggleType(type)"
        >
          <span class="type-pill-dot" />
          <span>{{ type }}</span>
        </button>

        <button type="button" class="reset-button" :disabled="!hasActiveFilters" @click="reset">
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  eventTypes,
  getPersonColorStyle,
  getEventTypeConfig,
  getStaffAvatarUrl,
  type EventFilters
} from '@/features/calendar/utils';
import type { EventType, Staff } from '@/types/calendar';
import { useStaffStore } from '@/stores/staff';

type FilterableEventType = Exclude<EventType, 'Holiday' | 'Birthday'>;

const props = defineProps<{
  staff: Staff[];
  filters: EventFilters;
}>();

const emit = defineEmits<{
  (e: 'filters', value: EventFilters): void;
}>();

const staffStore = useStaffStore();

const filterableEventTypes: readonly FilterableEventType[] = eventTypes.filter(
  (type): type is FilterableEventType => type !== 'Holiday' && type !== 'Birthday'
);

const hasActiveFilters = computed((): boolean => {
  return props.filters.types.length > 0 || props.filters.staffIds.length > 0;
});

const hasActiveTypeFilter = computed((): boolean => {
  return props.filters.types.length > 0;
});

function imgUrl(name: string): string {
  return getStaffAvatarUrl(name);
}

function getTypePillStyle(type: FilterableEventType): Record<string, string> {
  const config = getEventTypeConfig(type);

  return {
    '--type-pill-color': config ? `var(${config.colorVar})` : 'rgba(255, 255, 255, 0.9)'
  };
}

function getStaffColorStyle(staffId: string): Record<string, string> {
  const key = staffStore.staffColorKeyById[staffId];

  if (!key) {
    return getPersonColorStyle('person-1');
  }

  return getPersonColorStyle(key);
}

function isStaffSelected(id: string): boolean {
  return props.filters.staffIds[0] === id;
}

function isTypeSelected(type: FilterableEventType): boolean {
  return props.filters.types[0] === type;
}

function toggleStaff(id: string): void {
  const current = props.filters.staffIds[0];

  emit('filters', {
    ...props.filters,
    staffIds: current === id ? [] : [id]
  });
}

function toggleType(type: FilterableEventType): void {
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
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.filters-left {
  flex: 1 1 auto;
  min-width: 0;
}

.filters-right {
  display: flex;
  justify-content: flex-end;
  flex: 0 1 auto;
  min-width: 0;
}

.staff-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.staff-filter {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  border: 0;
  padding: 0;
  background: transparent;
  color: rgba(248, 250, 252, 0.96);
  cursor: pointer;
}

.staff-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  overflow: hidden;
  border: 2px solid color-mix(in srgb, var(--person-color-base) 72%, white 28%);
  border-radius: 999px;
  background: linear-gradient(
    var(--person-color-angle),
    var(--person-color-gradient-start),
    var(--person-color-gradient-end)
  );
  box-shadow:
    0 0 0 3px rgba(255, 255, 255, 0.08),
    0 10px 24px rgba(15, 23, 42, 0.22);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease,
    filter 0.2s ease;

  img {
    display: block;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    border-radius: 999px;
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
  color: rgba(248, 250, 252, 0.92);
  font:
    700 0.74rem/1 Arial,
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
  margin-left: 8px;
  padding: 0 10px 0 0;
  opacity: 1;
}

.staff-filter:hover .staff-avatar,
.staff-filter:focus-visible .staff-avatar,
.staff-filter.active .staff-avatar {
  border-color: color-mix(in srgb, var(--person-color-base) 88%, white 12%);
  box-shadow:
    0 0 0 4px color-mix(in srgb, var(--person-color-tint) 70%, rgba(255, 255, 255, 0.12) 30%),
    0 14px 28px rgba(15, 23, 42, 0.24);
  transform: translateY(-1px) scale(1.02);
  filter: saturate(1.05);
}

.staff-filter:focus-visible {
  outline: none;
}

.type-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  min-width: 0;
  max-width: 100%;
}

.type-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(248, 250, 252, 0.92);
  font:
    600 0.72rem/1 Arial,
    sans-serif;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    opacity 0.16s ease,
    background-color 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease;
}

.type-pill-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--type-pill-color);
  flex: 0 0 8px;
}

.type-pill:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--type-pill-color) 12%, white 88%);
  color: rgba(15, 23, 42, 0.92);
}

.type-pill.dimmed {
  opacity: 0.5;
}

.type-pill.inactive {
  opacity: 0.55;
  background: rgba(255, 255, 255, 0.06);
}

.type-pill.active {
  opacity: 1;
  background: color-mix(in srgb, var(--type-pill-color) 18%, white 82%);
  border-color: color-mix(in srgb, var(--type-pill-color) 40%, white 60%);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--type-pill-color) 20%, transparent);
  color: rgba(15, 23, 42, 0.94);
}

.reset-button {
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 999px;
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(248, 250, 252, 0.9);
  font:
    600 0.72rem/1 Arial,
    sans-serif;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    opacity 0.18s ease;
}

.reset-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.reset-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 1100px) {
  .filters {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .filters-left {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .filters-right {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .staff-filters {
    justify-content: center;
  }

  .type-filters {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .filters {
    gap: 8px;
  }

  .filters-right {
    gap: 8px;
  }

  .staff-filters {
    gap: 6px;
  }

  .staff-avatar {
    width: 32px;
    height: 32px;
    flex-basis: 32px;
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

  .type-pill-dot {
    width: 7px;
    height: 7px;
    flex-basis: 7px;
  }
}
</style>
