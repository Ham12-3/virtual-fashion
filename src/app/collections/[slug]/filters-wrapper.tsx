"use client";

import { useState, type ReactNode } from "react";
import { CollectionFilters } from "@/components/collection-filters";
import type { Product } from "@/types";

interface Props {
  initialProducts: Product[];
  children: (filteredProducts: Product[]) => ReactNode;
}

export function CollectionFiltersWrapper({ initialProducts, children }: Props) {
  const [filtered, setFiltered] = useState(initialProducts);

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <CollectionFilters products={initialProducts} onFilter={setFiltered} />
      <div className="flex-1 min-w-0">{children(filtered)}</div>
    </div>
  );
}
