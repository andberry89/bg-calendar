<template>
  <div class="events-list">
    <h2>Events for {{ month[currentDate.month] }} {{ currentDate.year }}</h2>
    <ul>
      <li
        v-for="(event, idx) in events"
        :key="'event-' + idx"
      >
        <span class="event-date"
          >{{ event.start.split("-").slice(1).join("/") }}
          {{ event.start !== event.end ? " - " + event.end.split("-").slice(1).join("/") + " " : " " }}</span
        ><br />
        <span class="event-type">{{ eventTitle(event) }}</span
        ><br />
        <span class="event-staff">
          <span
            v-for="(s, sIdx) in event.staff"
            :key="'staff-' + sIdx"
          >
            {{ s.shortName }}<span v-if="sIdx < event.staff.length - 1">, </span>
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
//TODO: Style the event list
import { month } from "@/components/calendar/utils/selectOptions";

export default {
  name: "EventList",
  data() {
    return {
      month: month,
    };
  },
  props: {
    currentDate: {
      type: Object,
      required: true,
    },
    events: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    eventTitle(event) {
      if (event.type === "C/D Event" || event.type === "Holiday") {
        return event.details;
      } else {
        return event.type;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.events-list {
  font: 400 14px/1.2 "Arial", sans-serif;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin: 10px 0;
      background: #ffffff;
      background: linear-gradient(180deg, rgba(255, 255, 255, 1) 80%, rgba(39, 76, 119, 0.75) 100%);
      border: 1px solid var(--dark-gray);
      border-radius: 5px;
      padding: 5px 10px 10px;
      .event-date {
        font-weight: bold;
        color: #333;
      }
      .event-staff {
        font-style: italic;
        color: #666;
      }
    }
  }
}
</style>
