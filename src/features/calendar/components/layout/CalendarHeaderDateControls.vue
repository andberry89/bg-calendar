<template>
  <div class="date-container">
    <MonthYearPicker :current-date="currentDate" @update="emit('date', $event)" />

    <div class="date-nav">
      <button type="button" class="header-control-button small-month" @click="goToPreviousMonth">
        &lt; {{ lastMonth }}
      </button>
      <button type="button" class="header-control-button" @click="goToToday">Today</button>
      <button type="button" class="header-control-button small-month" @click="goToNextMonth">
        {{ nextMonth }} &gt;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MonthYearPicker from '@/features/calendar/components/controls/MonthYearPicker.vue';
import { month } from '@/features/calendar/utils/selectOptions';
import type { CurrentDate } from '@/types/calendar';

const { currentDate } = defineProps<{
  currentDate: CurrentDate;
}>();

const emit = defineEmits<{
  (e: 'date', value: CurrentDate): void;
}>();

function getMonthLabel(monthIndex: number): string {
  return month[monthIndex].substring(0, 3);
}

const lastMonth = computed((): string => {
  const previousMonthIndex = currentDate.month === 0 ? 11 : currentDate.month - 1;

  return getMonthLabel(previousMonthIndex);
});

const nextMonth = computed((): string => {
  const nextMonthIndex = currentDate.month === 11 ? 0 : currentDate.month + 1;

  return getMonthLabel(nextMonthIndex);
});

function goToToday(): void {
  const today = new Date();

  emit('date', {
    date: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear()
  });
}

function emitMonthChange(monthOffset: -1 | 1): void {
  const isNextMonth = monthOffset === 1;
  const isDecemberToJanuary = currentDate.month === 11 && isNextMonth;
  const isJanuaryToDecember = currentDate.month === 0 && monthOffset === -1;

  emit('date', {
    date: 1,
    month: isDecemberToJanuary ? 0 : isJanuaryToDecember ? 11 : currentDate.month + monthOffset,
    year: isDecemberToJanuary
      ? currentDate.year + 1
      : isJanuaryToDecember
        ? currentDate.year - 1
        : currentDate.year
  });
}

function goToNextMonth(): void {
  emitMonthChange(1);
}

function goToPreviousMonth(): void {
  emitMonthChange(-1);
}
</script>

<style lang="scss" scoped>
.date-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
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

.date-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 1.1rem;
  opacity: 0.9;

  .small-month {
    font-size: 0.95rem;
  }
}

@media (max-width: 900px) {
  .date-nav {
    font-size: 1rem;
    gap: 6px;

    .header-control-button {
      padding: 4px 12px;
    }
  }
}

@media (max-width: 640px) {
  .date-nav {
    font-size: 0.74rem;
    gap: 3px;

    .header-control-button {
      padding: 3px 6px;
    }

    .small-month {
      font-size: 0.68rem;
    }
  }
}

@media (max-width: 360px) {
  .date-nav {
    font-size: 0.68rem;
    gap: 2px;

    .header-control-button {
      padding: 2px 5px;
    }

    .small-month {
      font-size: 0.64rem;
    }
  }
}
</style>
