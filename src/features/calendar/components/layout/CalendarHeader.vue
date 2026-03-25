<template>
  <header class="calendar-header" :style="headerStyle">
    <div class="header-top">
      <div class="header-main">
        <CalendarHeaderDateControls :current-date="currentDate" @date="emit('date', $event)" />
      </div>

      <div class="header-title">
        <p class="header-eyebrow">Team calendar</p>
        <h1>C/D Buyers Guide</h1>
      </div>

      <div class="header-action">
        <div class="header-action-group">
          <NewEventModal :staff="staff" @update="addEvent($event)" />
          <ManageStaffModal :staff="staff" @update="emit('staff-update', $event)" />
        </div>
      </div>
    </div>

    <div class="header-filters">
      <CalendarHeaderFilters :staff="staff" :filters="filters" @filters="emit('filters', $event)" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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

const monthGradientVars = [
  '--calendar-header-gradient-jan',
  '--calendar-header-gradient-feb',
  '--calendar-header-gradient-mar',
  '--calendar-header-gradient-apr',
  '--calendar-header-gradient-may',
  '--calendar-header-gradient-jun',
  '--calendar-header-gradient-jul',
  '--calendar-header-gradient-aug',
  '--calendar-header-gradient-sep',
  '--calendar-header-gradient-oct',
  '--calendar-header-gradient-nov',
  '--calendar-header-gradient-dec'
] as const;

const headerStyle = computed(() => ({
  '--calendar-header-gradient': `var(${monthGradientVars[currentDate.month]})`
}));

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
  color: #f8fafc;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.08) 0%, rgba(15, 23, 42, 0.22) 100%),
    var(--calendar-header-gradient);
  border-radius: 0 0 24px 24px;
  box-shadow: var(--calendar-shadow-soft);
  overflow: hidden;
}

.header-top {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) minmax(320px, auto) minmax(220px, 1fr);
  grid-template-areas: 'main title action';
  align-items: center;
  gap: 20px;
  padding: 24px 28px 18px;
}

.header-title {
  grid-area: title;
  min-width: 0;
  text-align: center;
  align-self: center;

  .header-eyebrow {
    margin: 0 0 6px;
    color: rgba(248, 250, 252, 0.72);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    color: rgba(248, 250, 252, 0.94);
    font-size: clamp(1.45rem, 1.9vw, 2.05rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: 0.03em;
    text-wrap: balance;
  }
}

.header-main {
  grid-area: main;
  min-width: 0;
  align-self: center;
}

.header-action {
  grid-area: action;
  justify-self: end;
  width: max-content;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.header-action-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}

.header-filters {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 28px 18px;
  background: rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(10px);
}

@media (max-width: 1100px) {
  .calendar-header {
    border-radius: 0 0 20px 20px;
  }

  .header-top {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    grid-template-areas:
      'title title'
      'main action';
    column-gap: 16px;
    row-gap: 14px;
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
    padding: 20px 18px 14px;
  }

  .header-filters {
    padding: 12px 18px 14px;
  }

  .header-title {
    .header-eyebrow {
      font-size: 0.72rem;
    }

    h1 {
      font-size: 1.35rem;
      line-height: 1.15;
    }
  }
}

@media (max-width: 640px) {
  .calendar-header {
    border-radius: 0 0 16px 16px;
  }

  .header-top {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    column-gap: 10px;
    row-gap: 10px;
    padding: 12px 10px 10px;
  }

  .header-filters {
    padding: 10px 10px 12px;
  }

  .header-title {
    .header-eyebrow {
      margin-bottom: 4px;
      font-size: 0.65rem;
      letter-spacing: 0.12em;
    }

    h1 {
      font-size: 1.02rem;
      line-height: 1.2;
    }
  }

  .header-action {
    gap: 6px;
  }

  .header-action-group {
    gap: 6px;
  }
}

@media (max-width: 360px) {
  .header-top {
    column-gap: 8px;
    row-gap: 8px;
    padding: 10px 8px;
  }

  .header-filters {
    padding: 8px 8px 10px;
  }

  .header-title h1 {
    font-size: 0.96rem;
  }
}
</style>
