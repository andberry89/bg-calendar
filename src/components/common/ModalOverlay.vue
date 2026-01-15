<template>
  <div class="fixed inset-0 z-[4] flex items-center justify-around">
    <div class="relative z-[5] inline-block max-h-[90%] max-w-[95%] overflow-y-auto">
      <slot></slot>
    </div>
    <div
      class="absolute inset-0 bg-[var(--black)] opacity-75"
      @click.self="$emit('update')"
    ></div>
  </div>
</template>
<script>
export default {
  name: "ModalOverlay",
};
</script>
