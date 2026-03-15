import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TryOnResult } from "@/types";

/** Metadata persisted to localStorage (no heavy base64 image data) */
interface TryOnMeta {
  id: string;
  productImageUrl: string;
  createdAt: string;
}

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
        set({ history: [result, ...get().history].slice(0, 10) });
      },

      removeResult: (id) => {
        set({ history: get().history.filter((r) => r.id !== id) });
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "maison-elegance-try-on",
      // Only persist lightweight metadata, not base64 image blobs
      partialize: (state) => ({
        history: state.history.map(
          (r): TryOnMeta => ({
            id: r.id,
            productImageUrl: r.productImageUrl,
            createdAt: r.createdAt,
          })
        ),
      }),
      // Rehydrate saved metadata back into full TryOnResult shape (images will be empty)
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.history = state.history.map((r) => ({
            ...r,
            personImageUrl: r.personImageUrl || "",
            resultImageUrls: r.resultImageUrls || [],
          }));
        }
      },
    }
  )
);
