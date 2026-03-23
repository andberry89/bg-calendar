<template>
  <header class="calendar-header">
    <div class="header-title">
      <h1>C/D Buyers Guide Team Calendar</h1>
    </div>

    <div class="header-main">
      <div class="date-container">
        <DatePicker :current-date="currentDate" @update="emit('date', $event)" />

        <div class="date-nav">
          <button
            type="button"
            class="header-control-button small-month"
            @click="goToPreviousMonth"
          >
            &lt; {{ lastMonth }}
          </button>
          <button type="button" class="header-control-button" @click="goToToday">Today</button>
          <button type="button" class="header-control-button small-month" @click="goToNextMonth">
            {{ nextMonth }} &gt;
          </button>
        </div>
      </div>
    </div>

    <div class="header-action">
      <NewEventModal :staff="staff" key="new-event" @update="addEvent($event)" />
    </div>
  </header>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import DatePicker from './DatePicker.vue';
import NewEventModal from '@/features/calendar/components/modals/NewEventModal.vue';
import { month } from '@/features/calendar/utils/selectOptions';
import type { CurrentDate, NewCalendarEvent, Staff } from '@/types/calendar';

const { currentDate, staff } = defineProps<{
  currentDate: CurrentDate;
  staff: Staff[];
}>();

const emit = defineEmits<{
  (e: 'date', value: CurrentDate): void;
  (e: 'update', value: NewCalendarEvent): void;
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

function addEvent(event: NewCalendarEvent): void {
  emit('update', event);
}

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
.calendar-header {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(280px, auto) minmax(220px, 1fr);
  grid-template-areas: 'main title action';
  align-items: center;
  gap: var(--layout-gap-md);
  padding: 20px 24px;
  color: var(--light-gray);
  text-shadow:
    1px 1px 1px var(--dark-gray),
    1px -1px 1px var(--dark-gray),
    -1px 1px 1px var(--dark-gray),
    -1px -1px 1px var(--dark-gray);

  .header-title {
    grid-area: title;
    min-width: 0;
    text-align: center;

    h1 {
      margin: 0;
      font-size: clamp(1.4rem, 1.8vw, 2rem);
      line-height: 1.1;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
  }

  .header-main {
    grid-area: main;
    min-width: 0;
  }

  .header-action {
    grid-area: action;
    justify-self: center;
    width: max-content;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .date-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
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
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    grid-template-areas:
      'title title'
      'main action';
    column-gap: 18px;
    row-gap: 14px;
    padding: 20px 16px;

    .header-title h1 {
      font-size: 1.3rem;
      white-space: normal;
    }

    .header-main {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .header-action {
      align-self: center;
    }

    .date-nav {
      font-size: 1rem;
      gap: 6px;

      .header-control-button {
        padding: 4px 12px;
      }
    }
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
    column-gap: 12px;
    row-gap: 12px;
    padding: 16px 12px;

    .header-title h1 {
      font-size: 1.05rem;
      line-height: 1.2;
    }

    .date-container {
      gap: 6px;
    }

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
    column-gap: 8px;
    padding: 14px 8px;

    .header-title h1 {
      font-size: 0.98rem;
    }

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
}
</style>
