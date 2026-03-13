import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/components/product-image";
import { WishlistButton } from "@/components/wishlist-button";
import { QuickAdd } from "@/components/quick-add";
import { products, formatPrice } from "@/lib/data";

export const metadata: Metadata = {
  title: "Accessories | Maison Élégance",
  description:
    "Complete your look with handcrafted accessories — sunglasses, belts, bags, and shoes from Maison Élégance.",
};

const accessories = products.filter(
  (p) => p.category === "Accessories" || p.category === "Shoes"
);

export default function AccessoriesPage() {
  return (
    <>
      {/* Banner */}
      <section className="bg-brand-black px-6 md:px-20 py-16 md:py-24">
        <p className="text-xs font-medium text-brand-gold tracking-brand-wide mb-4">
          THE FINISHING TOUCH
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-brand-offwhite leading-[1.1] mb-4">
          Accessories
        </h1>
        <p className="text-sm text-brand-offwhite/60 max-w-lg leading-relaxed">
          Handcrafted details that elevate every outfit — from Italian leather
          goods to precision eyewear.
        </p>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-20 py-12 md:py-16">
        <p className="text-xs text-brand-black/40 mb-6">
          {accessories.length} {accessories.length === 1 ? "piece" : "pieces"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {accessories.map((product) => (
            <Card
              key={product.id}
              className="group border-0 ring-0 bg-transparent p-0 rounded-none overflow-visible"
            >
              <CardContent className="p-0">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative aspect-[3/4] bg-brand-black/5 overflow-hidden mb-4">
                    <WishlistButton product={product} />
                    <ProductImage
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <QuickAdd product={product} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-brand-black">
                    {product.name}
                  </h3>
                  <p className="text-sm text-brand-black/50 mt-1 line-clamp-1">
                    {product.description}
                  </p>
                  <p className="text-sm font-medium text-brand-gold mt-2">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
