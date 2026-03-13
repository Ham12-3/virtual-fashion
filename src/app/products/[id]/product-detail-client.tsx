"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/product-image";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/data";
import type { Product } from "@/types";

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="px-6 md:px-20 py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* ── Left: Image Gallery ───────────────────────────────── */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setSelectedImage(i)}
                className={`relative shrink-0 w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border-2 transition-colors ${
                  selectedImage === i
                    ? "border-brand-gold"
                    : "border-transparent hover:border-brand-black/20"
                }`}
              >
                <ProductImage
                  src={img}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="relative flex-1 aspect-[3/4] bg-brand-black/5 overflow-hidden">
            <ProductImage
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* ── Right: Product Info ───────────────────────────────── */}
        <div className="flex flex-col">
          {/* Collection link */}
          <Link
            href={`/collections/${product.collectionSlug}`}
            className="text-xs font-medium text-brand-gold tracking-brand-wide mb-3 hover:text-brand-gold-hover transition-colors"
          >
            {product.collectionSlug.replace(/-/g, " ").toUpperCase()}
          </Link>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-black leading-tight mb-2">
            {product.name}
          </h1>

          <p className="text-xl font-medium text-brand-gold mb-6">
            {formatPrice(product.price)}
          </p>

          <p className="text-sm text-brand-black/60 leading-relaxed mb-8">
            {product.description}
          </p>

          <Separator className="mb-8 bg-brand-black/10" />

          {/* Color swatches */}
          <div className="mb-8">
            <Label className="text-[11px] font-semibold text-brand-black tracking-[3px] uppercase mb-3 block">
              COLOR — {selectedColor.name}
            </Label>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setSelectedColor(c)}
                  className={`relative w-9 h-9 border-2 transition-colors ${
                    selectedColor.hex === c.hex
                      ? "border-brand-gold"
                      : "border-brand-black/15 hover:border-brand-black/30"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor.hex === c.hex && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check
                        className="h-4 w-4"
                        style={{
                          color:
                            c.hex === "#FFFFFF" || c.hex === "#FAFAF5" || c.hex === "#F5F0E8" || c.hex === "#FFFDD0" || c.hex === "#F0EAD6"
                              ? "#1A1A1A"
                              : "#FAFAF5",
                        }}
                      />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size picker */}
          <div className="mb-8">
            <Label className="text-[11px] font-semibold text-brand-black tracking-[3px] uppercase mb-3 block">
              SIZE {selectedSize && `— ${selectedSize}`}
            </Label>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="flex flex-wrap gap-2"
            >
              {product.sizes.map((s) => (
                <label
                  key={s}
                  className={`flex items-center justify-center min-w-[48px] h-10 px-3 border cursor-pointer text-sm font-medium transition-colors ${
                    selectedSize === s
                      ? "border-brand-gold bg-brand-gold text-brand-black"
                      : "border-brand-black/15 text-brand-black hover:border-brand-black/30"
                  }`}
                >
                  <RadioGroupItem value={s} className="sr-only" />
                  {s}
                </label>
              ))}
            </RadioGroup>
          </div>

          <Separator className="mb-8 bg-brand-black/10" />

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`h-14 rounded-none text-sm font-semibold tracking-brand transition-colors ${
                added
                  ? "bg-green-700 text-white hover:bg-green-700"
                  : "bg-brand-black text-brand-offwhite hover:bg-brand-black/90"
              } disabled:bg-brand-black/20 disabled:text-brand-black/40`}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  ADDED TO CART
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  {selectedSize ? "ADD TO CART" : "SELECT A SIZE"}
                </>
              )}
            </Button>

            {product.tryOnCompatible && (
              <Button
                onClick={() => router.push(`/try-on?product=${product.id}`)}
                className="h-14 rounded-none bg-brand-gold text-brand-black text-sm font-semibold tracking-brand hover:bg-brand-gold-hover"
              >
                <Sparkles className="h-4 w-4" />
                VIRTUAL TRY-ON
              </Button>
            )}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-brand-black/40 tracking-brand-wide border border-brand-black/10 px-3 py-1"
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
