import type { DirectiveBinding, ObjectDirective } from "vue";

type ClickOutsideHandler = (event: MouseEvent | PointerEvent) => void;

type ClickOutsideEl = HTMLElement & {
  __clickOutsideHandler__?: (event: Event) => void;
};

interface ClickOutsideBinding extends DirectiveBinding {
  value: ClickOutsideHandler;
}

const ClickOutside: ObjectDirective<ClickOutsideEl, ClickOutsideHandler> = {
  mounted(el, binding: ClickOutsideBinding) {
    // Validate binding
    if (typeof binding.value !== "function") {
      console.warn("v-click-outside expects a function as the value");
      return;
    }

    el.__clickOutsideHandler__ = (event: Event) => {
      const target = event.target as Node | null;
      if (!target) return;

      // Ignore if click is inside the element
      if (el === target || el.contains(target)) return;

      binding.value(event as MouseEvent);
    };

    // Use capture phase so it works even if inner components stopPropagation
    document.addEventListener("click", el.__clickOutsideHandler__, true);
  },

  unmounted(el) {
    if (el.__clickOutsideHandler__) {
      document.removeEventListener("click", el.__clickOutsideHandler__, true);
      delete el.__clickOutsideHandler__;
    }
  },
};

export default ClickOutside;
