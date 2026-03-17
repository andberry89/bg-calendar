<template>
  <div class="events-list">
    <h2>Events for {{ month[currentDate.month] }} {{ currentDate.year }}</h2>
    <ul>
      <li v-for="(event, idx) in events" :key="'event-' + idx">
        <span class="event-date"
          >{{ event.start.split('-').slice(1).join('/') }}
          {{
            event.start !== event.end ? ' - ' + event.end.split('-').slice(1).join('/') + ' ' : ' '
          }}</span
        ><br />
        <span class="event-type">{{ eventTitle(event) }}</span
        ><br />
        <span v-if="event.type === 'Holiday'" class="holiday-details">
          {{ holidayDetails(event) }}
        </span>
        <span class="event-staff">
          <span v-for="(s, sIdx) in event.staff" :key="'staff-' + sIdx">
            {{ s.shortName }}<span v-if="sIdx < event.staff.length - 1">, </span>
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { month } from '@/components/calendar/utils/selectOptions';

defineProps({
  currentDate: {
    type: Object,
    required: true
  },
  events: {
    type: Array,
    required: true
  }
});

function eventTitle(event) {
  if (event.type === 'C/D Event' || event.type === 'Holiday') {
    return event.details;
  }

  return event.type;
}

function holidayDetails(event) {
  if (event.closed === 'none') {
    return '';
  }

  if (event.closed === 'full') {
    return 'Office closed';
  }

  if (event.closed === 'half') {
    return 'Early close';
  }

  return '';
}
</script>
<style lang="scss" scoped>
.events-list {
  font:
    400 14px/1.2 'Arial',
    sans-serif;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin: 10px 0;
      background: #fdfd96;
      border: 1px solid var(--dark-gray);
      border-radius: 5px;
      padding: 5px 10px 10px;
      filter: drop-shadow(4px 4px rgba(0, 0, 0, 0.7));

      &:hover {
        background: #ffd858;
      }

      .holiday-details {
        font-style: italic;
        color: #888;
      }
      .event-date {
        display: inline-block;
        font-weight: bold;
        color: #333;
        margin: 5px 0;
      }
      .event-staff {
        font-style: italic;
        color: #666;
      }
    }
  }
}
</style>
