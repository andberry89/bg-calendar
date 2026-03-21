<template>
  <header class="calendar-header">
    <div class="header-title">
      <h1>C/D Buyers Guide Team Calendar</h1>
    </div>

    <div class="header-main">
      <div class="date-container">
        <div class="date-display">
          <div class="date-value">{{ currentDate.date }}</div>
          <div class="month-value">{{ month[currentDate.month] }}</div>
          <div class="year-value">{{ currentDate.year }}</div>
          <div class="date-picker-control">
            <button
              class="date-picker-btn header-control-button"
              type="button"
              aria-label="Open date picker"
              @click="toggleDatePicker"
            >
              &#10552;
            </button>
            <div v-if="showDatePicker" class="date-picker">
              <input type="date" @input="updateDate(($event.target as HTMLInputElement).value)" />
            </div>
          </div>
        </div>

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
      <NewEvent :staff="staff" key="new-event" @update="addEvent($event)" />
    </div>
  </header>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import NewEvent from './components/NewEvent.vue';
import { month } from './utils/selectOptions';
import type { CurrentDate, NewCalendarEvent, Staff } from '@/types/calendar';

const { currentDate, staff } = defineProps<{
  currentDate: CurrentDate;
  staff: Staff[];
}>();

const emit = defineEmits<{
  (e: 'date', value: CurrentDate): void;
  (e: 'update', value: NewCalendarEvent): void;
}>();

const showDatePicker = ref(false);

const lastMonth = computed((): string => {
  let previousMonth = month[currentDate.month - 1];

  if (currentDate.month === 0) {
    previousMonth = month[11];
  }

  return previousMonth.substring(0, 3);
});

const nextMonth = computed((): string => {
  let upcomingMonth = month[currentDate.month + 1];

  if (currentDate.month === 11) {
    upcomingMonth = month[0];
  }

  return upcomingMonth.substring(0, 3);
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

function goToNextMonth(): void {
  const nextDate: CurrentDate = { ...currentDate };

  if (nextDate.month === 11) {
    nextDate.month = 0;
    nextDate.year += 1;
  } else {
    nextDate.month += 1;
  }

  nextDate.date = 1;
  emit('date', nextDate);
}

function goToPreviousMonth(): void {
  const previousDate: CurrentDate = { ...currentDate };

  if (previousDate.month === 0) {
    previousDate.month = 11;
    previousDate.year -= 1;
  } else {
    previousDate.month -= 1;
  }

  previousDate.date = 1;
  emit('date', previousDate);
}

function toggleDatePicker(): void {
  showDatePicker.value = !showDatePicker.value;
}

function updateDate(date: string): void {
  const split = date.split('-');

  emit('date', {
    year: parseInt(split[0], 10),
    month: parseInt(split[1], 10) - 1,
    date: parseInt(split[2], 10)
  });

  toggleDatePicker();
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

  .date-picker-control {
    position: relative;
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
    padding: 4px 8px;
    min-width: 36px;
    opacity: 0.8;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }

  .date-picker {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
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

    .date-display {
      font-size: 1.2rem;
      gap: 8px;
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

    .date-display {
      font-size: 1rem;
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

    .date-display {
      font-size: 0.92rem;
      gap: 4px;
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
