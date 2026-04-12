<template>
  <BaseModal @update="closeModal" @close="closeModal">
    <div class="event-modal">
      <button class="close-btn" type="button" aria-label="Close event details" @click="closeModal">
        ×
      </button>

      <div class="event-header">
        <div class="event-header__identity" v-if="event.staff.length > 0">
          <div class="event-header__avatars" aria-hidden="true">
            <span
              v-for="person in visibleStaff"
              :key="person.id"
              class="event-header__avatar"
              :style="person.colorStyle"
            >
              <img :src="person.avatarSrc" :alt="person.shortName" />
            </span>

            <span
              v-if="remainingStaffCount > 0"
              class="event-header__avatar event-header__avatar--more"
            >
              +{{ remainingStaffCount }}
            </span>
          </div>

          <div class="event-header__staff">
            {{ leadStaffSummary }}
          </div>
        </div>

        <div class="event-meta">
          <div class="event-name">
            <span class="event-type">
              {{ eventTitle }}
              {{ eventEmoji }}
            </span>
          </div>

          <div class="event-dates">
            {{ eventDates }}
          </div>
        </div>

        <div v-if="event.details && event.class !== 'cd-event'" class="event-details">
          {{ event.details }}
        </div>
      </div>

      <div v-if="event.staff.length > 1" class="event-staff-list">
        <div class="event-staff-list__label">Staff</div>
        <ul class="event-staff-list__items">
          <li v-for="person in event.staff" :key="person.id" class="event-staff-list__item">
            {{ person.firstName }} {{ person.lastName }}
          </li>
        </ul>
      </div>

      <div class="event-options">
        <div v-if="isConfirmingDelete" class="delete-confirmation">
          <p class="delete-confirmation-text">Delete this event?</p>

          <div class="delete-confirmation-actions">
            <button class="cancel-btn" type="button" @click="cancelDelete">Cancel</button>
            <button class="delete-btn" type="button" @click="confirmDelete">Delete</button>
          </div>
        </div>

        <div v-else class="event-actions">
          <button class="edit-btn" type="button" @click="openEditModal">Edit Event</button>

          <button class="delete-btn" type="button" @click="startDeleteConfirmation">
            Delete Event ✘
          </button>
        </div>
      </div>
    </div>
    <EditEventModal
      v-if="showEditModal"
      :event="event"
      @cancel="cancelEditModal"
      @saved="saveEditModal"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatEventDateRange } from '@/features/calendar/utils/formatEventDates';
import BaseModal from '@/components/BaseModal.vue';
import EditEventModal from '@/features/calendar/components/modals/EditEventModal.vue';
import {
  getPersonColorStyle,
  getStaffAvatarUrl,
  getStaffSummary,
  getEventDisplayContent
} from '@/features/calendar/utils';
import type { CalendarEvent } from '@/types/calendar';
import { useStaffStore } from '@/stores/staff';

const { event } = defineProps<{
  day: number;
  event: CalendarEvent;
}>();

const emit = defineEmits<{
  (e: 'update'): void;
  (e: 'delete', value: CalendarEvent): void;
}>();

const staffStore = useStaffStore();

const isConfirmingDelete = ref(false);
const showEditModal = ref(false);

interface VisibleStaffIdentity {
  id: string;
  shortName: string;
  avatarSrc: string;
  colorStyle: Record<string, string>;
}

const visibleStaff = computed((): VisibleStaffIdentity[] => {
  return event.staff.slice(0, 3).map((person) => ({
    id: person.id,
    shortName: person.shortName,
    avatarSrc: imgUrl(person.lastName),
    colorStyle: getStaffColorStyle(person.id)
  }));
});

const remainingStaffCount = computed((): number => {
  return Math.max(event.staff.length - visibleStaff.value.length, 0);
});

const leadStaffSummary = computed((): string => {
  return getStaffSummary(event.staff);
});

const eventDates = computed((): string => {
  return formatEventDateRange({
    start: event.start,
    end: event.end
  });
});

const eventDisplay = computed(() => {
  return getEventDisplayContent(event, {
    staffDisplayName: event.staff[0] ? leadStaffSummary.value : undefined
  });
});

const eventTitle = computed((): string => {
  return eventDisplay.value.primary;
});

const eventEmoji = computed((): string => {
  return eventDisplay.value.emoji;
});

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

function closeModal(): void {
  isConfirmingDelete.value = false;
  emit('update');
}

function openEditModal(): void {
  showEditModal.value = true;
}

function cancelEditModal(): void {
  showEditModal.value = false;
}

function saveEditModal(): void {
  showEditModal.value = false;
  emit('update');
}

function startDeleteConfirmation(): void {
  isConfirmingDelete.value = true;
}

function cancelDelete(): void {
  isConfirmingDelete.value = false;
}

function confirmDelete(): void {
  emit('delete', event);
}
</script>

