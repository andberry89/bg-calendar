import type { Directive, DirectiveBinding } from 'vue';

type ClickOutsideHandler = (event: MouseEvent) => void;

interface ClickOutsideElement extends HTMLElement {
  __ClickOutsideHandler__?: ClickOutsideHandler;
}

const ClickOutside: Directive<ClickOutsideElement, (event: MouseEvent) => void> = {
  mounted(el, binding: DirectiveBinding<(event: MouseEvent) => void>) {
    el.__ClickOutsideHandler__ = (event: MouseEvent) => {
      const target = event.target as Node | null;

      if (target && !(el === target || el.contains(target))) {
        binding.value(event);
      }
    };

    setTimeout(() => {
      if (el.__ClickOutsideHandler__) {
        document.body.addEventListener('click', el.__ClickOutsideHandler__);
      }
    }, 0);
  },

  unmounted(el) {
    if (el.__ClickOutsideHandler__) {
      document.body.removeEventListener('click', el.__ClickOutsideHandler__);
    }
  }
};

export default ClickOutside;
