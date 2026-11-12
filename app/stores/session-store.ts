import { create } from "zustand";
import type { Plan } from "../models/bar-config";

type SessionState = {
  shop: string;
  plan: Plan;
  hideBranding: boolean;
  busy: boolean;
  hydrate: (payload: {
    shop: string;
    plan: Plan;
    hideBranding: boolean;
  }) => void;
  setBusy: (busy: boolean) => void;
  setPlan: (plan: Plan, hideBranding: boolean) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  shop: "",
  plan: "free",
  hideBranding: false,
  busy: false,

  hydrate: ({ shop, plan, hideBranding }) =>
    set({ shop, plan, hideBranding }),

  setBusy: (busy) => set({ busy }),

  setPlan: (plan, hideBranding) => set({ plan, hideBranding }),
}));
