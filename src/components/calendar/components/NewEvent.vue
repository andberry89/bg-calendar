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
<script setup>
import { ref } from 'vue';
import { compareDesc, parse } from 'date-fns';
import Button from '@/components/common/Button.vue';
import { eventType } from '../utils/selectOptions';

defineProps({
  staff: Array
});

const emit = defineEmits(['update']);

const errors = ref([]);
const showErrMsg = ref(false);
const showForm = ref(false);

const newEvent = ref({
  class: '',
  closed: '',
  details: '',
  end: '',
  type: '',
  start: '',
  staff: []
});

function emitNewEvent() {
  errors.value = validateEvent(newEvent.value);

  if (errors.value.length > 0) {
    showErrMsg.value = true;
  } else {
    if (newEvent.value.type !== 'Holiday') {
      newEvent.value.closed = 'none';
    } else {
      newEvent.value.staff = [];
    }

    switch (newEvent.value.type) {
      case 'Auto Show':
        newEvent.value.class = 'auto-show';
        break;
      case 'Press Trip':
        newEvent.value.class = 'press-trip';
        break;
      case 'C/D Event':
        newEvent.value.class = 'cd-event';
        break;
      default:
        newEvent.value.class = newEvent.value.type.toLowerCase();
        break;
    }

    emit('update', { ...newEvent.value, staff: [...newEvent.value.staff] });
    resetNewEvent();
    showForm.value = false;
  }
}

function compareDates(val) {
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
      if (val === 'end') newEvent.value.end = newEvent.value.start;
      if (val === 'start') newEvent.value.start = newEvent.value.end;
    }
  }
}

function validateEvent(event) {
  const keys = Object.keys(event);
  const validationErrors = [];

  keys.forEach((k) => {
    if (
      k === 'staff' &&
      event[k].length === 0 &&
      event.type !== 'Holiday' &&
      event.type !== 'C/D Event'
    ) {
      validationErrors.push('Staff');
    }

    if (event[k] === '' || (k === 'staff' && event[k].length === 0)) {
      let error = k.charAt(0).toUpperCase() + k.slice(1);

      switch (error) {
        case 'Details':
          error = 'Event Details';
          break;
        case 'End':
          error = 'End Date';
          break;
        case 'Type':
          error = 'Event Type';
          break;
        case 'Start':
          error = 'Start Date';
          break;
        default:
          error = '';
          break;
      }

      if (error === 'Event Details' && event.type !== 'Vacation' && event.type !== 'Birthday') {
        validationErrors.push(error);
      } else if (error !== 'Event Details' && error !== '') {
        validationErrors.push(error);
      }
    }
  });

  return validationErrors;
}

function resetNewEvent() {
  newEvent.value = {
    class: '',
    closed: '',
    details: '',
    end: '',
    start: '',
    staff: [],
    type: ''
  };
  errors.value = [];
  showErrMsg.value = false;
}

function toggleForm() {
  showForm.value = !showForm.value;
}
</script>
<style lang="scss" scoped>
.new-event-container {
  position: relative;
  width: 25%;
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
