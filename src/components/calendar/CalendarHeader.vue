<template>
  <header>
    <div class="date-container">
      <div class="today">
        <div>{{ currentDate.date }}</div>
        <div>{{ month[currentDate.month] }}</div>
        <div>{{ currentDate.year }}</div>
        <div class="date-picker-btn" @click="toggleDatePicker">&#10552;</div>
        <div v-if="showDatePicker" class="date-picker">
          <input type="date" @input="updateDate(($event.target as HTMLInputElement).value)" />
        </div>
      </div>
      <div class="date-nav">
        <div @click="goToPreviousMonth" class="small-month">&lt; {{ lastMonth }}</div>
        <div @click="goToToday">Today</div>
        <div @click="goToNextMonth" class="small-month">{{ nextMonth }} &gt;</div>
      </div>
    </div>
    <div class="calendar-title">
      <h1>C/D Buyers Guide</h1>
      <h2>Team Calendar</h2>
    </div>
    <NewEvent :staff="staff" key="new-event" @update="addEvent($event)" />
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
@mixin arrow-style() {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  cursor: pointer;
}

header {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto minmax(220px, 1fr);
  align-items: center;
  gap: var(--layout-gap-md);
  padding: 20px 24px;
  text-align: center;
  color: var(--light-gray);
  text-shadow:
    1px 1px 1px var(--dark-gray),
    1px -1px 1px var(--dark-gray),
    -1px 1px 1px var(--dark-gray),
    -1px -1px 1px var(--dark-gray);

  > :last-child {
    justify-self: end;
  }

  .calendar-title {
    min-width: 0;
  }

  .date-container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 20px;
    min-width: 0;

    .arrow-left {
      @include arrow-style();
      border-right: 10px solid var(--white);

      &:hover {
        border-right: 10px solid var(--md-tran-black);
      }
    }

    .arrow-right {
      @include arrow-style();
      border-left: 10px solid var(--white);

      &:hover {
        border-left: 10px solid var(--md-tran-black);
      }
    }

    .today {
      display: grid;
      grid-template-columns: 40px auto 70px auto;
      gap: 10px;
      font-size: 2rem;
      position: relative;

      div {
        display: flex;
        justify-content: center;
      }

      .date-picker-btn {
        padding: 0 4px;

        &:hover {
          cursor: pointer;
        }
      }

      .date-picker {
        position: absolute;
        bottom: -20px;
        right: 0;
      }
    }

    .date-nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      gap: 8px;

      div {
        border: 1px solid var(--white);
        border-radius: 8px;
        padding: 2px 14px;
        transition: 0.4s;

        &:hover {
          background-color: var(--ocean-lt-blue);
          cursor: pointer;
        }
      }

      .small-month {
        font-size: 1rem;
      }
    }
  }

  .calendar-title {
    min-width: 0;
  }

  /* Tablet / Mobile Layout */
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 20px 16px;

    > :last-child {
      justify-self: center;
    }

    .date-container {
      width: 100%;
      gap: 16px;

      /* Row 1: Title */
      .calendar-title {
        order: 1;
      }

      /* Row 2: Date + Nav */
      .date-container {
        order: 2;
        width: 100%;

        .today {
          font-size: 1.5rem;
          grid-template-columns: auto auto auto auto;
        }

        .date-nav {
          font-size: 1.2rem;
        }
      }

      /* Row 3: Action */
      > :last-child {
        order: 3;
        justify-self: center;
        width: 100%;
        max-width: 320px;
      }
    }
  }
}
</style>
