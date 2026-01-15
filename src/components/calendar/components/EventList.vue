<template>
  <div class="font-['Arial',_sans-serif] text-[14px] leading-[1.2]">
    <h2>Events for {{ month[currentDate.month] }} {{ currentDate.year }}</h2>

    <ul class="list-none p-0 m-0">
      <li
        v-for="(event, idx) in events"
        :key="'event-' + idx"
        class="my-[10px] rounded-[5px] border border-[var(--dark-gray)]
               bg-[#fdfd96] px-[10px] pt-[5px] pb-[10px]
               drop-shadow-[4px_4px_rgba(0,0,0,0.7)]
               hover:bg-[#ffd858]"
      >
        <span class="inline-block font-bold text-[#333] my-[5px]">
          {{ event.start.split("-").slice(1).join("/") }}
          {{ event.start !== event.end ? " - " + event.end.split("-").slice(1).join("/") + " " : " " }}
        </span>
        <br />

        <span>
          {{ eventTitle(event) }}
        </span>
        <br />

        <span
          v-if="event.type === 'Holiday'"
          class="italic text-[#888]"
        >
          {{ holidayDetails(event) }}
        </span>

        <span class="italic text-[#666]">
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
    holidayDetails(event) {
      if (event.closed === "none") {
        return "";
      } else if (event.closed === "full") {
        return "Office closed";
      } else if (event.closed === "half") {
        return "Early close";
      }
      return "";
    },
  },
};
</script>