<template>
  <article id="staff-list">
    <div
      v-for="(s, idx) in staff"
      :key="idx"
      class="staff-card"
    >
      <div class="profile-picture">
        <img
          :src="require('@/assets/photos/' + s.lastName + '.jpg')"
          :alt="s.firstName + ' ' + s.lastName"
        />
      </div>
      <div class="staff-name">
        <span class="first-name">{{ s.firstName }}</span
        ><br />
        <span class="last-name">{{ s.lastName }}</span>
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
import EditStaff from "./subComponents/EditStaff.vue";

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
  },
};
</script>
<style lang="scss" scoped>
#staff-list {
  .staff-card {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;
    height: 70px;
    margin: 10px 0;

    .profile-picture {
      border-radius: 40%;
      border: 1px solid var(--black);
      overflow: hidden;
      position: relative;
      height: 75px;
      width: 75px;

      img {
        height: auto;
        width: 75px;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }

    .staff-name {
      font-family: "Arial";
      font-size: 14px;

      .last-name {
        font-size: 18px;
        font-weight: 700;
      }
    }
  }
}
</style>
