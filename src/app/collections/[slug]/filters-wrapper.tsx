"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/product-image";
import { WishlistButton } from "@/components/wishlist-button";
import { QuickAdd } from "@/components/quick-add";
import { CollectionFilters } from "@/components/collection-filters";
import { formatPrice } from "@/lib/data";
import type { Product } from "@/types";

interface Props {
  initialProducts: Product[];
}

export function CollectionFiltersWrapper({ initialProducts }: Props) {
  const [filtered, setFiltered] = useState(initialProducts);

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <CollectionFilters products={initialProducts} onFilter={setFiltered} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-brand-black/40 mb-6">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>

        {filtered.length === 0 ? (
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
            {filtered.map((product) => (
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
                      <WishlistButton product={product} />
                      <ProductImage
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {product.tryOnCompatible && (
                        <Badge className="absolute top-3 right-3 bg-brand-gold text-brand-black text-[10px] font-semibold tracking-brand rounded-none border-0 px-2.5 py-1 gap-1">
                          <Sparkles className="h-3 w-3" />
                          TRY ON
                        </Badge>
                      )}

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
        )}
      </div>
    </div>
  );
}
