<template>
  <button type="button">
    <slot></slot>
  </button>
</template>
<script></script>
<style lang="scss" scoped>
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  max-width: 100%;
  padding: 8px 18px;
  border-radius: 8px;
  font:
    400 1.125rem/1.1 'Anton',
    sans-serif;
  white-space: nowrap;
  cursor: pointer;
  background-color: var(--ocean-md-blue);
  color: var(--white);
  transition: 0.2s;

  &:hover {
    background-color: var(--ocean-dark-gray);
  }
}

@media (max-width: 900px) {
  button {
    padding: 7px 16px;
    font-size: 1rem;
  }
}

@media (max-width: 640px) {
  button {
    padding: 6px 14px;
    font-size: 0.95rem;
  }
}

@media (max-width: 360px) {
  button {
    padding: 5px 12px;
    font-size: 0.9rem;
  }
}
</style>
