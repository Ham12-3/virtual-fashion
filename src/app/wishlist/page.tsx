"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice } from "@/lib/data";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();

  return (
    <div className="min-h-screen bg-brand-offwhite px-6 md:px-20 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-xs font-medium text-brand-gold tracking-brand-wide mb-3">
            YOUR FAVORITES
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-black">
            Wishlist
          </h1>
          {items.length > 0 && (
            <p className="text-sm text-brand-black/50 mt-2">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>
        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs font-medium text-brand-black/50 tracking-brand hover:text-brand-black transition-colors"
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart className="h-16 w-16 text-brand-black/10 mb-6" />
          <h2 className="font-heading text-xl font-semibold text-brand-black mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-brand-black/50 mb-8 max-w-sm">
            Save pieces you love by tapping the heart icon on any product.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-brand-gold px-10 py-4 text-sm font-semibold text-brand-black tracking-brand hover:bg-brand-gold-hover transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            BROWSE COLLECTIONS
          </Link>
        </div>
      )}

      {/* Product Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div key={product.id} className="group relative">
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-[3/4] bg-brand-black/5 overflow-hidden mb-4">
                  <ProductImage
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <h3 className="font-heading text-lg font-semibold text-brand-black">
                  {product.name}
                </h3>
                <p className="text-sm font-medium text-brand-gold mt-1">
                  {formatPrice(product.price)}
                </p>
              </Link>
              <button
                onClick={() => removeItem(product.id)}
                className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-brand-black/60 hover:text-red-500 transition-colors"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
