<template>
  <div class="edit-modal">
    <div class="slot-container">
      <slot></slot>
    </div>
    <div class="background-overlay" @click.self="emit('update')"></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';

const emit = defineEmits<{
  (e: 'update'): void;
}>();

let originalBodyOverflow = '';

onMounted((): void => {
  originalBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
});

onBeforeUnmount((): void => {
  document.body.style.overflow = originalBodyOverflow;
});
</script>

<style lang="scss" scoped>
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 4;

  .background-overlay {
    position: absolute;
    background-color: var(--black);
    opacity: 0.75;
    width: 100%;
    height: 100%;
  }
  .slot-container {
    display: inline-block;
    z-index: 5;
    max-height: 90%;
    overflow-y: auto;
    max-width: 95%;
  }
}
</style>
