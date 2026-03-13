import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/components/product-image";
import { products as allProducts, formatPrice } from "@/lib/data";

const featuredProducts = allProducts
  .filter((p) => p.tags.includes("bestseller"))
  .concat(allProducts.filter((p) => p.tags.includes("new-arrival")))
  .slice(0, 6);

export default function Home() {
  return (
    <>
      {/* ── Hero Section ───────────────────────────────────────────── */}
      <section className="relative h-[600px] md:h-[720px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80"
            alt="Fashion editorial — model in elegant dark outfit"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent" />

        <div className="relative h-full flex flex-col justify-end px-6 md:px-20 pb-16 md:pb-20">
          <p className="text-xs font-medium text-brand-gold tracking-brand-wide mb-5">
            SPRING / SUMMER 2026
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-brand-offwhite leading-[1.08] mb-5">
            Dress Beyond
            <br />
            Imagination
          </h1>
          <p className="text-base text-brand-offwhite/75 leading-relaxed max-w-lg mb-8">
            Where timeless craftsmanship meets AI-powered styling.
            Discover, try on, and own pieces that transcend seasons.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-brand-gold px-10 py-4 text-sm font-semibold text-brand-black tracking-brand hover:bg-brand-gold-hover transition-colors"
            >
              SHOP THE COLLECTION
            </Link>
            <Link
              href="/try-on"
              className="inline-flex items-center gap-2 border border-brand-offwhite px-10 py-4 text-sm font-medium text-brand-offwhite tracking-brand hover:bg-brand-offwhite/10 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              VIRTUAL TRY-ON
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-24">
        <div className="flex flex-col items-center text-center mb-12">
          <p className="text-xs font-medium text-brand-gold tracking-brand-wide mb-4">
            CURATED FOR YOU
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black mb-4">
            The Edit
          </h2>
          <p className="text-base text-brand-black/60 max-w-xl leading-relaxed">
            Handpicked pieces from our latest arrivals — where modern
            silhouettes meet timeless refinement.
          </p>
          <div className="w-[60px] h-px bg-brand-gold mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group border-0 ring-0 bg-transparent p-0 rounded-none overflow-visible"
            >
              <CardContent className="p-0">
                <Link href={`/product/${product.id}`} className="block">
                  {/* Image container with hover overlay */}
                  <div className="relative aspect-[3/4] bg-brand-black/5 overflow-hidden mb-4">
                    <ProductImage
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Hover overlay with Try On button */}
                    {product.tryOnCompatible && (
                      <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/40 transition-colors duration-300 flex items-end justify-center pb-6">
                        <span className="inline-flex items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-brand-gold px-6 py-3 text-xs font-semibold text-brand-black tracking-brand">
                          <Sparkles className="h-3.5 w-3.5" />
                          TRY IT ON
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <h3 className="font-heading text-lg font-semibold text-brand-black">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-brand-gold mt-1">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 border border-brand-black px-10 py-4 text-sm font-medium text-brand-black tracking-brand hover:bg-brand-black hover:text-brand-offwhite transition-colors"
          >
            VIEW ALL COLLECTIONS
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Virtual Try-On Promo (Split Layout) ────────────────────── */}
      <section className="bg-brand-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">
          {/* Left: Before / After mockup */}
          <div className="relative flex items-center justify-center p-8 md:p-16">
            <div className="relative w-full max-w-md aspect-[3/4]">
              {/* "Before" card */}
              <div className="absolute top-0 left-0 w-[58%] h-[75%] bg-brand-offwhite/10 border border-brand-offwhite/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-offwhite/5 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-brand-offwhite/40">
                  <Camera className="h-8 w-8" />
                  <span className="text-xs tracking-brand-wide">YOUR PHOTO</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-brand-black/70 px-2.5 py-1">
                  <span className="text-[10px] font-medium text-brand-offwhite/70 tracking-brand">BEFORE</span>
                </div>
              </div>

              {/* "After" card — overlapping */}
              <div className="absolute bottom-0 right-0 w-[58%] h-[75%] bg-brand-gold/10 border border-brand-gold/30 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-brand-gold/50">
                  <Sparkles className="h-8 w-8" />
                  <span className="text-xs tracking-brand-wide">AI RESULT</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-brand-gold px-2.5 py-1">
                  <span className="text-[10px] font-semibold text-brand-black tracking-brand">AFTER</span>
                </div>
              </div>

              {/* Decorative connector */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-brand-black" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy + CTA */}
          <div className="flex flex-col justify-center px-8 md:px-16 lg:pr-20 py-12 lg:py-0">
            <p className="text-xs font-medium text-brand-gold tracking-brand-wide mb-5">
              AI-POWERED STYLING
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-brand-offwhite leading-[1.1] mb-5">
              See It on You
              <br />
              Before You Buy
            </h2>
            <p className="text-base text-brand-offwhite/60 leading-relaxed max-w-md mb-4">
              Upload your photo, pick any garment from our collection, and our
              AI generates a realistic preview in seconds. No guesswork, no
              returns — just confidence.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Works with any photo — front-facing, casual, or formal",
                "Matches your exact body shape and proportions",
                "Try unlimited combinations before checkout",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-brand-offwhite/50"
                >
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center bg-brand-gold/20">
                    <span className="h-1.5 w-1.5 bg-brand-gold" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div>
              <Link
                href="/try-on"
                className="inline-flex items-center gap-2 bg-brand-gold px-10 py-4 text-sm font-semibold text-brand-black tracking-brand hover:bg-brand-gold-hover transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                TRY IT ON NOW
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
