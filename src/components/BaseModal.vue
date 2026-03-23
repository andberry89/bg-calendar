<template>
  <div class="base-modal">
    <div class="base-modal__content">
      <slot></slot>
    </div>
    <div class="base-modal__overlay" @click.self="emit('update')"></div>
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
.base-modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 4;

  .base-modal__overlay {
    position: absolute;
    background-color: var(--black);
    opacity: 0.75;
    width: 100%;
    height: 100%;
  }

  .base-modal__content {
    display: inline-block;
    z-index: 5;
    max-height: 90%;
    overflow-y: auto;
    max-width: 95%;
  }
}
</style>
