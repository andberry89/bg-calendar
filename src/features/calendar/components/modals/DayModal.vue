<template>
  <BaseModal @update="closeDayModal" @close="closeDayModal">
    <div class="day-modal">
      <div class="day-modal__header">
        <h3 class="day-modal__title">{{ title }}</h3>
        <button class="day-modal__close" type="button" @click="closeDayModal">×</button>
      </div>

      <div v-if="events.length > 0" class="day-modal__content">
        <div class="day-modal__events">
          <button
            v-for="calendarEvent in events"
            :key="calendarEvent.id"
            class="day-modal__event"
            type="button"
            @click="selectEvent(calendarEvent)"
          >
            <div class="day-modal__event-main">
              <span v-if="calendarEvent.staff.length > 0" class="day-modal__event-staff-text">
                {{ getEventStaffSummary(calendarEvent) }}
              </span>
              <span class="day-modal__event-type">
                {{ getEventLabel(calendarEvent) }}
              </span>
              <span class="day-modal__event-dates">
                {{ formatEventDates(calendarEvent) }}
              </span>
            </div>

            <div
              v-if="calendarEvent.staff.length > 0"
              class="day-modal__event-aside"
              aria-hidden="true"
            >
              <span
                v-for="person in getVisibleStaff(calendarEvent)"
                :key="person.id"
                class="day-modal__event-avatar"
                :style="person.colorStyle"
              >
                <img :src="person.avatarSrc" :alt="person.shortName" />
              </span>
              <span
                v-if="getRemainingStaffCount(calendarEvent) > 0"
                class="day-modal__event-avatar day-modal__event-avatar--more"
              >
                +{{ getRemainingStaffCount(calendarEvent) }}
              </span>
            </div>
          </button>
        </div>

        <div v-if="selectedEvent" class="day-modal__details">
          <div class="day-modal__details-header">
            <button class="day-modal__details-close" type="button" @click="clearSelectedEvent">
              ×
            </button>
          </div>

          <div class="day-modal__details-identity" v-if="selectedEvent.staff.length > 0">
            <div class="day-modal__details-avatars" aria-hidden="true">
              <span
                v-for="person in getVisibleStaff(selectedEvent)"
                :key="person.id"
                class="day-modal__details-avatar"
                :style="person.colorStyle"
              >
                <img :src="person.avatarSrc" :alt="person.shortName" />
              </span>
              <span
                v-if="getRemainingStaffCount(selectedEvent) > 0"
                class="day-modal__details-avatar day-modal__details-avatar--more"
              >
                +{{ getRemainingStaffCount(selectedEvent) }}
              </span>
            </div>

            <div class="day-modal__details-staff-summary">
              {{ getEventStaffSummary(selectedEvent) }}
            </div>
          </div>

          <h4 class="day-modal__details-title">
            {{ selectedEventTitle }}
            {{ selectedEventEmoji }}
          </h4>

          <div class="day-modal__details-dates">
            {{ formatEventDates(selectedEvent) }}
          </div>

          <div
            v-if="selectedEvent.details && selectedEvent.class !== 'cd-event'"
            class="day-modal__details-copy"
          >
            {{ selectedEvent.details }}
          </div>

          <div v-if="selectedEvent.staff.length > 1" class="day-modal__details-staff-list">
            <ul class="day-modal__details-staff-items">
              <li v-for="person in selectedEvent.staff" :key="person.lastName">
                {{ person.shortName }}
              </li>
            </ul>
          </div>

          <div class="day-modal__details-actions">
            <button class="day-modal__edit" type="button" @click="openEditModal">Edit Event</button>

            <button class="day-modal__delete" type="button" @click="deleteEvent(selectedEvent)">
              Delete Event ✘
            </button>
          </div>
        </div>

        <div v-else class="day-modal__details day-modal__details--empty">
          <p>Click an event to view full details</p>
        </div>
      </div>

      <p v-else class="day-modal__empty">No events for this day.</p>
    </div>
    <EditEventModal
      v-if="showEditModal && selectedEvent"
      :event="selectedEvent"
      @cancel="cancelEditModal"
      @saved="saveEditModal"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { format } from 'date-fns';
import {} from '@/features/calendar/utils';
import BaseModal from '@/components/BaseModal.vue';
import EditEventModal from '@/features/calendar/components/modals/EditEventModal.vue';
import {
  getPersonColorStyle,
  getStaffAvatarUrl,
  formatEventDateRange,
  getStaffSummary
} from '@/features/calendar/utils';
import type { CalendarEvent, CurrentDate } from '@/types/calendar';
import { useStaffStore } from '@/stores/staff';

const props = defineProps<{
  currentDate: CurrentDate;
  date: number;
  day: number;
  events: CalendarEvent[];
}>();

