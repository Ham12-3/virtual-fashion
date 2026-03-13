import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductColor } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    size: string,
    color: ProductColor,
    tryOnImageUrl?: string,
  ) => void;
  removeItem: (productId: string, size: string, colorHex: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    colorHex: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

function matchItem(
  item: CartItem,
  productId: string,
  size: string,
  colorHex: string,
) {
  return (
    item.product.id === productId &&
    item.selectedSize === size &&
    item.selectedColor.hex === colorHex
  );
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, tryOnImageUrl) => {
        const items = get().items;
        const existing = items.find((item) =>
          matchItem(item, product.id, size, color.hex),
        );

        if (existing) {
          set({
            items: items.map((item) =>
              item === existing
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                product,
                quantity: 1,
                selectedSize: size,
                selectedColor: color,
                tryOnImageUrl,
              },
            ],
          });
        }
      },

      removeItem: (productId, size, colorHex) => {
        set({
          items: get().items.filter(
            (item) => !matchItem(item, productId, size, colorHex),
          ),
        });
      },

      updateQuantity: (productId, size, colorHex, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, colorHex);
          return;
        }
        set({
          items: get().items.map((item) =>
            matchItem(item, productId, size, colorHex)
              ? { ...item, quantity }
              : item,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        ),
    }),
    { name: "maison-elegance-cart" },
  ),
);
