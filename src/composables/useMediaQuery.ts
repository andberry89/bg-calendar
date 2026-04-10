import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(false);
  let mediaQueryList: MediaQueryList | null = null;

  function syncMatches(event?: MediaQueryListEvent): void {
    if (event) {
      matches.value = event.matches;
      return;
    }

    if (typeof window === 'undefined') {
      matches.value = false;
      return;
    }

    mediaQueryList = window.matchMedia(query);
    matches.value = mediaQueryList.matches;
  }

  onMounted((): void => {
    syncMatches();

    if (!mediaQueryList) {
      return;
    }

    mediaQueryList.addEventListener('change', syncMatches);
  });

  onBeforeUnmount((): void => {
    mediaQueryList?.removeEventListener('change', syncMatches);
  });

  return matches;
}
