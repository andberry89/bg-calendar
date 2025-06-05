<template>
  <div
    :class="['event-modal', day < 4 ? 'right' : 'left']"
    v-click-outside="closeModal"
  >
    <ModalOverlay
      v-if="showEdit"
      @update="closeEdit"
      >EDIT MODAL</ModalOverlay
    >
    <div
      class="close-btn"
      @click="closeModal"
    >
      X
    </div>
    <div class="event-header">
      <div class="event-name">
        <span class="event-type"
          >{{ event.class === "cd-event" ? event.details : event.type }}
          {{ event.class === "Birthday" ? "🎂" : "" }}</span
        >
      </div>
      <div class="event-dates">
        {{ eventDates }}
      </div>
      <div
        class="event-staff"
        v-if="event.staff.length > 0"
      >
        <p
          v-for="person in event.staff"
          :key="person.lastName"
        >
          {{ person.shortName }}
        </p>
      </div>
    </div>
    <div class="event-options">
      <span @click="openEdit">Edit Event &#x270E;</span>
      <span @click="deleteEvent">Delete Event &#x2718;</span>
    </div>
  </div>
</template>
<script>
import { format, parseISO } from "date-fns";
import ModalOverlay from "../common/ModalOverlay.vue";

export default {
  name: "EventModal",
  data() {
    return {
      showEdit: false,
    };
  },
  components: {
    ModalOverlay,
  },
  props: {
    day: {
      type: Number,
      required: true,
    },
    event: {
      type: Object,
      required: true,
    },
  },
  computed: {
    eventDates() {
      // We use the .replace regex so the format method does not subtract a day
      const startDate = new Date(this.event.start.replace(/-/g, "/"));
      const start = this.format(startDate, "MM/dd/yyyy");
      if (this.event.start === this.event.end) {
        return start;
      } else {
        const endDate = new Date(this.event.end.replace(/-/g, "/"));
        const end = this.format(endDate, "MM/dd/yyyy");
        return start + " - " + end;
      }
    },
  },
  methods: {
    format: format,
    parseISO: parseISO,
    closeEdit() {
      this.showEdit = false;
    },
    closeModal() {
      this.$emit("update");
    },
    deleteEvent() {
      this.$emit("delete", this.event);
    },
    openEdit() {
      this.showEdit = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.event-modal {
  position: absolute;
  text-align: left;
  width: 275px;
  top: -25px;
  z-index: 99;
  background-color: var(--light-gray);
  color: var(--black);
  padding: 12px 8px 4px;
  border: 1px solid var(--black);
  border-radius: 8px;
  font: 400 0.9rem/1 "Arial", sans-serif;

  div {
    margin: 5px 0;
  }

  .close-btn {
    position: absolute;
    padding: 3px 6px;
    border-radius: 10px;
    border: 1px solid var(--black);
    background-color: var(--ocean-event-detail);
    transition: 0.2s;
    top: -15px;
    left: -12px;

    &:hover {
      background-color: var(--white);
      border-color: var(--black);
      color: var(--black);
      cursor: pointer;
    }
  }

  .event-header {
    .event-name {
      font-weight: 700;
      font-size: 1rem;
      border-bottom: 1px solid var(--black);

      .event-type {
        font-weight: 400;
      }
    }

    .event-staff {
      p {
        margin: 0;
      }
    }
  }

  .event-options {
    border-top: 1px solid var(--black);
    margin-top: 35px;
    padding-top: 5px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    font-size: 0.8rem;

    span {
      display: inline-block;
      transition: 0.2s;

      &:hover {
        color: var(--ocean-event-detail);
        cursor: pointer;
      }
    }
  }
}
.left {
  right: 25%;
}
.right {
  left: 25%;
}
</style>
