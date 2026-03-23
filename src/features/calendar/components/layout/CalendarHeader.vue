<template>
  <header class="calendar-header">
    <div class="header-top">
      <div class="header-main">
        <CalendarHeaderDateControls :current-date="currentDate" @date="emit('date', $event)" />
      </div>

      <div class="header-title">
        <h1>C/D Buyers Guide Team Calendar</h1>
      </div>

      <div class="header-action">
        <NewEventModal :staff="staff" key="new-event" @update="addEvent($event)" />
        <ManageStaffModal :staff="staff" @update="emit('staff-update', $event)" />
      </div>
    </div>

    <div class="header-filters">
      <CalendarHeaderFilters :staff="staff" :filters="filters" @filters="emit('filters', $event)" />
    </div>
  </header>
</template>

<script setup lang="ts">
import CalendarHeaderDateControls from '@/features/calendar/components/layout/CalendarHeaderDateControls.vue';
import CalendarHeaderFilters from '@/features/calendar/components/layout/CalendarHeaderFilters.vue';
import NewEventModal from '@/features/calendar/components/modals/NewEventModal.vue';
import ManageStaffModal from '@/features/calendar/components/modals/ManageStaffModal.vue';
import type { EventFilters } from '@/features/calendar/utils/filterEvents';
import type { CurrentDate, NewCalendarEvent, Staff, StaffUpdatePayload } from '@/types/calendar';

const { currentDate, staff, filters } = defineProps<{
  currentDate: CurrentDate;
  staff: Staff[];
  filters: EventFilters;
}>();

const emit = defineEmits<{
  (e: 'date', value: CurrentDate): void;
  (e: 'update', value: NewCalendarEvent): void;
  (e: 'filters', value: EventFilters): void;
  (e: 'staff-update', value: StaffUpdatePayload): void;
}>();

function addEvent(event: NewCalendarEvent): void {
  emit('update', event);
}
</script>

<style lang="scss" scoped>
.calendar-header {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  color: var(--light-gray);
  text-shadow:
    1px 1px 1px var(--dark-gray),
    1px -1px 1px var(--dark-gray),
    -1px 1px 1px var(--dark-gray),
    -1px -1px 1px var(--dark-gray);
}

.header-top {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(280px, auto) minmax(220px, 1fr);
  grid-template-areas: 'main title action';
  align-items: start;
  gap: var(--layout-gap-md);
  padding: 20px 24px 14px;
}

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

.header-filters {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 24px 14px;
  background-color: rgba(0, 0, 0, 0.18);
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

@media (max-width: 1100px) {
  .header-top {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    grid-template-areas:
      'title title'
      'main action';
    column-gap: 16px;
    row-gap: 12px;
  }

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
  .header-top {
    padding: 20px 16px 12px;
  }

  .header-filters {
    padding: 10px 16px 12px;
  }

  .header-title h1 {
    font-size: 1.3rem;
    white-space: normal;
  }
}

@media (max-width: 640px) {
  .header-top {
    grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
    column-gap: 10px;
    row-gap: 8px;
    padding: 8px 6px 8px;
  }

  .header-filters {
    padding: 8px 6px 10px;
  }

  .header-title h1 {
    font-size: 1.05rem;
    line-height: 1.2;
  }

  .header-action {
    gap: 4px;
  }
}

@media (max-width: 360px) {
  .header-top {
    column-gap: 8px;
    row-gap: 6px;
    padding: 8px 6px 8px;
  }

  .header-title h1 {
    font-size: 0.98rem;
  }

  .header-action {
    gap: 3px;
  }
}
</style>
