<template>
  <div class="new-event-container">
    <Button @click="toggleForm">New Event</Button>
    <Transition name="drop-form">
      <div
        v-if="showForm"
        class="new-event-form-container"
      >
        <div class="new-event-form">
          <label for="eventType">Event Type</label>
          <select
            name="eventType"
            id="eventType"
            v-model="newEvent.type"
          >
            <option
              disabled
              value="Event Type"
            >
              --Event Type--
            </option>
            <option
              v-for="(event, idx) in eventType"
              :key="'event-' + idx"
              :value="event"
            >
              {{ event }}
            </option>
          </select>
          <div
            class="holiday-options"
            v-if="this.newEvent.type === 'Holiday'"
          >
            <span class="office-closure-label">Office Closed?</span>
            <label>
              <input
                type="radio"
                value="full"
                v-model="newEvent.closed"
              />Full Day
            </label>
            <label>
              <input
                type="radio"
                value="half"
                v-model="newEvent.closed"
              />Half Day
            </label>
            <label>
              <input
                type="radio"
                value="none"
                v-model="newEvent.closed"
              />Office Open
            </label>
          </div>
          <label for="details">Event Details</label>
          <input
            type="text"
            placeholder="Details"
            v-model="newEvent.details"
            name="details"
            id="details"
          />
          <label for="startDate">Start Date</label>
          <input
            type="date"
            v-model="newEvent.start"
            name="startDate"
            id="startDate"
            @input="compareDates('end')"
          />
          <label for="endDate">End Date</label>
          <input
            type="date"
            v-model="newEvent.end"
            name="endDate"
            id="endDate"
            @input="compareDates('start')"
          />
          <ul v-if="this.newEvent.type !== 'Holiday'">
            <li
              v-for="(s, idx) in staff"
              :key="'staff-' + idx"
            >
              <input
                type="checkbox"
                :id="'staff-' + idx"
                :name="'staff-' + idx"
                :value="s"
                v-model="newEvent.staff"
              /><label :for="'staff' + idx">{{ s.shortName }}</label>
            </li>
          </ul>
          <button
            class="submit-event-button"
            @click="emitNewEvent"
          >
            Add Event
          </button>
          <div
            class="err-msg"
            v-if="showErrMsg"
          >
            This is not a valid event!<br />
            Make sure to check the following:
            <ul>
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
      }
    },
    compareDates(val) {
      if (this.newEvent.end === "") {
        this.newEvent.end = this.newEvent.start;
      } else if (this.newEvent.start === "") {
        this.newEvent.start = this.newEvent.end;
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
          if (error !== "" && event.type !== "Vacation" && event.type !== "Birthday") errors.push(error);
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
<style lang="scss" scoped>
.new-event-container {
  position: relative;
  width: 25%;
  font: 400 1rem/1 "Arial", sans-serif;
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
        font: 700 12px/1.1 "Arial", sans-serif;
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
