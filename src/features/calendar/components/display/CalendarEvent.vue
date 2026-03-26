<template>
  <div
    class="event-container"
    :class="{
      'event-container--interactive': event.class !== 'holiday'
    }"
    :style="eventStyle"
    @click.stop="emitEvent"
  >
    <div
      class="event-pill"
      :class="[
        `event-pill--${event.class}`,
        {
          'event-pill--holiday': isHoliday,
          'event-pill--multi-day': isMultiDay,
          'event-pill--multi-day-start': isMultiDayStart,
          'event-pill--multi-day-middle': isMultiDayMiddle,
          'event-pill--multi-day-end': isMultiDayEnd
        }
      ]"
    >
      <span v-if="showAvatar" class="event-pill__avatar">
        <img
          v-if="avatarSrc"
          class="event-pill__avatar-image"
          :src="avatarSrc"
          :alt="`${avatarFallback} avatar`"
        />
        <span v-else class="event-pill__avatar-fallback">{{ avatarFallback }}</span>
      </span>
      <span v-else-if="!isHoliday" class="event-pill__dot" />
      <span class="event-pill__primary">{{ primaryText }}</span>
      <span v-if="secondaryText" class="event-pill__secondary">{{ secondaryText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getEventTypeConfig } from '@/features/calendar/utils/eventTypeConfig';
import type { AssignedCalendarEvent, CalendarEvent, Staff } from '@/types/calendar';

const { event } = defineProps<{
  event: CalendarEvent | AssignedCalendarEvent;
}>();

const emit = defineEmits<{
  (e: 'update', value: CalendarEvent | AssignedCalendarEvent): void;
}>();

const images = import.meta.glob('@/assets/staff/*.{jpg,png}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

function imgUrl(name: string): string {
  return (
    images[`/src/assets/staff/${name}.jpg`] ||
    images[`/src/assets/staff/${name}.png`] ||
    images['/src/assets/staff/user.png']
  );
}

const eventTypeTintByClass: Partial<Record<CalendarEvent['class'], string>> = {
  vacation: 'rgba(22, 163, 74, 0.16)',
  'sick-time': 'rgba(239, 68, 68, 0.16)',
  holiday: 'rgba(192, 132, 26, 0.2)',
  'press-trip': 'rgba(37, 99, 235, 0.16)',
  'auto-show': 'rgba(234, 88, 12, 0.16)',
  birthday: 'rgba(219, 39, 119, 0.16)',
  'cd-event': 'rgba(124, 58, 237, 0.16)',
  'comp-day': 'rgba(15, 118, 110, 0.16)'
};

const eventTypeBorderByClass: Partial<Record<CalendarEvent['class'], string>> = {
  vacation: 'rgba(22, 163, 74, 0.3)',
  'sick-time': 'rgba(239, 68, 68, 0.3)',
  holiday: 'rgba(192, 132, 26, 0.36)',
  'press-trip': 'rgba(37, 99, 235, 0.3)',
  'auto-show': 'rgba(234, 88, 12, 0.3)',
  birthday: 'rgba(219, 39, 119, 0.3)',
  'cd-event': 'rgba(124, 58, 237, 0.3)',
  'comp-day': 'rgba(15, 118, 110, 0.3)'
};

type StaffMember = Staff;

const isHoliday = computed((): boolean => event.class === 'holiday');

const isAssignedEvent = computed((): boolean => {
  return 'display' in event && typeof event.display === 'object' && event.display !== null;
});

const isMultiDay = computed((): boolean => {
  return isAssignedEvent.value && event.display.isMultiDay === true;
});

const isMultiDayStart = computed((): boolean => {
  return isMultiDay.value && event.display.startsToday === true;
});

const isMultiDayEnd = computed((): boolean => {
  return isMultiDay.value && event.display.endsToday === true;
});

const isMultiDayMiddle = computed((): boolean => {
  return isMultiDay.value && !isMultiDayStart.value && !isMultiDayEnd.value;
});

const leadStaff = computed((): StaffMember | undefined => event.staff[0]);

const showAvatar = computed((): boolean => {
  if (isHoliday.value) {
    return false;
  }

  if (event.class === 'auto-show' || event.class === 'cd-event') {
    return false;
  }

  return Boolean(leadStaff.value);
});

const avatarSrc = computed((): string => {
  const staff = leadStaff.value;

  if (!staff?.lastName) {
    return images['/src/assets/staff/user.png'] || '';
  }

  return imgUrl(staff.lastName);
});

const avatarFallback = computed((): string => {
  const staff = leadStaff.value;

  if (!staff) {
    return 'ST';
  }

  if (typeof staff.initials === 'string' && staff.initials.trim()) {
    return staff.initials.trim().slice(0, 2).toUpperCase();
  }

  if (typeof staff.shortName === 'string' && staff.shortName.trim()) {
    return staff.shortName
      .trim()
      .split(/\s+/)
      .map((part) => part[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  return 'ST';
});

const primaryText = computed((): string => {
  switch (event.class) {
    case 'birthday':
      return `${event.staff[0]?.shortName ?? 'Team'} Birthday`;
    case 'press-trip':
      return event.staff[0]?.initials ?? 'Staff';
    case 'vacation':
      return event.staff[0]?.initials ?? 'Staff';
    case 'sick-time':
      return event.staff[0]?.initials ?? 'Staff';
    case 'auto-show':
      return 'Auto Show';
    case 'cd-event':
      return event.details || 'C/D Event';
    case 'comp-day':
      return event.staff[0]?.initials ?? 'Staff';
    case 'holiday':
      return event.details || event.type;
    default:
      return event.type;
  }
});

const secondaryText = computed((): string => {
  switch (event.class) {
    case 'birthday':
      return '🎂';
    case 'press-trip':
      return 'Press Trip';
    case 'vacation':
      return 'Off (PTO)';
    case 'sick-time':
      return 'Sick Time';
    case 'auto-show':
      return event.details;
    case 'comp-day':
      return 'Comp Day';
    case 'holiday':
      return event.closed === 'half'
        ? 'Early Close'
        : event.closed === 'full'
          ? 'Office Closed'
          : '';
    default:
      return '';
  }
});

const eventColorVar = computed((): string => {
  const config = getEventTypeConfig(event.type);

  return config ? `var(${config.colorVar})` : 'var(--calendar-border-strong)';
});

const eventStyle = computed(
  (): Record<string, string> => ({
    '--event-pill-color': eventColorVar.value,
    '--event-pill-bg': eventTypeTintByClass[event.class] ?? 'rgba(255, 255, 255, 0.12)',
    '--event-pill-border': eventTypeBorderByClass[event.class] ?? 'rgba(148, 163, 184, 0.3)'
  })
);

function emitEvent(): void {
  emit('update', event);
}
</script>
<style lang="scss" scoped>
.event-container {
  width: 100%;
}

.event-container--interactive {
  cursor: pointer;
}

.event-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  width: 100%;
  margin: 3px 0;
  padding: 6px 8px;
  border: 1px solid var(--event-pill-border);
  border-radius: 10px;
  background: var(--event-pill-bg);
  color: var(--calendar-text);
  box-sizing: border-box;
  overflow: hidden;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease,
    background-color 0.16s ease;
}

.event-container--interactive:hover .event-pill {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
}

.event-pill__dot {
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  border-radius: 999px;
  background: var(--event-pill-color);
}

.event-pill__avatar {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--event-pill-color) 14%, white 86%);
  color: var(--event-pill-color);
  transform: translateY(0.5px);
}

.event-pill__avatar-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.event-pill__avatar-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font:
    700 0.48rem/1 Arial,
    sans-serif;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.event-pill__primary,
.event-pill__secondary {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.1;
}

.event-pill__primary {
  white-space: nowrap;
  font:
    700 0.72rem/1.1 Arial,
    sans-serif;
}

.event-pill__secondary {
  white-space: nowrap;
  color: var(--calendar-text-muted);
  font:
    600 0.68rem/1.1 Arial,
    sans-serif;
}

.event-pill--auto-show {
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.event-pill--auto-show .event-pill__primary {
  white-space: nowrap;
}

.event-pill--auto-show .event-pill__secondary {
  white-space: nowrap;
  max-width: 100%;
}

.event-pill--auto-show .event-pill__dot {
  display: none;
}

.event-pill--auto-show .event-pill__primary,
.event-pill--auto-show .event-pill__secondary {
  display: block;
  white-space: nowrap;
}

.event-pill--auto-show .event-pill__secondary {
  max-width: 100%;
}

.event-pill--holiday {
  justify-content: center;
  background: color-mix(in srgb, var(--event-pill-color) 22%, white 78%);
  color: var(--holiday-closed-text);
}

.event-pill--holiday .event-pill__primary,
.event-pill--holiday .event-pill__secondary {
  color: inherit;
}

.event-pill--multi-day {
  border-radius: 0;
}

.event-pill--multi-day-start {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.event-pill--multi-day-end {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.event-pill--multi-day-middle {
  padding-left: 6px;
  padding-right: 6px;
}

.event-pill--multi-day.event-pill--auto-show {
  border-radius: 0;
}

.event-pill--multi-day.event-pill--auto-show.event-pill--multi-day-start {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.event-pill--multi-day.event-pill--auto-show.event-pill--multi-day-end {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.event-pill--holiday .event-pill__primary,
.event-pill--holiday .event-pill__secondary {
  color: inherit;
}

@media (max-width: 900px) {
  .event-pill {
    padding: 5px 6px;
    border-radius: 8px;
  }

  .event-pill__primary {
    font-size: 0.66rem;
  }

  .event-pill__secondary {
    font-size: 0.62rem;
  }

  .event-pill--multi-day {
    border-radius: 0;
  }

  .event-pill--multi-day-start {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .event-pill--multi-day-end {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}

@media (max-width: 640px) {
  .event-pill {
    gap: 5px;
    margin: 2px 0;
    padding: 4px 5px;
  }

  .event-pill__dot {
    display: none;
  }

  .event-pill__avatar {
    display: none;
  }

  .event-pill__primary {
    font-size: 0.62rem;
  }

  .event-pill__secondary {
    font-size: 0.58rem;
  }

  .event-pill--multi-day {
    border-radius: 0;
  }

  .event-pill--multi-day-start {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .event-pill--multi-day-end {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}
</style>
