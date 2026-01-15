<template>
  <div class="flex flex-col items-start gap-[5px]">
    <button class="staff-button" @click="toggleEditStaffForm('add')">
      Add Staff
    </button>

    <button class="staff-button" @click="toggleEditStaffForm('remove')">
      Remove Staff
    </button>

    <div class="mt-[15px]">
      <div v-if="showForm.add" class="flex flex-col gap-[3px]">
        <input
          type="text"
          placeholder="First Name"
          v-model="newStaff.firstName"
          ref="firstNameInput"
          class="border border-black/20 px-2 py-1 font-public"
        />
        <input
          type="text"
          placeholder="Last Name"
          v-model="newStaff.lastName"
          class="border border-black/20 px-2 py-1 font-public"
        />
        <button class="staff-button" @click="emitStaff('add')">
          Add {{ newStaff.firstName + " " + newStaff.lastName }}
        </button>
      </div>

      <div v-if="showForm.remove" class="flex flex-col gap-[5px]">
        <div
          v-for="(person, idx) in staff"
          :key="'staff-' + idx"
          @click="emitStaff(person)"
          class="flex items-center justify-between p-[3px] font-public text-[14px] leading-[1.2] bg-[linear-gradient(var(--ocean-red)_0_0)] bg-no-repeat [background-size:var(--p,0)_100%] [background-position:var(--bgpos,left)] transition-[background-size,color] duration-500 hover:[--p:100%] hover:[--bgpos:right] hover:text-[var(--white)] hover:cursor-pointer"
        >
          <div>
            {{ person.firstName + " " + person.lastName }}
          </div>
          <div class="text-[12px] text-[var(--white)]">
            Remove?
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from "vue";

export default {
  name: "EditStaff",
  data() {
    return {
      newStaff: {
        firstName: "",
        lastName: "",
      },
      showForm: {
        add: false,
        remove: false,
      },
    };
  },
  props: {
    staff: {
      type: Array,
      required: true,
    },
  },
  methods: {
    emitStaff(fn) {
      fn === "add" ? this.$emit("update", [fn, this.newStaff]) : this.$emit("update", ["remove", fn]);
      this.newStaff.firstName = "";
      this.newStaff.lastName = "";
      this.showForm.add = false;
      this.showForm.remove = false;
    },
    toggleEditStaffForm(form) {
      if (form === "add") {
        this.showForm.remove = false;
        this.showForm.add = !this.showForm.add;

        // Adds focus to the first name input when it is rendered
        if (this.showForm.add) {
          nextTick(() => {
            this.$refs.firstNameInput.focus();
          });
        }
      } else {
        this.showForm.add = false;
        this.showForm.remove = !this.showForm.remove;
      }
    },
  },
};
</script>