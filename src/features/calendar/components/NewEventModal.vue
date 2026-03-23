<template>
  <div class="new-event-container">
    <Button @click="openForm">New Event</Button>

    <BaseModal v-if="showForm" @update="closeForm">
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
import { ref } from 'vue';
import { compareDesc, parse } from 'date-fns';
import Button from '@/components/Button.vue';
import BaseModal from '@/components/BaseModal.vue';
import { eventType } from '../utils/selectOptions';
import type {
  EventClass,
  EventType,
  HolidayClosure,
  NewCalendarEvent,
  Staff
} from '@/types/calendar';

type CompareTarget = 'start' | 'end';

interface DraftCalendarEvent {
  class: EventClass | '';
  closed: HolidayClosure;
  details: string;
  end: string;
  type: EventType | '';
  start: string;
  staff: Staff[];
}

const { staff } = defineProps<{
  staff: Staff[];
}>();

const emit = defineEmits<{
  (e: 'update', value: NewCalendarEvent): void;
}>();

const errors = ref<string[]>([]);
const showErrMsg = ref(false);
const showForm = ref(false);

const createEmptyEvent = (): DraftCalendarEvent => ({
  class: '',
  closed: '',
  details: '',
  end: '',
  type: '',
  start: '',
  staff: []
});

const newEvent = ref<DraftCalendarEvent>(createEmptyEvent());

function getEventClass(type: EventType): EventClass {
  switch (type) {
    case 'Auto Show':
      return 'auto-show';
    case 'Press Trip':
      return 'press-trip';
    case 'C/D Event':
      return 'cd-event';
    case 'Vacation':
      return 'vacation';
    case 'Sick Time':
      return 'sick-time';
    case 'Holiday':
      return 'holiday';
    case 'Birthday':
      return 'birthday';
  }
}

function emitNewEvent(): void {
  const event = newEvent.value;

  showErrMsg.value = false;
  errors.value = validateEvent(event);

  if (errors.value.length > 0 || !event.type) {
    showErrMsg.value = true;
    return;
  }

  const normalizedEvent: NewCalendarEvent = {
    ...event,
    closed: event.type === 'Holiday' ? event.closed || 'none' : 'none',
    staff: event.type === 'Holiday' ? [] : [...event.staff],
    class: getEventClass(event.type),
    type: event.type
  };

  emit('update', normalizedEvent);
  closeForm();
}

function compareDates(target: CompareTarget): void {
  if (newEvent.value.end === '') {
    newEvent.value.end = newEvent.value.start;
  } else if (newEvent.value.start === '') {
    newEvent.value.start = newEvent.value.end;
  } else if (newEvent.value.type === 'Birthday') {
    newEvent.value.end = newEvent.value.start;
  } else {
    const startDate = parse(newEvent.value.start, 'yyyy-MM-dd', new Date());
    const endDate = parse(newEvent.value.end, 'yyyy-MM-dd', new Date());
    const result = compareDesc(startDate, endDate);

    if (result < 0) {
      if (target === 'end') newEvent.value.end = newEvent.value.start;
      if (target === 'start') newEvent.value.start = newEvent.value.end;
    }
  }
}

function validateEvent(event: DraftCalendarEvent): string[] {
  const validationErrors: string[] = [];

  if (!event.type) {
    validationErrors.push('Event Type');
  }

  if (!event.start) {
    validationErrors.push('Start Date');
  }

  if (!event.end) {
    validationErrors.push('End Date');
  }

  const requiresDetails =
    event.type &&
    event.type !== 'Vacation' &&
    event.type !== 'Sick Time' &&
    event.type !== 'Birthday';

  if (requiresDetails && !event.details) {
    validationErrors.push('Event Details');
  }

  const requiresStaff = event.type && event.type !== 'Holiday' && event.type !== 'C/D Event';

  if (requiresStaff && event.staff.length === 0) {
    validationErrors.push('Staff');
  }

  return validationErrors;
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
  text-shadow: none;
  color: var(--black);
}

.new-event-modal {
  position: relative;
  width: min(560px, calc(100vw - 24px));
  max-width: 560px;
  background-color: var(--light-gray);
  color: var(--black);
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
}

.new-event-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.new-event-modal__title {
  margin: 0;
  font-size: 1.15rem;
}

.new-event-modal__close {
  border: 1px solid var(--black);
  background-color: var(--white);
  color: var(--black);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 1rem;
  cursor: pointer;
}

.new-event-form {
  label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  input,
  select {
    width: 100%;
    min-height: 36px;
    margin: 0;
    box-sizing: border-box;
    padding: 6px 8px;
    border: 1px solid var(--ocean-slate-blue);
    border-radius: 6px;
    background-color: var(--white);
    color: var(--black);
    font:
      400 0.95rem/1.2 'Arial',
      sans-serif;
  }
  display: flex;
  flex-direction: column;
  gap: 12px;

  .holiday-options {
    margin-bottom: 8px;
    background-color: var(--ocean-md-blue);
    color: var(--white);
    padding: 8px;
    border-radius: 8px;

    .office-closure-label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 700;
    }

    label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      font-weight: 400;
      margin-bottom: 4px;
    }

    input {
      width: auto;
      margin: 0;
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
    padding: 0;
    list-style: none;
    margin: 0;
    max-height: 220px;
    overflow-y: auto;
  }

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border: 1px solid var(--ocean-slate-blue);
    border-radius: 8px;
    background-color: var(--white);

    label {
      display: inline;
      margin-bottom: 0;
      font-size: 0.9rem;
      font-weight: 400;
    }

    input {
      width: auto;
      min-height: auto;
      margin: 0;
      padding: 0;
    }
  }

  .submit-event-button {
    align-self: flex-start;
    margin-top: 4px;
  }

  .err-msg {
    padding: 10px 12px;
    border: 1px solid var(--red);
    border-radius: 8px;
    background-color: var(--white);
    font:
      700 12px/1.3 'Arial',
      sans-serif;
    color: var(--red);

    ul {
      font-weight: 400;
      list-style: disc;
      margin-top: 6px;
      margin-left: 18px;
      max-height: none;
      overflow: visible;
    }
  }
}

@media (max-width: 640px) {
  .new-event-modal {
    padding: 12px;
  }

  .new-event-form {
    gap: 10px;

    .date-fields {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    input,
    select {
      min-height: 34px;
      font-size: 0.9rem;
    }

    li {
      padding: 7px 9px;
    }
  }
}
</style>
