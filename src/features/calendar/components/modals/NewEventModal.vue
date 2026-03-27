<template>
  <div class="new-event-container">
    <Button @click="openForm">New Event</Button>

    <BaseModal v-if="showForm" @update="closeForm" @close="closeForm">
      <div class="new-event-modal">
        <div class="new-event-modal__header">
          <h3 class="new-event-modal__title">New Event</h3>
          <button class="new-event-modal__close" type="button" @click="closeForm">×</button>
        </div>

        <div class="new-event-form">
          <label for="eventType">Event Type</label>
          <select name="eventType" id="eventType" v-model="newEvent.type">
            <option disabled value="">--Event Type--</option>
            <option v-for="(event, idx) in eventType" :key="'event-' + idx" :value="event">
              {{ event }}
            </option>
          </select>

          <div v-if="eventReminder" class="event-reminder">
            {{ eventReminder.message }}
            <a :href="eventReminder.linkHref" target="_blank" rel="noopener noreferrer">
              {{ eventReminder.linkLabel }}
            </a>
          </div>

          <div class="holiday-options" v-if="newEvent.type === 'Holiday'">
            <span class="office-closure-label">Office Closed?</span>
            <label><input type="radio" value="full" v-model="newEvent.closed" />Full Day</label>
            <label><input type="radio" value="half" v-model="newEvent.closed" />Half Day</label>
            <label><input type="radio" value="none" v-model="newEvent.closed" />Office Open</label>
          </div>

          <div class="details-div" v-if="newEvent.type !== 'Birthday'">
            <label for="details">Event Details</label>
            <input
              type="text"
              placeholder="Details"
              v-model="newEvent.details"
              name="details"
              id="details"
              :disabled="isFieldDisabled('details')"
            />
          </div>

          <div class="date-fields" :class="{ 'date-fields--single': newEvent.type === 'Birthday' }">
            <div class="start-date-div">
              <label for="startDate">{{
                newEvent.type === 'Birthday' ? 'Date' : 'Start Date'
              }}</label>
              <input
                type="date"
                v-model="newEvent.start"
                name="startDate"
                id="startDate"
                @input="compareDates('end')"
              />
            </div>

            <div class="end-date-div" v-if="newEvent.type !== 'Birthday'">
              <label for="endDate">End Date</label>
              <input
                type="date"
                v-model="newEvent.end"
                name="endDate"
                id="endDate"
                @input="compareDates('start')"
              />
            </div>
          </div>

          <ul v-if="newEvent.type !== 'Holiday'">
            <li v-for="(s, idx) in staff" :key="'staff-' + idx">
              <input
                type="checkbox"
                :id="'staff-' + idx"
                :name="'staff-' + idx"
                :value="s"
                v-model="newEvent.staff"
                :disabled="isFieldDisabled('staff')"
              />
              <label :for="'staff-' + idx">{{ s.shortName }}</label>
            </li>
          </ul>

          <button class="submit-event-button" type="button" @click="emitNewEvent">Add Event</button>

          <div class="err-msg" v-if="showErrMsg">
            This is not a valid event!<br />
            Make sure to check the following:
            <ul>
              <li v-for="error in errors" :key="error">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/Button.vue';
import BaseModal from '@/components/BaseModal.vue';
import { eventType } from '@/features/calendar/utils/selectOptions';
import { getSpecialDayReminder } from '@/features/calendar/utils/eventRules';
import {
  createNewCalendarEvent,
  type DraftCalendarEventInput
} from '@/features/calendar/utils/eventCreation';
import { syncEventDates, type DateSyncTarget } from '@/features/calendar/utils/eventDateSync';
import { validateEvent, getRequiredEventFields } from '@/features/calendar/utils/eventValidation';
import type { NewCalendarEvent, Staff } from '@/types/calendar';

const { staff } = defineProps<{
  staff: Staff[];
}>();

const emit = defineEmits<{
  (e: 'update', value: NewCalendarEvent): void;
}>();

const errors = ref<string[]>([]);
const showErrMsg = ref(false);
const showForm = ref(false);

const createEmptyEvent = (): DraftCalendarEventInput => ({
  class: '',
  closed: '',
  details: '',
  end: '',
  type: '',
  start: '',
  staff: []
});

const newEvent = ref<DraftCalendarEventInput>(createEmptyEvent());

const eventReminder = computed(() => getSpecialDayReminder(newEvent.value.type));

const requiredFields = computed(() =>
  newEvent.value.type ? new Set(getRequiredEventFields(newEvent.value.type)) : new Set()
);

function isFieldDisabled(field: 'details' | 'staff'): boolean {
  return !!newEvent.value.type && !requiredFields.value.has(field);
}

function emitNewEvent(): void {
  const event = newEvent.value;

  showErrMsg.value = false;
  errors.value = validateEvent(event);

  if (errors.value.length > 0 || !event.type) {
    showErrMsg.value = true;
    return;
  }

  emit('update', createNewCalendarEvent(event));
  closeForm();
}

