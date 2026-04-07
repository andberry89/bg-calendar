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
          [`event-pill--shape-${pillShape}`]: true
        }
      ]"
    >
      <span
        v-if="showAvatar"
        class="event-pill__avatar"
        :class="{
          'event-pill__avatar--large': isSingleDay,
          'event-pill__avatar--xlarge': isSingleDay
        }"
      >
        <img
          v-if="avatarSrc"
          class="event-pill__avatar-image"
          :src="avatarSrc"
          :alt="`${avatarFallback} avatar`"
        />
        <span v-else class="event-pill__avatar-fallback">{{ avatarFallback }}</span>
      </span>
      <span v-else-if="!isHoliday" class="event-pill__dot" />
      <span class="event-pill__content">
        <span class="event-pill__primary-row">
          <span class="event-pill__primary">{{ primaryText }}</span>
          <span v-if="multiStaffCount > 0" class="event-pill__staff-count"
            >+{{ multiStaffCount }}</span
          >
        </span>
        <span v-if="secondaryText" class="event-pill__secondary">{{ secondaryText }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getEventTypeConfig } from '@/features/calendar/utils/eventTypeConfig';
import { getStaffAvatarUrl } from '@/features/calendar/utils/staffAvatars';
import type { AssignedCalendarEvent, CalendarEvent, Staff } from '@/types/calendar';

const { event } = defineProps<{
  event: CalendarEvent | AssignedCalendarEvent;
}>();

const emit = defineEmits<{
  (e: 'update', value: CalendarEvent | AssignedCalendarEvent): void;
}>();

function imgUrl(name: string): string {
  return getStaffAvatarUrl(name);
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
type EventPillShape = 'default' | 'single' | 'start' | 'middle' | 'end';

const isHoliday = computed((): boolean => event.class === 'holiday');

const assignedEvent = computed((): AssignedCalendarEvent | null => {
  if (!('display' in event) || typeof event.display !== 'object' || event.display === null) {
    return null;
  }

  return event as AssignedCalendarEvent;
});

const isMultiDay = computed((): boolean => {
  return assignedEvent.value?.display.isMultiDay === true;
});

const pillShape = computed((): EventPillShape => {
  const display = assignedEvent.value?.display;

  if (!display || display.isMultiDay !== true) {
    return 'default';
  }

  const startsToday = display.startsToday === true;
  const endsToday = display.endsToday === true;

  if (startsToday && endsToday) {
    return 'single';
  }

  if (startsToday) {
    return 'start';
  }

  if (endsToday) {
    return 'end';
  }

  return 'middle';
});

const leadStaff = computed((): StaffMember | undefined => event.staff[0]);

const multiStaffCount = computed((): number => {
  if (!event.staff.length) {
    return 0;
  }

  return showAvatar.value ? Math.max(event.staff.length - 1, 0) : event.staff.length;
});

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
    return getStaffAvatarUrl('user');
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

function getStaffDisplayName(): string {
  const staff = event.staff?.[0];

  if (!staff) {
    return 'Staff';
  }

  const firstName =
    (staff as Staff & { firstName?: string }).firstName?.trim() || staff.shortName?.trim() || '';

  const lastName = staff.lastName?.trim() || '';
  const lastInitial = lastName[0]?.toUpperCase() ?? '';

  if (!firstName) {
    return 'Staff';
  }

  return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
}

const primaryText = computed((): string => {
  switch (event.class) {
    case 'birthday':
      return `${getStaffDisplayName()} Birthday`;
    case 'press-trip':
    case 'vacation':
    case 'sick-time':
    case 'comp-day':
      return getStaffDisplayName();
    case 'auto-show':
      return 'Auto Show';
    case 'cd-event':
      return event.details || 'C/D Event';
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

const isSingleDay = computed((): boolean => {
  return assignedEvent.value?.display.isMultiDay !== true;
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
  align-items: stretch;
  gap: 2px;
  min-width: 0;
  width: 100%;
  margin: 2px 0;
  padding: 4px 4px;
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
  align-self: center;
  border-radius: 999px;
  background: var(--event-pill-color);
}

.event-pill__avatar {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--event-pill-color) 4%, white 96%);
  color: var(--event-pill-color);
}

.event-pill__avatar--large {
  width: 26px;
  height: 26px;
  flex: 0 0 26px;
}

.event-pill__avatar--xlarge {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
}

.event-pill__avatar-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.event-pill__avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font:
    700 0.62rem/1 Arial,
    sans-serif;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.event-pill__content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1px;
  min-width: 0;
  min-height: 0;
}

.event-pill__primary-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  width: 100%;
}

.event-pill__staff-count {
  flex: 0 0 auto;
  padding: 1px 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--event-pill-color) 12%, white 88%);
  color: var(--event-pill-color);
  font:
    700 0.58rem/1 Arial,
    sans-serif;
  letter-spacing: 0.01em;
}

.event-pill__primary,
.event-pill__secondary {
  display: block;
  min-width: 0;
  max-width: 100%;
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

.event-pill--auto-show .event-pill__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.event-pill--auto-show .event-pill__primary,
.event-pill--auto-show .event-pill__secondary {
  display: block;
  max-width: 100%;
  white-space: nowrap;
}

.event-pill--auto-show .event-pill__dot {
  display: none;
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

.event-pill--shape-default {
  border-radius: 10px;
}

.event-pill--multi-day.event-pill--shape-single {
  border-radius: 10px;
}

.event-pill--multi-day.event-pill--shape-start {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.event-pill--multi-day.event-pill--shape-middle {
  border-radius: 0;
  padding-left: 6px;
  padding-right: 6px;
}

.event-pill--multi-day.event-pill--shape-end {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

@media (max-width: 900px) {
  .event-pill {
    padding: 3px 4px;
    border-radius: 8px;
  }

  .event-pill__avatar {
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
  }

  .event-pill__avatar--large {
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
  }

  .event-pill__avatar--xlarge {
    width: 25px;
    height: 25px;
    flex: 0 0 25px;
  }

  .event-pill__primary {
    font-size: 0.66rem;
  }

  .event-pill__secondary {
    font-size: 0.62rem;
  }

  .event-pill--shape-default {
    border-radius: 8px;
  }

  .event-pill--multi-day.event-pill--shape-single {
    border-radius: 8px;
  }

  .event-pill--multi-day.event-pill--shape-start {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .event-pill--multi-day.event-pill--shape-end {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .event-pill__primary-row {
    gap: 4px;
  }

  .event-pill__staff-count {
    padding: 1px 5px;
    font-size: 0.54rem;
  }
}

@media (max-width: 640px) {
  .event-pill {
    gap: 2px;
    margin: 1px 0;
    padding: 2px 3px;
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

  .event-pill--shape-default {
    border-radius: 8px;
  }

  .event-pill--multi-day.event-pill--shape-single {
    border-radius: 8px;
  }

  .event-pill--multi-day.event-pill--shape-start {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .event-pill--multi-day.event-pill--shape-end {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .event-pill__primary-row {
    gap: 3px;
  }

  .event-pill__staff-count {
    padding: 1px 4px;
    font-size: 0.5rem;
  }
}
</style>
