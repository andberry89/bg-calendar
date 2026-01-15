<template>
  <div class="relative w-1/4 font-['Arial',_sans-serif] text-[1rem] leading-[1] text-[var(--black)] [text-shadow:none]">
    <Button @click="toggleForm">New Event</Button>

    <Transition name="drop-form">
      <div
        v-if="showForm"
        class="absolute top-[70px] right-[18px] z-[99]
               border border-[var(--white)] bg-[var(--ocean-lt-blue)]
               pt-[15px] pr-[30px] pb-[15px] pl-[10px]
               text-left"
      >
        <div>
          <label for="eventType" class="block text-[0.7rem] font-bold">Event Type</label>
          <select
            name="eventType"
            id="eventType"
            v-model="newEvent.type"
            class="mb-[5px]"
          >
            <option disabled value="Event Type">--Event Type--</option>
            <option
              v-for="(event, idx) in eventType"
              :key="'event-' + idx"
              :value="event"
            >
              {{ event }}
            </option>
          </select>

          <div
            v-if="this.newEvent.type === 'Holiday'"
            class="mb-[4px] rounded-[4px] bg-[var(--ocean-md-blue)] p-[2px]"
          >
            <span class="text-[14px]">Office Closed?</span>

            <label class="block text-[0.7rem] font-bold">
              <input
                class="cursor-pointer"
                type="radio"
                value="full"
                v-model="newEvent.closed"
              />
              Full Day
            </label>

            <label class="block text-[0.7rem] font-bold">
              <input
                class="cursor-pointer"
                type="radio"
                value="half"
                v-model="newEvent.closed"
              />
              Half Day
            </label>

            <label class="block text-[0.7rem] font-bold">
              <input
                class="cursor-pointer"
                type="radio"
                value="none"
                v-model="newEvent.closed"
              />
              Office Open
            </label>
          </div>

          <div v-if="this.newEvent.type !== 'Birthday'">
            <label for="details" class="block text-[0.7rem] font-bold">Event Details</label>
            <input
              type="text"
              placeholder="Details"
              v-model="newEvent.details"
              name="details"
              id="details"
              class="mb-[5px]"
            />
          </div>

          <label for="startDate" class="block text-[0.7rem] font-bold">
            {{ this.newEvent.type === "Birthday" ? "" : "Start" }} Date
          </label>
          <input
            type="date"
            v-model="newEvent.start"
            name="startDate"
            id="startDate"
            @input="compareDates('end')"
            class="mb-[5px]"
          />

          <div v-if="this.newEvent.type !== 'Birthday'">
            <label for="endDate" class="block text-[0.7rem] font-bold">End Date</label>
            <input
              type="date"
              v-model="newEvent.end"
              name="endDate"
              id="endDate"
              @input="compareDates('start')"
              class="mb-[5px]"
            />
          </div>

          <ul v-if="this.newEvent.type !== 'Holiday'" class="m-0 list-none p-0">
            <li
              v-for="(s, idx) in staff"
              :key="'staff-' + idx"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="'staff-' + idx"
                :name="'staff-' + idx"
                :value="s"
                v-model="newEvent.staff"
              />
              <label
                :for="'staff' + idx"
                class="inline text-[0.7rem] font-bold"
              >
                {{ s.shortName }}
              </label>
            </li>
          </ul>

          <button
            class="mt-[5px]"
            @click="emitNewEvent"
          >
            Add Event
          </button>

          <div
            v-if="showErrMsg"
            class="mt-[10px] font-['Arial',_sans-serif] text-[12px] font-bold leading-[1.1] text-[var(--red)]"
          >
            This is not a valid event!<br />
            Make sure to check the following:
            <ul class="mt-[2px] list-disc font-normal">
              <li
                v-for="error in errors"
                :key="error"
              >
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import Button from "@/components/common/Button.vue";
import { eventType } from "../utils/selectOptions";
import { compareDesc, parse } from "date-fns";

export default {
  name: "NewEvent",
  data() {
    return {
      eventType: eventType,
      isValidEvent: false,
      newEvent: {
        class: "",
        closed: "",
        details: "",
        end: "",
        type: "",
        start: "",
        staff: [],
      },
      errors: [],
      showErrMsg: false,
      showForm: false,
    };
  },
  props: {
    staff: Array,
  },
  components: {
    Button,
  },
  methods: {
    compareDesc: compareDesc,
    parse: parse,
    emitNewEvent() {
      this.errors = this.validateEvent(this.newEvent);

      if (this.errors.length > 0) {
        this.showErrMsg = true;
      } else {
        if (this.newEvent.type !== "Holiday") {
          this.newEvent.closed = "none";
        } else {
          this.newEvent.staff = [];
        }

        switch (this.newEvent.type) {
          case "Auto Show":
            this.newEvent.class = "auto-show";
            break;
          case "Press Trip":
            this.newEvent.class = "press-trip";
            break;
          case "C/D Event":
            this.newEvent.class = "cd-event";
            break;
          default:
            this.newEvent.class = this.newEvent.type.toLowerCase();
            break;
        }
        this.$emit("update", this.newEvent);
        this.resetNewEvent();
        this.showForm = false;
      }
    },
    compareDates(val) {
      if (this.newEvent.end === "") {
        this.newEvent.end = this.newEvent.start;
      } else if (this.newEvent.start === "") {
        this.newEvent.start = this.newEvent.end;
      } else if (this.newEvent.type === "Birthday") {
        this.newEvent.end = this.newEvent.start;
      } else {
        const startDate = parse(this.newEvent.start, "yyyy-MM-dd", new Date());
        const endDate = parse(this.newEvent.end, "yyyy-MM-dd", new Date());
        const result = compareDesc(startDate, endDate);
        if (result < 0) {
          if (val === "end") this.newEvent.end = this.newEvent.start;
          if (val === "start") this.newEvent.start = this.newEvent.end;
        }
      }
    },
    validateEvent(event) {
      const keys = Object.keys(event);
      let errors = [];

      keys.forEach((k) => {
        if (k === "staff" && event[k].length === 0 && event.type !== "Holiday" && event.type !== "C/D Event") {
          console.log("Staff is required for this event type.");
          errors.push("Staff");
        }

        if (event[k] === "" || event === []) {
          let error = k.charAt(0).toUpperCase() + k.slice(1);
          switch (error) {
            case "Details":
              error = "Event Details";
              break;
            case "End":
              error = "End Date";
              break;
            case "Type":
              error = "Event Type";
              break;
            case "Start":
              error = "Start Date";
              break;
            default:
              error = "";
              break;
          }
          if (error === "Event Details" && event.type !== "Vacation" && event.type !== "Birthday") {
            errors.push(error);
          } else if (error !== "Event Details" && error !== "") {
            errors.push(error);
          }
        }
      });

      return errors;
    },
    resetNewEvent() {
      this.newEvent = {
        class: "",
        closed: "",
        details: "",
        end: "",
        start: "",
        staff: [],
        type: "",
      };
      this.errors = [];
      this.showErrMsg = false;
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
  },
};
</script>
<style>
.drop-form-enter-active,
.drop-form-leave-active {
  transition: all 0.5s ease;
}

.drop-form-enter-from,
.drop-form-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
