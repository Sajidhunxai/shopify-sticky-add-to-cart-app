import { createStore } from "zustand/vanilla";

/**
 * Shared storefront cart/UI store (Zustand vanilla).
 * Exposed as window.SatcStore for sticky-atc.js + sticky-atc-drawer.js.
 */
const store = createStore((set, get) => ({
  open: false,
  cart: null,
  itemCount: 0,
  loadingKeys: {},
  lastError: null,
  lastSuccess: null,

  setOpen: (open) => set({ open: Boolean(open) }),

  setCart: (cart) =>
    set({
      cart: cart || null,
      itemCount: Number(cart?.item_count) || 0,
    }),

  startLoading: (key) => {
    if (!key) return;
    set((state) => ({
      loadingKeys: { ...state.loadingKeys, [String(key)]: true },
    }));
  },

  stopLoading: (key) => {
    if (!key) return;
    set((state) => {
      const next = { ...state.loadingKeys };
      delete next[String(key)];
      return { loadingKeys: next };
    });
  },

  isLoading: (key) => Boolean(get().loadingKeys[String(key)]),

  setLastError: (message) => set({ lastError: message || null }),

  setLastSuccess: (message) => set({ lastSuccess: message || null }),

  clearMessages: () => set({ lastError: null, lastSuccess: null }),
}));

const api = {
  getState: store.getState,
  setState: store.setState,
  subscribe: store.subscribe,
  ...store.getState(),
};

// Keep top-level action refs stable for callers using window.SatcStore.setOpen(...)
Object.assign(api, {
  setOpen: (...args) => store.getState().setOpen(...args),
  setCart: (...args) => store.getState().setCart(...args),
  startLoading: (...args) => store.getState().startLoading(...args),
  stopLoading: (...args) => store.getState().stopLoading(...args),
  isLoading: (...args) => store.getState().isLoading(...args),
  setLastError: (...args) => store.getState().setLastError(...args),
  setLastSuccess: (...args) => store.getState().setLastSuccess(...args),
  clearMessages: (...args) => store.getState().clearMessages(...args),
});

window.SatcStore = api;

export default api;
