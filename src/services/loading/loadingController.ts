let showFn: () => void;
let hideFn: () => void;

export const loadingController = {
  register(show: () => void, hide: () => void) {
    showFn = show;
    hideFn = hide;
  },
  show() {
    showFn?.();
  },
  hide() {
    hideFn?.();
  },
};
