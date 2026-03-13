import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/product-image";
import {
  collections,
  getCollectionBySlug,
  getProductsByCollection,
  formatPrice,
} from "@/lib/data";
import { CollectionFiltersWrapper } from "./filters-wrapper";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      title: `${collection.name} | Maison Élégance`,
      description: collection.description,
    },
  };
}

export default function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) notFound();

  const products = getProductsByCollection(params.slug);

  return (
    <>
      {/* ── Banner ──────────────────────────────────────────────── */}
      <section className="relative h-[320px] md:h-[420px] overflow-hidden bg-brand-black">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black/80 to-brand-black/40" />
        <div className="relative h-full flex flex-col justify-end px-6 md:px-20 pb-10 md:pb-14">
          <p className="text-xs font-medium text-brand-gold tracking-brand-wide mb-3">
            COLLECTION
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-brand-offwhite leading-[1.1] mb-3">
            {collection.name}
          </h1>
          <p className="text-sm text-brand-offwhite/60 max-w-lg leading-relaxed">
            {collection.description}
          </p>
        </div>
      </section>

      {/* ── Filters + Grid ─────────────────────────────────────── */}
      <section className="px-6 md:px-20 py-12 md:py-16">
        <CollectionFiltersWrapper initialProducts={products}>
          {(filteredProducts) => (
            <>
              <p className="text-xs text-brand-black/40 mb-6">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "piece" : "pieces"}
              </p>

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-lg text-brand-black/40 mb-2">
                    No pieces match your filters.
                  </p>
                  <p className="text-sm text-brand-black/30">
                    Try adjusting your selection.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group border-0 ring-0 bg-transparent p-0 rounded-none overflow-visible"
                    >
                      <CardContent className="p-0">
                        <Link
                          href={`/products/${product.id}`}
                          className="block"
                        >
                          <div className="relative aspect-[3/4] bg-brand-black/5 overflow-hidden mb-4">
                            <ProductImage
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />

                            {/* Try-On badge */}
                            {product.tryOnCompatible && (
                              <Badge className="absolute top-3 right-3 bg-brand-gold text-brand-black text-[10px] font-semibold tracking-brand rounded-none border-0 px-2.5 py-1 gap-1">
                                <Sparkles className="h-3 w-3" />
                                TRY ON
                              </Badge>
                            )}

                            {/* Hover overlay */}
                            {product.tryOnCompatible && (
                              <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/40 transition-colors duration-300 flex items-end justify-center pb-6">
                                <span className="inline-flex items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-brand-gold px-6 py-3 text-xs font-semibold text-brand-black tracking-brand">
                                  <Sparkles className="h-3.5 w-3.5" />
                                  TRY IT ON
                                </span>
                              </div>
                            )}
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
              )}
            </>
          )}
        </CollectionFiltersWrapper>
      </section>
    </>
  );
}
