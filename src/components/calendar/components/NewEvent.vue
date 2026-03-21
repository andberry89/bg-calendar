<template>
  <div class="new-event-container">
    <Button @click="toggleForm">New Event</Button>
    <Transition name="drop-form">
      <div v-if="showForm" class="new-event-form-container">
        <div class="new-event-form">
          <label for="eventType">Event Type</label>
          <select name="eventType" id="eventType" v-model="newEvent.type">
            <option disabled value="Event Type">--Event Type--</option>
            <option v-for="(event, idx) in eventType" :key="'event-' + idx" :value="event">
              {{ event }}
            </option>
          </select>
          <div class="holiday-options" v-if="newEvent.type === 'Holiday'">
            <span class="office-closure-label">Office Closed?</span>
            <label> <input type="radio" value="full" v-model="newEvent.closed" />Full Day </label>
            <label> <input type="radio" value="half" v-model="newEvent.closed" />Half Day </label>
            <label>
              <input type="radio" value="none" v-model="newEvent.closed" />Office Open
            </label>
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
          <label for="startDate">{{ newEvent.type === 'Birthday' ? '' : 'Start' }} Date</label>
          <input
            type="date"
            v-model="newEvent.start"
            name="startDate"
            id="startDate"
            @input="compareDates('end')"
          />
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
          <ul v-if="newEvent.type !== 'Holiday'">
            <li v-for="(s, idx) in staff" :key="'staff-' + idx">
              <input
                type="checkbox"
                :id="'staff-' + idx"
                :name="'staff-' + idx"
                :value="s"
                v-model="newEvent.staff"
              /><label :for="'staff' + idx">{{ s.shortName }}</label>
            </li>
          </ul>
          <button class="submit-event-button" @click="emitNewEvent">Add Event</button>
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
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { compareDesc, parse } from 'date-fns';
import Button from '@/components/common/Button.vue';
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

defineProps<{
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
    case 'Holiday':
      return 'holiday';
    case 'Birthday':
      return 'birthday';
  }
}

function emitNewEvent(): void {
  errors.value = validateEvent(newEvent.value);

  if (errors.value.length > 0) {
    showErrMsg.value = true;
    return;
  }

  if (!newEvent.value.type) {
    return;
  }

  const normalizedEvent: NewCalendarEvent = {
    ...newEvent.value,
    closed: newEvent.value.type !== 'Holiday' ? 'none' : newEvent.value.closed || 'none',
    staff: newEvent.value.type === 'Holiday' ? [] : [...newEvent.value.staff],
    class: getEventClass(newEvent.value.type),
    type: newEvent.value.type
  };

  emit('update', normalizedEvent);
  resetNewEvent();
  showForm.value = false;
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

  if (
    !event.details &&
    event.type !== 'Vacation' &&
    event.type !== 'Birthday' &&
    event.type !== ''
  ) {
    validationErrors.push('Event Details');
  }

  if (
    event.staff.length === 0 &&
    event.type !== 'Holiday' &&
    event.type !== 'C/D Event' &&
    event.type !== ''
  ) {
    validationErrors.push('Staff');
  }

  return validationErrors;
}

function resetNewEvent(): void {
  newEvent.value = createEmptyEvent();
  errors.value = [];
  showErrMsg.value = false;
}

function toggleForm(): void {
  showForm.value = !showForm.value;
}
</script>
<style lang="scss" scoped>
.new-event-container {
  position: relative;
  width: fit-content;
  max-width: 100%;
  font:
    400 1rem/1 'Arial',
    sans-serif;
  text-shadow: none;
  color: var(--black);

  .drop-form-enter-active,
  .drop-form-leave-active {
    transition: all 0.5s ease;
  }

  .drop-form-enter-from,
  .drop-form-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  .new-event-form-container {
    position: absolute;
    top: 70px;
    right: 18px;
    border: 1px solid var(--white);
    background-color: var(--ocean-lt-blue);
    padding: 15px 30px 15px 10px;
    text-align: left;
    z-index: 99;

    .new-event-form {
      .holiday-options {
        margin-bottom: 4px;
        background-color: var(--ocean-md-blue);
        padding: 2px;
        border-radius: 4px;

        .office-closure-label {
          font-size: 14px;
        }

        input {
          cursor: pointer;
        }
      }

      label {
        font-size: 0.7rem;
        font-weight: 700;
        display: block;
      }
      input,
      select {
        margin-bottom: 5px;
      }
      ul {
        padding: 0;
        list-style: none;
        margin: 0;

        li {
          display: flex;
          align-items: center;

          label {
            display: inline;
          }
        }
      }
      button {
        margin-top: 5px;
      }

      .err-msg {
        font:
          700 12px/1.1 'Arial',
          sans-serif;
        color: var(--red);
        margin-top: 10px;

        ul {
          font-weight: 400;
          list-style: disc;
          margin-top: 2px;
        }
      }
    }
  }
}
</style>