const emit = defineEmits<{
  (e: 'update'): void;
  (e: 'delete', value: CalendarEvent): void;
}>();

const staffStore = useStaffStore();

const selectedEvent = ref<CalendarEvent | null>(null);

const showEditModal = ref(false);

const title = computed((): string => {
  return format(
    new Date(props.currentDate.year, props.currentDate.month, props.date),
    'MMMM d, yyyy'
  );
});

const selectedEventTitle = computed((): string => {
  if (!selectedEvent.value) {
    return '';
  }

  return selectedEvent.value.class === 'cd-event'
    ? selectedEvent.value.details
    : selectedEvent.value.type;
});

const selectedEventEmoji = computed((): string => {
  if (!selectedEvent.value) {
    return '';
  }

  return selectedEvent.value.class === 'birthday' ? '🎂' : '';
});

function closeDayModal(): void {
  showEditModal.value = false;
  selectedEvent.value = null;
  emit('update');
}

function selectEvent(event: CalendarEvent): void {
  selectedEvent.value = event;
}

function clearSelectedEvent(): void {
  selectedEvent.value = null;
}

function openEditModal(): void {
  if (!selectedEvent.value) {
    return;
  }

  showEditModal.value = true;
}

function cancelEditModal(): void {
  showEditModal.value = false;
}

function saveEditModal(): void {
  showEditModal.value = false;
  selectedEvent.value = null;
  emit('update');
}

function deleteEvent(event: CalendarEvent): void {
  emit('delete', event);
  closeDayModal();
}

function formatEventDates(event: CalendarEvent): string {
  return formatEventDateRange({
    start: event.start,
    end: event.end
  });
}

function getEventLabel(event: CalendarEvent): string {
  if (event.class === 'birthday') {
    return `${event.staff[0].shortName}'s Birthday 🎂`;
  }

  if (event.class === 'press-trip') {
    return 'Press Trip';
  }

  if (event.class === 'vacation') {
    return 'Vacation';
  }

  if (event.class === 'sick-time') {
    return 'Sick Time';
  }

  if (event.class === 'auto-show') {
    return `Auto Show: ${event.details}`;
  }

  if (event.class === 'cd-event') {
    return event.details;
  }

  if (event.class === 'holiday') {
    const closure =
      event.closed === 'full' ? 'Office Closed' : event.closed === 'half' ? 'Early Close' : '';

    return closure ? `${event.details} — ${closure}` : event.details;
  }

  return event.type;
}

interface StaffIdentity {
  id: string;
  shortName: string;
  avatarSrc: string;
  colorStyle: Record<string, string>;
}

function getStaffIdentityList(event: CalendarEvent): StaffIdentity[] {
  return event.staff.map((person) => ({
    id: person.id,
    shortName: person.shortName,
    avatarSrc: imgUrl(person.lastName),
    colorStyle: getStaffColorStyle(person.id)
  }));
}

function getVisibleStaff(event: CalendarEvent): StaffIdentity[] {
  return getStaffIdentityList(event).slice(0, 3);
}

function getRemainingStaffCount(event: CalendarEvent): number {
  return Math.max(event.staff.length - getVisibleStaff(event).length, 0);
}

function imgUrl(name: string): string {
  return getStaffAvatarUrl(name);
}

function getStaffColorStyle(staffId: string): Record<string, string> {
  const key = staffStore.staffColorKeyById[staffId];

  if (!key) {
    return getPersonColorStyle('person-1');
  }

  return getPersonColorStyle(key);
}
function getEventStaffSummary(event: CalendarEvent): string {
  return getStaffSummary(event.staff);
}
</script>

<style lang="scss" scoped>
.day-modal {
  position: relative;
  width: min(680px, calc(100vw - 24px));
  max-width: 680px;
  padding: 18px;
  box-sizing: border-box;
  background: transparent;
  color: var(--calendar-text);
  font:
    400 0.95rem/1.3 'Arial',
    sans-serif;
}

.day-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -2px -2px 14px;
  padding: 0 0 12px;
}

.day-modal__title {
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.day-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  min-height: 34px;
  padding: 0;
  border: 1px solid rgba(51, 65, 85, 0.22);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.92) 100%);
  color: #0f172a;
  font-size: 1rem;
  line-height: 1;
  box-shadow:
    0 6px 14px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(37, 99, 235, 0.3);
    background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(239, 246, 255, 0.96) 100%);
    box-shadow:
      0 10px 20px rgba(15, 23, 42, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.82);
  }
}

.day-modal__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 290px;
  gap: 14px;
  align-items: start;
  width: 100%;
}

