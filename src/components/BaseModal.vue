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
  background:
    radial-gradient(circle at top, rgba(96, 165, 250, 0.12) 0%, rgba(96, 165, 250, 0) 34%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.38) 0%, rgba(15, 23, 42, 0.64) 100%);
  backdrop-filter: blur(10px);
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
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(248, 250, 252, 0.96) 100%);
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.28),
    0 10px 24px rgba(15, 23, 42, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.base-modal__surface::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 96px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
    linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(45, 212, 191, 0.14) 100%);
  pointer-events: none;
}

.base-modal__surface::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.32);
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
    border-radius: 16px;
    box-shadow:
      0 18px 40px rgba(15, 23, 42, 0.26),
      0 8px 18px rgba(15, 23, 42, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.64);
  }

  .base-modal__surface::before {
    height: 72px;
  }
}
</style>
