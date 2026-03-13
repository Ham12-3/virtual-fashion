"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function CheckoutSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  // Clear cart on mount (in case redirect didn't clear it)
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-brand-offwhite flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 bg-green-100 flex items-center justify-center mb-8">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>

      <p className="text-xs font-medium text-brand-gold tracking-brand-wide mb-4">
        ORDER CONFIRMED
      </p>

      <h1 className="font-heading text-3xl md:text-4xl font-bold text-brand-black mb-4">
        Thank You
      </h1>

      <p className="text-sm text-brand-black/60 max-w-md leading-relaxed mb-2">
        Your order has been placed successfully. This is a demo payment —
        no actual charge was made.
      </p>

      <p className="text-xs text-brand-black/40 mb-10">
        In production, you would receive a confirmation email with tracking details.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 bg-brand-gold px-10 py-4 text-sm font-semibold text-brand-black tracking-brand hover:bg-brand-gold-hover transition-colors"
        >
          CONTINUE SHOPPING
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-brand-black px-10 py-4 text-sm font-medium text-brand-black tracking-brand hover:bg-brand-black hover:text-brand-offwhite transition-colors"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
