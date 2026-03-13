import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TryOnResult } from "@/types";

interface TryOnStore {
  history: TryOnResult[];
  addResult: (result: TryOnResult) => void;
  removeResult: (id: string) => void;
  clearHistory: () => void;
}

export const useTryOnStore = create<TryOnStore>()(
  persist(
    (set, get) => ({
      history: [],

      addResult: (result) => {
        set({ history: [result, ...get().history].slice(0, 50) });
      },

      removeResult: (id) => {
        set({ history: get().history.filter((r) => r.id !== id) });
      },

      clearHistory: () => set({ history: [] }),
    }),
    { name: "maison-elegance-try-on" }
  )
);