function compareDates(target: DateSyncTarget): void {
  const syncedDates = syncEventDates({
    start: newEvent.value.start,
    end: newEvent.value.end,
    type: newEvent.value.type,
    target
  });

  newEvent.value.start = syncedDates.start;
  newEvent.value.end = syncedDates.end;
}

function resetNewEvent(): void {
  newEvent.value = createEmptyEvent();
  errors.value = [];
  showErrMsg.value = false;
}

function openForm(): void {
  resetNewEvent();
  showForm.value = true;
}

function closeForm(): void {
  resetNewEvent();
  showForm.value = false;
}
</script>

<style lang="scss" scoped>
.new-event-container {
  display: inline-flex;
  width: auto;
  max-width: max-content;
  font:
    400 1rem/1 'Arial',
    sans-serif;
  color: var(--black);
  text-shadow: none;
}

.new-event-modal {
  position: relative;
  width: min(560px, calc(100vw - 24px));
  max-width: 560px;
  box-sizing: border-box;
  padding: 18px;
  color: var(--calendar-text);
  background: transparent;
}

.new-event-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -2px -2px 14px;
  padding: 0 0 12px;
}

.new-event-modal__title {
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
}

.new-event-modal__close {
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

.new-event-form {
  display: flex;
  flex-direction: column;
  gap: 14px;

  label {
    display: block;
    margin-bottom: 6px;
    color: #334155;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .event-reminder {
    padding: 10px 12px;
    border: 1px solid rgba(37, 99, 235, 0.18);
    border-radius: 12px;
    background: linear-gradient(
      180deg,
      rgba(239, 246, 255, 0.92) 0%,
      rgba(224, 242, 254, 0.86) 100%
    );
    color: #0f172a;
    font-size: 0.8rem;
    line-height: 1.35;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.66);

    a {
      margin-left: 6px;
      color: #1d4ed8;
      font-weight: 700;
      text-decoration: underline;
    }
  }

  input,
  select {
    width: 100%;
    min-height: 38px;
    margin: 0;
    box-sizing: border-box;
    padding: 8px 10px;
    border: 1px solid rgba(148, 163, 184, 0.55);
    border-radius: 10px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.98) 0%,
      rgba(248, 250, 252, 0.96) 100%
    );
    color: #0f172a;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.72),
      0 1px 2px rgba(15, 23, 42, 0.04);
    font:
      400 0.95rem/1.2 'Arial',
      sans-serif;
  }

  .holiday-options {
    padding: 10px 12px;
    border: 1px solid rgba(37, 99, 235, 0.2);
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(45, 212, 191, 0.82) 100%);
    color: var(--white);
    box-shadow:
      0 12px 24px rgba(37, 99, 235, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);

    .office-closure-label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    label {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
      color: var(--white);
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0;
      text-transform: none;
    }

    input {
      width: auto;
      margin: 0;
      box-shadow: none;
      cursor: pointer;
    }
  }

  .details-div {
    display: flex;
    flex-direction: column;
  }

  .date-fields {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 12px;
  }

  .date-fields--single {
    grid-template-columns: minmax(0, 1fr);
  }

  .start-date-div,
  .end-date-div {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  ul {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
    max-height: min(420px, calc(100vh - 360px));
    overflow-y: auto;
  }

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 10px;
    border: 1px solid rgba(148, 163, 184, 0.34);
    border-radius: 12px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.96) 0%,
      rgba(248, 250, 252, 0.92) 100%
    );
    box-shadow:
      0 8px 18px rgba(15, 23, 42, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.74);

    label {
      display: inline;
      margin-bottom: 0;
      color: #0f172a;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0;
      text-transform: none;
    }

    input {
      width: auto;
      min-height: auto;
      margin: 0;
      padding: 0;
      box-shadow: none;
    }
  }

  .submit-event-button {
    align-self: flex-start;
    margin-top: 4px;
  }

  .err-msg {
    padding: 10px 12px;
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 12px;
    background: linear-gradient(
      180deg,
      rgba(254, 242, 242, 0.98) 0%,
      rgba(254, 226, 226, 0.9) 100%
    );
    color: #b91c1c;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
    font:
      700 12px/1.35 'Arial',
      sans-serif;

    ul {
      margin-top: 6px;
      margin-left: 18px;
      list-style: disc;
      max-height: none;
      overflow: visible;
      font-weight: 400;
    }
  }
}

@media (max-width: 640px) {
  .new-event-modal {
    padding: 14px;
  }

  .new-event-modal__header {
    margin-bottom: 12px;
    padding-bottom: 10px;
  }

  .new-event-form {
    gap: 12px;

    .date-fields {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    input,
    select {
      min-height: 36px;
      font-size: 0.9rem;
    }

    ul {
      max-height: 220px;
    }

    li {
      padding: 8px 9px;
    }
  }
}
</style>
