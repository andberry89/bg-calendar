<template>
  <div class="event-form">
    <label for="eventType">Event Type</label>
    <select id="eventType" v-model="localEvent.type" @change="emitModelValue">
      <option disabled value="">--Event Type--</option>
      <option v-for="option in eventType" :key="option" :value="option">
        {{ option }}
      </option>
    </select>

    <div v-if="eventReminder" class="event-form__reminder">
      {{ eventReminder.message }}
      <a :href="eventReminder.linkHref" target="_blank" rel="noopener noreferrer">
        {{ eventReminder.linkLabel }}
      </a>
    </div>

    <div v-if="localEvent.type === 'Holiday'" class="event-form__holiday-options">
      <span class="event-form__section-label">Office Closed?</span>
      <label>
        <input v-model="localEvent.closed" type="radio" value="full" @change="emitModelValue" />
        Full Day
      </label>
      <label>
        <input v-model="localEvent.closed" type="radio" value="half" @change="emitModelValue" />
        Half Day
      </label>
      <label>
        <input v-model="localEvent.closed" type="radio" value="none" @change="emitModelValue" />
        Office Open
      </label>
    </div>

    <div v-if="localEvent.type !== 'Birthday'" class="event-form__field">
      <label for="details">Event Details</label>
      <input
        id="details"
        v-model="localEvent.details"
        type="text"
        placeholder="Details"
        :disabled="isFieldDisabled('details')"
        @input="emitModelValue"
      />
    </div>

    <div
      class="event-form__date-fields"
      :class="{ 'event-form__date-fields--single': localEvent.type === 'Birthday' }"
    >
      <div class="event-form__field">
        <label for="startDate">{{ localEvent.type === 'Birthday' ? 'Date' : 'Start Date' }}</label>
        <input id="startDate" v-model="localEvent.start" type="date" @input="compareDates('end')" />
      </div>

      <div v-if="localEvent.type !== 'Birthday'" class="event-form__field">
        <label for="endDate">End Date</label>
        <input id="endDate" v-model="localEvent.end" type="date" @input="compareDates('start')" />
      </div>
    </div>

    <ul v-if="localEvent.type !== 'Holiday'" class="event-form__staff-list">
      <li v-for="person in staff" :key="person.id" class="event-form__staff-item">
        <input
          :id="`staff-${person.id}`"
          v-model="localEvent.staff"
          type="checkbox"
          :value="person"
          :disabled="isFieldDisabled('staff')"
          @change="emitModelValue"
        />
        <label :for="`staff-${person.id}`">{{ person.shortName }}</label>
      </li>
    </ul>

    <div v-if="showErrors" class="event-form__error">
      This is not a valid event!
      <ul>
        <li v-for="error in errors" :key="error">
          {{ error }}
        </li>
      </ul>
    </div>

    <div class="event-form__actions">
      <button
        type="button"
        class="event-form__button event-form__button--secondary"
        @click="emitCancel"
      >
        Cancel
      </button>
      <button
        type="button"
        class="event-form__button event-form__button--primary"
        @click="submitForm"
      >
        {{ submitLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { eventType } from '@/features/calendar/utils/selectOptions';
import { getSpecialDayReminder } from '@/features/calendar/utils/eventRules';
import {
  createNewCalendarEvent,
  type DraftCalendarEventInput
} from '@/features/calendar/utils/eventCreation';
import { syncEventDates, type DateSyncTarget } from '@/features/calendar/utils/eventDateSync';
import { validateEvent, getRequiredEventFields } from '@/features/calendar/utils/eventValidation';
import type { NewCalendarEvent, Staff } from '@/types/calendar';

const props = withDefaults(
  defineProps<{
    modelValue: DraftCalendarEventInput;
    staff: Staff[];
    submitLabel?: string;
  }>(),
  {
    submitLabel: 'Save'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: DraftCalendarEventInput): void;
  (e: 'submit', value: NewCalendarEvent): void;
  (e: 'cancel'): void;
}>();

const localEvent = ref<DraftCalendarEventInput>({
  ...props.modelValue,
  staff: [...props.modelValue.staff]
});

const errors = ref<string[]>([]);
const showErrors = ref(false);

const eventReminder = computed(() => getSpecialDayReminder(localEvent.value.type));

const requiredFields = computed(() =>
  localEvent.value.type ? new Set(getRequiredEventFields(localEvent.value.type)) : new Set()
);

function emitModelValue(): void {
  emit('update:modelValue', {
    ...localEvent.value,
    staff: [...localEvent.value.staff]
  });
}

function isFieldDisabled(field: 'details' | 'staff'): boolean {
  return !!localEvent.value.type && !requiredFields.value.has(field);
}

function compareDates(target: DateSyncTarget): void {
  const syncedDates = syncEventDates({
    start: localEvent.value.start,
    end: localEvent.value.end,
    type: localEvent.value.type,
    target
  });

  localEvent.value.start = syncedDates.start;
  localEvent.value.end = syncedDates.end;
  emitModelValue();
}

function submitForm(): void {
  showErrors.value = false;
  errors.value = validateEvent(localEvent.value);

  if (errors.value.length > 0 || !localEvent.value.type) {
    showErrors.value = true;
    return;
  }

  emit('submit', createNewCalendarEvent(localEvent.value));
}

function emitCancel(): void {
  showErrors.value = false;
  errors.value = [];
  emit('cancel');
}
</script>

<style scoped lang="scss">
.event-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.event-form label {
  display: block;
  margin-bottom: 6px;
  color: #334155;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.event-form input,
.event-form select {
  width: 100%;
  min-height: 38px;
  margin: 0;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid rgba(148, 163, 184, 0.55);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%);
  color: #0f172a;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 1px 2px rgba(15, 23, 42, 0.04);
  font:
    400 0.95rem/1.2 'Arial',
    sans-serif;
}

.event-form__field {
  display: flex;
  flex-direction: column;
}

.event-form__reminder {
  padding: 10px 12px;
  border: 1px solid rgba(37, 99, 235, 0.18);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(239, 246, 255, 0.92) 0%, rgba(224, 242, 254, 0.86) 100%);
  color: #0f172a;
  font-size: 0.8rem;
  line-height: 1.35;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.66);
}

