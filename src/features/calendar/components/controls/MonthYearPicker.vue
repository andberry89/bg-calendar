<template>
  <div class="date-picker-control">
    <div class="date-picker">
      <label class="visually-hidden" for="calendar-month-select">Select month</label>
      <select
        id="calendar-month-select"
        class="picker-select"
        :value="currentDate.month"
        @change="updateMonth"
      >
        <option v-for="(monthLabel, monthIndex) in month" :key="monthLabel" :value="monthIndex">
          {{ monthLabel }}
        </option>
      </select>

      <label class="visually-hidden" for="calendar-year-select">Select year</label>
      <select
        id="calendar-year-select"
        class="picker-select"
        :value="currentDate.year"
        @change="updateYear"
      >
        <option v-for="year in yearOptions" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { month } from '@/features/calendar/utils';
import type { CurrentDate } from '@/types/calendar';

const { currentDate } = defineProps<{
  currentDate: CurrentDate;
}>();

const emit = defineEmits<{
  (e: 'update', value: CurrentDate): void;
}>();

const yearOptions = computed((): number[] => {
  const startYear = 2023;
  // Keep future years available so users can schedule ahead without manual updates.
  const endYear = currentDate.year + 10;

  return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
});

function emitDateUpdate(monthValue: number, yearValue: number): void {
  emit('update', {
    date: 1,
    month: monthValue,
    year: yearValue
  });
}

function updateMonth(event: Event): void {
  const target = event.target as HTMLSelectElement;

  emitDateUpdate(parseInt(target.value, 10), currentDate.year);
}

function updateYear(event: Event): void {
  const target = event.target as HTMLSelectElement;

  emitDateUpdate(currentDate.month, parseInt(target.value, 10));
}
</script>

<style lang="scss" scoped>
.date-picker-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
  z-index: 2;
}

.date-picker {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.picker-select {
  min-width: 0;
  border: 1px solid var(--white);
  border-radius: 8px;
  padding: 4px 14px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-shadow: inherit;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
  appearance: auto;

  &:hover {
    background-color: var(--ocean-lt-blue);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
  }
}

.picker-select option {
  color: var(--black);
  text-shadow: none;
}

@media (max-width: 900px) {
  .picker-select {
    padding: 4px 12px;
    font-size: 0.95rem;
  }
}

@media (max-width: 640px) {
  .date-picker {
    gap: 6px;
  }

  .picker-select {
    padding: 3px 7px;
    font-size: 0.9rem;
  }
}

@media (max-width: 360px) {
  .date-picker {
    gap: 4px;
  }

  .picker-select {
    padding: 3px 8px;
    font-size: 0.9rem;
  }
}
</style>
