"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/data";
import type { Product } from "@/types";

interface CollectionFiltersProps {
  products: Product[];
  onFilter: (filtered: Product[]) => void;
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "36", "37", "38", "39", "40", "41", "42", "43", "44", "One Size"];
const ALL_CATEGORIES = ["Tops", "Dresses", "Bottoms", "Outerwear", "Shoes", "Accessories"];

export function CollectionFilters({ products, onFilter }: CollectionFiltersProps) {
  const [size, setSize] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [color, setColor] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Derive available colors from products
  const availableColors = Array.from(
    new Map(products.flatMap((p) => p.colors).map((c) => [c.hex, c])).values()
  );

  // Derive available sizes from products
  const availableSizes = ALL_SIZES.filter((s) =>
    products.some((p) => p.sizes.includes(s))
  );

  // Derive available categories
  const availableCategories = ALL_CATEGORIES.filter((c) =>
    products.some((p) => p.category === c)
  );

  function applyFilters(
    newSize?: string,
    newCategory?: string,
    newColor?: string,
    newPriceRange?: number[]
  ) {
    const s = newSize ?? size;
    const cat = newCategory ?? category;
    const col = newColor ?? color;
    const pr = newPriceRange ?? priceRange;

    const filtered = products.filter((p) => {
      if (s !== "all" && !p.sizes.includes(s)) return false;
      if (cat !== "all" && p.category !== cat) return false;
      if (col !== "all" && !p.colors.some((c) => c.hex === col)) return false;
      if (p.price < pr[0] || p.price > pr[1]) return false;
      return true;
    });

    onFilter(filtered);
  }

  function resetFilters() {
    setSize("all");
    setCategory("all");
    setColor("all");
    setPriceRange([0, 5000]);
    onFilter(products);
  }

  const hasActiveFilters = size !== "all" || category !== "all" || color !== "all" || priceRange[0] > 0 || priceRange[1] < 5000;

  const filterContent = (
    <div className="flex flex-col gap-8">
      {/* Category */}
      <div>
        <Label className="text-[11px] font-semibold text-brand-black tracking-[3px] uppercase mb-3 block">
          Category
        </Label>
        <Select
          value={category}
          onValueChange={(val) => {
            const v = val ?? "all";
            setCategory(v);
            applyFilters(undefined, v);
          }}
        >
          <SelectTrigger className="w-full h-10 rounded-none border-brand-black/15 text-sm">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {availableCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Size */}
      <div>
        <Label className="text-[11px] font-semibold text-brand-black tracking-[3px] uppercase mb-3 block">
          Size
        </Label>
        <Select
          value={size}
          onValueChange={(val) => {
            const v = val ?? "all";
            setSize(v);
            applyFilters(v);
          }}
        >
          <SelectTrigger className="w-full h-10 rounded-none border-brand-black/15 text-sm">
            <SelectValue placeholder="All Sizes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {availableSizes.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Color */}
      <div>
        <Label className="text-[11px] font-semibold text-brand-black tracking-[3px] uppercase mb-3 block">
          Color
        </Label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setColor("all");
              applyFilters(undefined, undefined, "all");
            }}
            className={`w-7 h-7 border-2 transition-colors ${
              color === "all"
                ? "border-brand-gold"
                : "border-brand-black/15 hover:border-brand-black/30"
            } bg-gradient-to-br from-red-200 via-blue-200 to-green-200`}
            title="All Colors"
          />
          {availableColors.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setColor(c.hex);
                applyFilters(undefined, undefined, c.hex);
              }}
              className={`w-7 h-7 border-2 transition-colors ${
                color === c.hex
                  ? "border-brand-gold"
                  : "border-brand-black/15 hover:border-brand-black/30"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-[11px] font-semibold text-brand-black tracking-[3px] uppercase mb-3 block">
          Price Range
        </Label>
        <Slider
          min={0}
          max={5000}
          step={50}
          value={priceRange}
          onValueChange={(val) => {
            const v = Array.isArray(val) ? val : [val];
            setPriceRange(v);
            applyFilters(undefined, undefined, undefined, v);
          }}
          className="mb-3"
        />
        <div className="flex justify-between text-xs text-brand-black/50">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 text-xs font-medium text-brand-gold tracking-brand hover:text-brand-gold-hover transition-colors"
        >
          <X className="h-3 w-3" />
          CLEAR ALL FILTERS
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 text-sm font-medium text-brand-black tracking-brand mb-6"
      >
        <SlidersHorizontal className="h-4 w-4" />
        {mobileOpen ? "HIDE FILTERS" : "SHOW FILTERS"}
      </button>

      {/* Mobile filter panel */}
      {mobileOpen && (
        <div className="lg:hidden mb-8 p-6 border border-brand-black/10">
          {filterContent}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0">
        <h3 className="text-xs font-semibold text-brand-gold tracking-brand-wide mb-8">
          FILTERS
        </h3>
        {filterContent}
      </aside>
    </>
  );
}
