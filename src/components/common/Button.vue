<template>
  <button
    type="button"
    class="px-5 py-2 rounded-[8px] font-anton text-2xl font-normal leading-snug cursor-pointer transition-colors duration-200 btn-primary"
  >
    <slot />
  </button>
</template>
<script>
export default {
  name: "Button",
};
</script>