"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types";

export function QuickAdd({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [showSizes, setShowSizes] = useState(false);
  const [added, setAdded] = useState(false);

  function handleAdd(size: string) {
    addItem(product, size, product.colors[0]);
    setAdded(true);
    setShowSizes(false);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10">
      {/* Size selector dropdown */}
      {showSizes && (
        <div
          className="bg-white/95 backdrop-blur-sm border-t border-brand-black/10 p-3"
          onClick={(e) => e.preventDefault()}
        >
          <p className="text-[10px] font-medium text-brand-black/50 tracking-brand-wide mb-2">
            SELECT SIZE
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAdd(size);
                }}
                className="min-w-[36px] h-8 px-2 text-xs font-medium border border-brand-black/15 text-brand-black hover:bg-brand-gold hover:text-brand-black hover:border-brand-gold transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to cart button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (added) return;
          if (product.sizes.length === 1) {
            handleAdd(product.sizes[0]);
          } else {
            setShowSizes(!showSizes);
          }
        }}
        className={`w-full py-3 text-xs font-semibold tracking-brand transition-all duration-300 flex items-center justify-center gap-2
          ${added
            ? "bg-green-700 text-white"
            : "bg-brand-black/90 text-brand-offwhite hover:bg-brand-black translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          }
          ${added ? "" : ""}`}
      >
        {added ? (
          <>
            <Check className="h-3.5 w-3.5" />
            ADDED
          </>
        ) : (
          <>
            <ShoppingBag className="h-3.5 w-3.5" />
            QUICK ADD
          </>
        )}
      </button>
    </div>
  );
}
