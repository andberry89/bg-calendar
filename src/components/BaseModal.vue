<template>
  <Teleport to="body">
    <div class="base-modal">
      <div class="base-modal__overlay" @click.self="emit('update')"></div>
      <div class="base-modal__content">
        <slot></slot>
      </div>
    </div>
  </Teleport>
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
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .base-modal__overlay {
    position: absolute;
    inset: 0;
    background-color: var(--black);
    opacity: 0.75;
  }

  .base-modal__content {
    position: relative;
    z-index: 1;
    display: inline-block;
    max-height: 90vh;
    max-width: 95vw;
    overflow-y: auto;
  }
}
</style>
