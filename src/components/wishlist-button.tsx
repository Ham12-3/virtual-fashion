"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types";

export function WishlistButton({ product }: { product: Product }) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(product);
      }}
      className="absolute top-3 left-3 z-10 p-2 bg-white/90 hover:bg-white transition-colors"
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          wishlisted
            ? "fill-red-500 text-red-500"
            : "text-brand-black/60 hover:text-red-500"
        }`}
      />
    </button>
  );
}
