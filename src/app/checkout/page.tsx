"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ShoppingBag, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/data";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

// ── Payment Form ─────────────────────────────────────────────────────

function PaymentForm({ total }: { total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (submitError) {
      setError(submitError.message ?? "Payment failed. Please try again.");
      setLoading(false);
    } else {
      clearCart();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-14 bg-brand-gold text-brand-black text-sm font-semibold tracking-brand hover:bg-brand-gold-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lock className="h-4 w-4" />
        {loading ? "PROCESSING..." : `PAY ${formatPrice(total)}`}
      </button>

      <p className="text-[10px] text-center text-brand-black/30 tracking-wide">
        STRIPE TEST MODE — USE CARD 4242 4242 4242 4242
      </p>
    </form>
  );
}

// ── Checkout Page ────────────────────────────────────────────────────

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const total = totalPrice();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStripeError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
      })
      .catch(() => setStripeError("Could not connect to payment service."));
  }, [items]);

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-offwhite flex flex-col items-center justify-center px-6 text-center">
        <ShoppingBag className="h-16 w-16 text-brand-black/10 mb-6" />
        <h1 className="font-heading text-2xl font-bold text-brand-black mb-2">
          Your bag is empty
        </h1>
        <p className="text-sm text-brand-black/50 mb-8">
          Add some pieces before checking out.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 bg-brand-gold px-10 py-4 text-sm font-semibold text-brand-black tracking-brand hover:bg-brand-gold-hover transition-colors"
        >
          SHOP COLLECTIONS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-offwhite">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-brand-black/50 tracking-brand hover:text-brand-black transition-colors mb-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          CONTINUE SHOPPING
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* ── Left: Payment ─────────────────────────────────── */}
          <div className="lg:col-span-3">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-brand-black mb-8">
              Checkout
            </h1>

            {/* Stripe not configured */}
            {stripeError && (
              <div className="bg-amber-50 border border-amber-200 px-5 py-4 mb-6">
                <p className="text-sm font-medium text-amber-800 mb-1">
                  Stripe not configured
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {stripeError}
                  <br />
                  Add <code className="bg-amber-100 px-1">STRIPE_SECRET_KEY</code> and{" "}
                  <code className="bg-amber-100 px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>{" "}
                  to your <code className="bg-amber-100 px-1">.env.local</code> file.
                </p>
              </div>
            )}

            {/* Stripe not loaded (no publishable key) */}
            {!stripePromise && !stripeError && (
              <div className="bg-amber-50 border border-amber-200 px-5 py-4 mb-6">
                <p className="text-sm font-medium text-amber-800 mb-1">
                  Stripe publishable key missing
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Add <code className="bg-amber-100 px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>{" "}
                  to your <code className="bg-amber-100 px-1">.env.local</code> file and restart
                  the dev server.
                </p>
              </div>
            )}

            {/* Payment form */}
            {stripePromise && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "flat",
                    variables: {
                      colorPrimary: "#C9A84C",
                      colorBackground: "#FFFFFF",
                      colorText: "#1A1A1A",
                      colorDanger: "#dc2626",
                      fontFamily: "Inter, system-ui, sans-serif",
                      borderRadius: "0px",
                      spacingUnit: "4px",
                    },
                  },
                }}
              >
                <PaymentForm total={total} />
              </Elements>
            )}

            {/* Loading state */}
            {stripePromise && !clientSecret && !stripeError && (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ──────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 sticky top-28">
              <h2 className="text-xs font-semibold text-brand-black tracking-[3px] uppercase mb-6">
                ORDER SUMMARY
              </h2>

              <ul className="space-y-4 mb-6">
                {items.map((item) => {
                  const key = `${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`;
                  return (
                    <li key={key} className="flex gap-3">
                      <div className="relative w-14 h-[70px] bg-brand-black/5 shrink-0 overflow-hidden">
                        <ProductImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-black truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-brand-black/40 mt-0.5">
                          {item.selectedColor.name} · {item.selectedSize} · Qty{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-brand-black shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-brand-black/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-brand-black/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-brand-black/60">
                  <span>Shipping</span>
                  <span className="text-brand-gold font-medium">FREE</span>
                </div>
                <div className="border-t border-brand-black/10 pt-3 mt-3 flex justify-between">
                  <span className="text-sm font-semibold text-brand-black tracking-brand">
                    TOTAL
                  </span>
                  <span className="text-lg font-bold text-brand-black">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
