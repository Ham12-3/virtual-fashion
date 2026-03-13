"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { products, collections, formatPrice } from "@/lib/data";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const q = query.toLowerCase().trim();

  const filteredProducts = q.length >= 2
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      ).slice(0, 6)
    : [];

  const filteredCollections = q.length >= 2
    ? collections.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      )
    : [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl mx-auto mt-20 md:mt-32 bg-white shadow-2xl mx-4 sm:mx-auto">
        {/* Search Input */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-brand-black/10">
          <Search className="h-5 w-5 text-brand-black/40 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, collections..."
            className="flex-1 text-base text-brand-black placeholder:text-brand-black/40 outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="text-brand-black/40 hover:text-brand-black transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {q.length < 2 && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-brand-black/40">
                Start typing to search...
              </p>
            </div>
          )}

          {q.length >= 2 &&
            filteredProducts.length === 0 &&
            filteredCollections.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-brand-black/50">
                  No results for &ldquo;{query}&rdquo;
                </p>
              </div>
            )}

          {/* Collections */}
          {filteredCollections.length > 0 && (
            <div className="px-6 pt-4 pb-2">
              <p className="text-[10px] font-medium text-brand-gold tracking-brand-wide mb-3">
                COLLECTIONS
              </p>
              {filteredCollections.map((c) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  onClick={onClose}
                  className="block py-2.5 text-sm font-medium text-brand-black hover:text-brand-gold transition-colors"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {/* Products */}
          {filteredProducts.length > 0 && (
            <div className="px-6 pt-4 pb-6">
              <p className="text-[10px] font-medium text-brand-gold tracking-brand-wide mb-3">
                PRODUCTS
              </p>
              <div className="space-y-3">
                {filteredProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 py-2 hover:bg-brand-black/[0.02] -mx-2 px-2 transition-colors"
                  >
                    <div className="relative h-16 w-12 bg-brand-black/5 shrink-0 overflow-hidden">
                      <ProductImage
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-brand-black truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-brand-black/50 mt-0.5">
                        {p.category}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-brand-gold shrink-0">
                      {formatPrice(p.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