.event-form__reminder a {
  margin-left: 6px;
  color: #1d4ed8;
  font-weight: 700;
  text-decoration: underline;
}

.event-form__holiday-options {
  padding: 10px 12px;
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(45, 212, 191, 0.82) 100%);
  color: var(--white);
  box-shadow:
    0 12px 24px rgba(37, 99, 235, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}

.event-form__section-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.event-form__holiday-options label {
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

.event-form__holiday-options input {
  width: auto;
  margin: 0;
  box-shadow: none;
  cursor: pointer;
}

.event-form__date-fields {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
}

.event-form__date-fields--single {
  grid-template-columns: minmax(0, 1fr);
}

.event-form__staff-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: min(420px, calc(100vh - 360px));
  overflow-y: auto;
}

.event-form__staff-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  border: 1px solid rgba(148, 163, 184, 0.34);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.92) 100%);
  box-shadow:
    0 8px 18px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.74);
}

.event-form__staff-item label {
  display: inline;
  margin-bottom: 0;
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}

.event-form__staff-item input {
  width: auto;
  min-height: auto;
  margin: 0;
  padding: 0;
  box-shadow: none;
}

.event-form__error {
  padding: 10px 12px;
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(254, 242, 242, 0.98) 0%, rgba(254, 226, 226, 0.9) 100%);
  color: #b91c1c;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
  font:
    700 12px/1.35 'Arial',
    sans-serif;
}

.event-form__error ul {
  margin-top: 6px;
  margin-left: 18px;
  list-style: disc;
  font-weight: 400;
}

.event-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.event-form__button {
  min-height: 36px;
  padding: 8px 14px;
  border-radius: 999px;
  font:
    600 0.8rem/1 Arial,
    sans-serif;
  cursor: pointer;
}

.event-form__button--secondary {
  border: 1px solid rgba(148, 163, 184, 0.32);
  background: rgba(255, 255, 255, 0.88);
  color: #334155;
}

.event-form__button--primary {
  border: 1px solid rgba(37, 99, 235, 0.3);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.94) 0%, rgba(45, 212, 191, 0.82) 100%);
  color: #f8fafc;
}

@media (max-width: 640px) {
  .event-form {
    gap: 12px;
  }

  .event-form__date-fields {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .event-form input,
  .event-form select {
    min-height: 36px;
    font-size: 0.9rem;
  }

  .event-form__staff-list {
    max-height: 220px;
  }

  .event-form__staff-item {
    padding: 8px 9px;
  }

  .event-form__button {
    min-height: 34px;
    padding: 7px 12px;
    font-size: 0.74rem;
  }
}
</style>
