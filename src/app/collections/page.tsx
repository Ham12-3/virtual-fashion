import Link from "next/link";
import type { Metadata } from "next";
import { collections } from "@/lib/data";

export const metadata: Metadata = {
  title: "Collections | Maison Élégance",
  description:
    "Browse our curated fashion collections — from sun-drenched Mediterranean elegance to after-dark urban sophistication.",
  openGraph: {
    title: "Collections | Maison Élégance",
    description:
      "Browse our curated fashion collections — from sun-drenched Mediterranean elegance to after-dark urban sophistication.",
  },
};

export default function CollectionsPage() {
  return (
    <>
      <section className="px-6 md:px-20 py-16 md:py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-medium text-brand-gold tracking-brand-wide mb-4">
            OUR WORLD
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-brand-black mb-4">
            Collections
          </h1>
          <p className="text-base text-brand-black/60 max-w-xl mx-auto leading-relaxed">
            Each collection tells a story — a mood, a place, a way of being.
            Discover the one that speaks to you.
          </p>
          <div className="w-[60px] h-px bg-brand-gold mt-6 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group relative h-[480px] overflow-hidden bg-brand-black"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/30 to-transparent group-hover:from-brand-black/90 transition-all duration-500" />
              <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-brand-black/10 transition-colors duration-500" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <p className="text-[10px] font-medium text-brand-gold tracking-brand-wide mb-2">
                  COLLECTION
                </p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-offwhite leading-tight mb-2">
                  {col.name}
                </h2>
                <p className="text-sm text-brand-offwhite/50 leading-relaxed line-clamp-2">
                  {col.description}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-medium text-brand-gold tracking-brand mt-4 group-hover:gap-3 transition-all">
                  EXPLORE →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
