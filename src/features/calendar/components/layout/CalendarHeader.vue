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

      <div class="filter-controls">
        <select class="filter-select" :value="selectedType" @change="updateTypeFilter">
          <option value="">All types</option>
          <option v-for="eventType in eventTypes" :key="eventType" :value="eventType">
            {{ eventType }}
          </option>
        </select>

        <select class="filter-select" :value="selectedStaffId" @change="updateStaffFilter">
          <option value="">All staff</option>
          <option v-for="staffMember in staff" :key="staffMember.id" :value="staffMember.id">
            {{ staffMember.shortName }}
          </option>
        </select>

        <button
          type="button"
          class="header-control-button filter-reset-button"
          :disabled="!hasActiveFilters"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import DatePicker from '@/features/calendar/components/controls/DatePicker.vue';
import NewEventModal from '@/features/calendar/components/modals/NewEventModal.vue';
import { month } from '@/features/calendar/utils/selectOptions';
import type { EventFilters } from '@/features/calendar/utils/filterEvents';
import type { CurrentDate, EventType, NewCalendarEvent, Staff } from '@/types/calendar';

const eventTypes: EventType[] = [
  'Vacation',
  'Sick Time',
  'Holiday',
  'Press Trip',
  'Auto Show',
  'Birthday',
  'C/D Event'
];

const emptyFilters: EventFilters = {
  types: [],
  staffIds: []
};

const { currentDate, staff, filters } = defineProps<{
  currentDate: CurrentDate;
  staff: Staff[];
  filters: EventFilters;
}>();

const emit = defineEmits<{
  (e: 'date', value: CurrentDate): void;
  (e: 'update', value: NewCalendarEvent): void;
  (e: 'filters', value: EventFilters): void;
}>();

const selectedType = computed((): string => filters.types[0] ?? '');
const selectedStaffId = computed((): string => filters.staffIds[0] ?? '');
const hasActiveFilters = computed(
  (): boolean => filters.types.length > 0 || filters.staffIds.length > 0
);

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

function updateTypeFilter(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const value = target.value;

  emit('filters', {
    ...filters,
    types: value === '' ? [] : [value as EventType]
  });
}

function updateStaffFilter(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const value = target.value;

  emit('filters', {
    ...filters,
    staffIds: value === '' ? [] : [value]
  });
}

function resetFilters(): void {
  emit('filters', emptyFilters);
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
  align-items: start;
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
    align-self: center;

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
    align-self: center;
  }

  .header-action {
    grid-area: action;
    justify-self: center;
    width: max-content;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
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

  .filter-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    width: 100%;
    margin: 0;
  }

  .filter-select {
    min-width: 0;
    max-width: 122px;
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: 7px;
    padding: 2px 6px;
    background: transparent;
    color: var(--white);
    font-family: Arial, sans-serif;
    font-size: 0.72rem;
    font-weight: 400;
    line-height: 1;
    text-shadow: none;
    cursor: pointer;
    appearance: auto;
  }

  .filter-select option {
    color: var(--black);
    font-weight: 400;
  }

  .filter-reset-button {
    padding: 2px 7px;
    margin-left: auto;
    margin-right: auto;
    font-family: Arial, sans-serif;
    font-size: 0.72rem;
    font-weight: 400;
    text-shadow: none;
  }

  .filter-reset-button:disabled {
    border-color: rgba(255, 255, 255, 0.35);
    color: rgba(255, 255, 255, 0.55);
    cursor: not-allowed;

    &:hover {
      background-color: transparent;
    }
  }

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    grid-template-areas:
      'title title'
      'main action';
    column-gap: 16px;
    row-gap: 12px;

    .header-title h1 {
      white-space: normal;
    }

    .header-main {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .header-action {
      align-self: start;
    }
  }

  @media (max-width: 900px) {
    padding: 20px 16px;

    .header-title h1 {
      font-size: 1.3rem;
      white-space: normal;
    }

    .filter-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 3px;
    }

    .filter-select {
      align-self: flex-start;
      max-width: 116px;
      font-size: 0.69rem;
    }

    .filter-reset-button {
      align-self: center;
      font-size: 0.69rem;
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
    column-gap: 10px;
    row-gap: 8px;
    padding: 8px 6px;

    .header-title h1 {
      font-size: 1.05rem;
      line-height: 1.2;
    }

    .date-container {
      gap: 6px;
    }

    .header-action {
      gap: 4px;
    }

    .filter-controls {
      gap: 2px;
    }

    .filter-select {
      max-width: 108px;
      padding: 2px 5px;
      font-size: 0.66rem;
    }

    .filter-reset-button {
      padding: 2px 6px;
      font-size: 0.66rem;
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
    row-gap: 6px;
    padding: 8px 6px;

    .header-title h1 {
      font-size: 0.98rem;
    }

    .header-action {
      gap: 3px;
    }

    .filter-select {
      max-width: 98px;
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
