<template>
  <div class="date-picker-control">
    <div class="date-display">
      <div class="date-value">{{ currentDate.date }}</div>
      <div class="month-value">{{ month[currentDate.month] }}</div>
      <div class="year-value">{{ currentDate.year }}</div>
      <button
        class="date-picker-btn header-control-button"
        type="button"
        aria-label="Open date picker"
        @click="toggleDatePicker"
      >
        &#10552;
      </button>
    </div>

    <div v-if="showDatePicker" class="date-picker">
      <input type="date" @input="updateDate(($event.target as HTMLInputElement).value)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { month } from '../utils/selectOptions';
import type { CurrentDate } from '@/types/calendar';

const { currentDate } = defineProps<{
  currentDate: CurrentDate;
}>();

const emit = defineEmits<{
  (e: 'update', value: CurrentDate): void;
}>();

const showDatePicker = ref(false);

function toggleDatePicker(): void {
  showDatePicker.value = !showDatePicker.value;
}

function updateDate(date: string): void {
  const split = date.split('-');

  emit('update', {
    year: parseInt(split[0], 10),
    month: parseInt(split[1], 10) - 1,
    date: parseInt(split[2], 10)
  });

  toggleDatePicker();
}
</script>

<style lang="scss" scoped>
.date-picker-control {
  position: relative;
  z-index: 2;
}

.date-display {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 1.75rem;
  position: relative;
  min-width: 0;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .month-value,
  .year-value {
    white-space: nowrap;
  }
}

.header-control-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

  &:hover {
    background-color: var(--ocean-lt-blue);
  }
}

.date-picker-btn {
  padding: 2px 6px;
  min-width: auto;
  font-size: 0.85em;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
}

.date-picker {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 10;
}

@media (max-width: 900px) {
  .date-display {
    font-size: 1.2rem;
    gap: 8px;
  }
}

@media (max-width: 640px) {
  .date-display {
    font-size: 1rem;
    gap: 6px;
  }
}

@media (max-width: 360px) {
  .date-display {
    font-size: 0.92rem;
    gap: 4px;
  }
}
</style>
