"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductImage } from "@/components/product-image";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/data";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  return (
    <Sheet>
      <SheetTrigger render={<button aria-label="Open cart" />}>
        {children}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-md rounded-none border-brand-black/10"
      >
        <SheetHeader className="px-6 pt-6 pb-0">
          <SheetTitle className="font-heading text-lg font-bold text-brand-black tracking-[2px]">
            YOUR BAG
          </SheetTitle>
          <SheetDescription className="text-xs text-brand-black/40">
            {items.length === 0
              ? "Your bag is empty"
              : `${items.length} ${items.length === 1 ? "item" : "items"}`}
          </SheetDescription>
        </SheetHeader>

        {/* ── Items ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="h-10 w-10 text-brand-black/15" />
              <p className="text-sm text-brand-black/40">
                Nothing here yet.
              </p>
              <SheetClose
                render={
                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-2 bg-brand-gold px-8 py-3 text-xs font-semibold text-brand-black tracking-brand hover:bg-brand-gold-hover transition-colors"
                  />
                }
              >
                SHOP NOW
              </SheetClose>
            </div>
          ) : (
            <ul className="divide-y divide-brand-black/10">
              {items.map((item) => {
                const key = `${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`;
                return (
                  <li key={key} className="flex gap-4 py-5">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 shrink-0 bg-brand-black/5 overflow-hidden">
                      <ProductImage
                        src={item.tryOnImageUrl ?? item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-heading text-sm font-semibold text-brand-black leading-tight hover:text-brand-gold transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className="w-3 h-3 border border-brand-black/15"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span className="text-[11px] text-brand-black/50">
                          {item.selectedColor.name} · {item.selectedSize}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-brand-gold mt-2">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.hex,
                              item.quantity - 1,
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center border border-brand-black/15 text-brand-black/50 hover:border-brand-black/30 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium text-brand-black w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.hex,
                              item.quantity + 1,
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center border border-brand-black/15 text-brand-black/50 hover:border-brand-black/30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>

                        <button
                          onClick={() =>
                            removeItem(
                              item.product.id,
                              item.selectedSize,
                              item.selectedColor.hex,
                            )
                          }
                          className="ml-auto text-brand-black/30 hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        {items.length > 0 && (
          <SheetFooter className="px-6 pb-6 pt-0 flex-col gap-4">
            <Separator className="bg-brand-black/10" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-black tracking-[3px] uppercase">
                TOTAL
              </span>
              <span className="text-lg font-bold text-brand-black">
                {formatPrice(totalPrice())}
              </span>
            </div>

            <SheetClose
              render={
                <Link
                  href="/checkout"
                  className="flex items-center justify-center h-14 bg-brand-gold text-brand-black text-sm font-semibold tracking-brand hover:bg-brand-gold-hover transition-colors"
                />
              }
            >
              CHECKOUT
            </SheetClose>

            <button
              onClick={clearCart}
              className="text-xs text-brand-black/30 hover:text-brand-black/50 transition-colors text-center"
            >
              Clear bag
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
