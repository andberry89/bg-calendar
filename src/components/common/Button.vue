<template>
  <button type="button">
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: "Button",
};
</script>
<style lang="scss" scoped>
button {
  padding: 8px 20px;
  border-radius: 8px;
  font: 400 24px/1.2 "Anton", sans-serif;
  cursor: pointer;
  background-color: var(--ocean-md-blue);
  color: var(--white);
  transition: 0.2s;

  &:hover {
    background-color: var(--ocean-dark-gray);
  }
}
</style>