<style lang="scss" scoped>
.event-modal {
  position: relative;
  width: min(380px, calc(100vw - 24px));
  max-width: calc(100vw - 24px);
  min-height: 200px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 26px 18px 18px;
  background: transparent;
  color: var(--calendar-text);
  text-align: left;
  font:
    400 0.95rem/1.35 'Arial',
    sans-serif;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
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

.event-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 36px;
  padding-right: 46px;
}

.event-header__identity {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
}

.event-header__avatars {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  min-width: 0;
}

.event-header__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-left: -14px;
  overflow: hidden;
  border-radius: 999px;
  background: linear-gradient(
    var(--person-color-angle),
    var(--person-color-gradient-start),
    var(--person-color-gradient-end)
  );
  box-shadow:
    0 0 0 4px rgba(255, 255, 255, 0.1),
    0 14px 28px rgba(15, 23, 42, 0.18);
  flex: 0 0 64px;

  &:first-child {
    margin-left: 0;
  }

  img {
    display: block;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    border-radius: 999px;
    object-fit: cover;
  }
}

.event-header__avatar--more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(51, 65, 85, 0.92) 0%, rgba(71, 85, 105, 0.9) 100%);
  color: #f8fafc;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
}

.event-header__staff {
  color: #0f172a;
  font-size: 1.08rem;
  font-weight: 700;
  line-height: 1.2;
}

.event-meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.event-meta .event-name {
  min-width: 0;
  flex: 1 1 auto;
}

.event-meta .event-dates {
  flex: 0 0 auto;
  text-align: right;
}

.event-name {
  color: #0f172a;
  font-size: 1.18rem;
  font-weight: 700;
  line-height: 1.2;
}

.event-type {
  font-weight: 700;
}

.event-dates {
  color: var(--calendar-text-muted);
  font-size: 0.95rem;
  line-height: 1.3;
}

.event-details {
  color: var(--calendar-text);
  font-size: 0.95rem;
  line-height: 1.4;
  white-space: pre-line;
}

.event-staff-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-staff-list__label {
  color: var(--calendar-text-muted);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.event-staff-list__items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.event-staff-list__item {
  color: #0f172a;
  font-size: 0.96rem;
  line-height: 1.3;
}

.event-options {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.event-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}

.edit-btn {
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

.delete-confirmation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 260px;
  margin-left: auto;
  margin-right: auto;
  padding: 14px 16px;
  border: 1px solid rgba(239, 68, 68, 0.22);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(254, 242, 242, 0.96) 0%, rgba(255, 255, 255, 0.94) 100%);
  box-shadow:
    0 10px 24px rgba(127, 29, 29, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.delete-confirmation-text {
  margin: 0;
  color: #7f1d1d;
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
}

.delete-confirmation-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

.cancel-btn {
  flex: 1 1 0;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(148, 163, 184, 0.32);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: #334155;
  font: inherit;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background 0.16s ease,
    color 0.16s ease,
    transform 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(100, 116, 139, 0.4);
    background: rgba(248, 250, 252, 1);
    color: #0f172a;
  }
}

.delete-btn {
  border: 0;
  background: transparent;
  color: #dc2626;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.16s ease;

  &:hover {
    color: #b91c1c;
  }
}

.delete-confirmation-actions .delete-btn {
  flex: 1 1 0;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(220, 38, 38, 0.96) 0%, rgba(185, 28, 28, 0.96) 100%);
  color: #fff;
  font-weight: 700;
  line-height: 1;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    background 0.16s ease,
    border-color 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    color: #fff;
    border-color: rgba(185, 28, 28, 0.32);
    background: linear-gradient(180deg, rgba(239, 68, 68, 0.98) 0%, rgba(220, 38, 38, 0.98) 100%);
    box-shadow: 0 8px 18px rgba(185, 28, 28, 0.18);
  }
}

@media (max-width: 640px) {
  .event-modal {
    width: min(380px, calc(100vw - 16px));
    max-width: calc(100vw - 16px);
    min-height: 0;
    padding: 22px 14px 14px;
    gap: 16px;
  }

  .close-btn {
    top: 4px;
    right: 16px;
    min-width: 36px;
    min-height: 36px;
  }

  .event-header {
    padding-top: 24px;
    padding-right: 44px;
  }

  .event-header__identity {
    gap: 8px;
  }

  .event-header__avatars {
    min-width: 0;
  }

  .event-header__avatar {
    width: 54px;
    height: 54px;
    margin-left: -12px;
    flex-basis: 54px;

    img {
      width: calc(100% - 5px);
      height: calc(100% - 5px);
    }
  }

  .event-header__staff {
    font-size: 0.98rem;
    line-height: 1.2;
  }

  .event-name {
    font-size: 1.06rem;
  }

  .event-dates {
    font-size: 0.88rem;
  }

  .event-staff-list__item {
    font-size: 0.92rem;
  }

  .event-details {
    font-size: 0.9rem;
  }

  .event-meta {
    flex-direction: column;
    gap: 6px;
  }

  .event-meta .event-dates {
    text-align: left;
  }

  .delete-confirmation {
    max-width: none;
    width: 100%;
  }

  .delete-confirmation-actions {
    width: 100%;
  }
}
</style>
