<template>
  <Teleport to="body">
    <div class="base-modal" @keydown.esc.prevent="requestClose">
      <div class="base-modal__overlay" @click="requestClose"></div>
      <div
        ref="contentRef"
        class="base-modal__content"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        @click.stop
      >
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update'): void;
}>();

const contentRef = ref<HTMLElement | null>(null);

let originalBodyOverflow = '';
let originalActiveElement: Element | null = null;

function requestClose(): void {
  emit('close');
  emit('update');
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') {
    return;
  }

  event.preventDefault();
  requestClose();
}

onMounted(async (): Promise<void> => {
  originalBodyOverflow = document.body.style.overflow;
  originalActiveElement = document.activeElement;

  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleKeydown);

  await nextTick();
  contentRef.value?.focus();
});

onBeforeUnmount((): void => {
  document.body.style.overflow = originalBodyOverflow;
  document.removeEventListener('keydown', handleKeydown);

  if (originalActiveElement instanceof HTMLElement) {
    originalActiveElement.focus();
  }
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
    outline: none;
  }
}
</style>
