<template>
  <article id="staff-list">
    <h2>Staff List</h2>
    <div
      v-for="(s, idx) in staff"
      :key="idx"
      class="staff-card"
    >
      <div class="profile-picture">
        <img
          :src="imgUrl(s.lastName)"
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
      // Use require.context to dynamically load images from the staff folder
      const images = require.context("@/assets/staff", false, /\.(jpg|png)$/);
      console.log(images);
      try {
        return images(`./${name}.jpg`);
      } catch (e) {
        // Return a fallback image if not found
        return images("./user.png");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#staff-list {
  font: 400 14px/1.2 "Arial", sans-serif;

  .staff-card {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 10px;
    height: 70px;
    background-color: #bafca2;
    border: 2px solid var(--black);
    overflow: hidden;
    margin: 10px 0;
    padding: 10px 5px;

    &:hover {
      background-color: #90ee90;
    }

    .profile-picture {
      overflow: hidden;
      position: relative;
      height: 75px;
      width: 75px;
      border: 2px solid var(--black);

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
