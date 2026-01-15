<template>
  <article id="staff-list" class="font-['Arial',_sans-serif] text-[12px] leading-[1.2]">
    <h2>Staff List</h2>

    <div
      v-for="(s, idx) in staff"
      :key="idx"
      class="my-[10px] flex h-[70px] flex-row items-center gap-[10px]
             overflow-hidden border-[2px] border-[var(--black)]
             bg-[#bafca2] p-[5px]
             hover:bg-[#90ee90]"
    >
      <div class="relative h-[60px] w-[60px] overflow-hidden border-[2px] border-[var(--black)]">
        <img
          :src="imgUrl(s.lastName)"
          :alt="s.firstName + ' ' + s.lastName"
          class="absolute left-0 bottom-0 w-[60px] h-auto"
        />
      </div>

      <div class="font-['Arial'] text-[12px]">
        <span>{{ s.firstName }}</span><br />
        <span class="text-[14px] font-bold">{{ s.lastName }}</span>
      </div>
    </div>

    <hr />

    <EditStaff
      :staff="staff"
      key="edit-staff"
      @update="emitStaff($event)"
    />
  </article>
</template>

<script>
import EditStaff from "./components/EditStaff.vue";

export default {
  name: "StaffList",
  props: {
    staff: Array,
  },
  components: {
    EditStaff,
  },
  methods: {
    emitStaff(staffFn) {
      this.$emit("update", staffFn);
    },
    imgUrl(name) {
      const images = require.context("@/assets/staff", false, /\.(jpg|png)$/);
      console.log(images);
      try {
        return images(`./${name}.jpg`);
      } catch (e) {
        return images("./user.png");
      }
    },
  },
};
</script>
