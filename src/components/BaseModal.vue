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
        <div class="base-modal__surface">
          <slot></slot>
        </div>
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
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.base-modal__overlay {
  position: absolute;
  inset: 0;
  background: var(--modal-overlay-background);
  backdrop-filter: blur(var(--modal-overlay-blur));
}

.base-modal__content {
  position: relative;
  z-index: 1;
  width: auto;
  max-width: min(95vw, 720px);
  max-height: calc(100vh - 24px);
  outline: none;
  display: flex;
}

.base-modal__surface {
  position: relative;
  overflow: auto;
  max-height: inherit;
  border: var(--modal-surface-border);
  border-radius: var(--modal-surface-radius);
  background: var(--modal-surface-background);
  box-shadow: var(--modal-surface-shadow);
}

.base-modal__surface::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: var(--modal-surface-highlight-height);
  background: var(--modal-surface-highlight-background);
  pointer-events: none;
}

@media (max-width: 640px) {
  .base-modal {
    padding: 12px;
    align-items: center;
  }

  .base-modal__content {
    width: 100%;
    max-width: calc(100vw - 24px);
    max-height: calc(100vh - 24px);
  }

  .base-modal__surface {
    border-radius: var(--modal-surface-radius-mobile);
    box-shadow: var(--modal-surface-shadow-mobile);
  }

  .base-modal__surface::before {
    height: var(--modal-surface-highlight-height-mobile);
  }
}
</style>