.day-modal__events {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.day-modal__event {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
  color: #0f172a;
  text-align: left;
  box-shadow:
    0 8px 18px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
  cursor: pointer;
  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease,
    box-shadow 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(37, 99, 235, 0.28);
    background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(239, 246, 255, 0.96) 100%);
    box-shadow:
      0 12px 22px rgba(15, 23, 42, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.82);
  }
}

.day-modal__event-main {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.day-modal__event-staff-text {
  color: #334155;
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1.2;
}

.day-modal__event-type {
  color: #0f172a;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.25;
}

.day-modal__event-dates {
  color: var(--calendar-text-muted);
  font-size: 0.84rem;
  line-height: 1.2;
}

.day-modal__event-aside {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}

.day-modal__event-avatar,
.day-modal__details-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-left: -10px;
  overflow: hidden;
  border-radius: 999px;
  background: linear-gradient(
    var(--person-color-angle),
    var(--person-color-gradient-start),
    var(--person-color-gradient-end)
  );
  box-shadow:
    0 0 0 3px rgba(255, 255, 255, 0.12),
    0 10px 20px rgba(15, 23, 42, 0.14);
  flex: 0 0 42px;

  &:first-child {
    margin-left: 0;
  }

  img {
    display: block;
    width: calc(100% - 5px);
    height: calc(100% - 5px);
    border-radius: 999px;
    object-fit: cover;
  }
}

.day-modal__event-avatar--more,
.day-modal__details-avatar--more {
  background: linear-gradient(180deg, rgba(51, 65, 85, 0.92) 0%, rgba(71, 85, 105, 0.9) 100%);
  color: #f8fafc;
  font-size: 0.74rem;
  font-weight: 700;
  line-height: 1;
}

.day-modal__details {
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%);
  box-shadow:
    0 8px 18px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}

.day-modal__details--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
  text-align: center;
  color: var(--calendar-text-muted);
  opacity: 0.7;
  font-size: 0.9rem;
  border-style: dashed;
}

.day-modal__details-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.day-modal__details-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
  padding: 0;
  border: 1px solid rgba(51, 65, 85, 0.22);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 245, 249, 0.92) 100%);
  color: #0f172a;
  cursor: pointer;
}

.day-modal__details-identity {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.day-modal__details-avatars {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}

.day-modal__details-avatar {
  width: 54px;
  height: 54px;
  margin-left: -12px;
  flex-basis: 54px;

  img {
    width: calc(100% - 6px);
    height: calc(100% - 6px);
  }
}

.day-modal__details-avatar--more {
  font-size: 0.9rem;
}

.day-modal__details-staff-summary {
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;
}

.day-modal__details-avatars {
  margin-bottom: 2px;
}

.day-modal__details-title {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 1.08rem;
  line-height: 1.2;
}

.day-modal__details-dates {
  margin-bottom: 10px;
  color: var(--calendar-text-muted);
  font-size: 0.92rem;
  line-height: 1.3;
}

.day-modal__details-copy {
  margin-bottom: 12px;
  color: var(--calendar-text);
  font-size: 0.92rem;
  line-height: 1.4;
  white-space: pre-line;
}

.day-modal__details-staff-list {
  margin-bottom: 12px;
}

.day-modal__details-staff-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.day-modal__details-staff-items li {
  margin: 0;
  color: var(--calendar-text-muted);
  font-size: 0.88rem;
}

.day-modal__details-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.day-modal__edit {
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(37, 99, 235, 0.22);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(239, 246, 255, 0.96) 0%, rgba(219, 234, 254, 0.92) 100%);
  color: #1d4ed8;
  font: inherit;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease,
    box-shadow 0.16s ease,
    color 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(29, 78, 216, 0.34);
    background: linear-gradient(
      180deg,
      rgba(219, 234, 254, 0.98) 0%,
      rgba(191, 219, 254, 0.94) 100%
    );
    box-shadow:
      0 8px 18px rgba(37, 99, 235, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.62);
    color: #1e40af;
  }
}

.day-modal__delete {
  border: 0;
  background: transparent;
  color: #dc2626;
  font-weight: 600;
  cursor: pointer;
}

.day-modal__empty {
  margin: 0;
  color: var(--calendar-text-muted);
}

@media (max-width: 640px) {
  .day-modal {
    padding: 14px;
  }

  .day-modal__content {
    grid-template-columns: 1fr;
  }

  .day-modal__event {
    padding: 10px 12px;
  }

  .day-modal__event-avatar,
  .day-modal__details-avatar {
    width: 38px;
    height: 38px;
    margin-left: -9px;
    flex-basis: 38px;
  }

  .day-modal__details-avatar {
    width: 46px;
    height: 46px;
    flex-basis: 46px;
  }
}
</style>
