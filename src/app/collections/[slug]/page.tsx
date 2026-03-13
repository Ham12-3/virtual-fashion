import { notFound } from "next/navigation";
import {
  collections,
  getCollectionBySlug,
  getProductsByCollection,
} from "@/lib/data";
import { CollectionFiltersWrapper } from "./filters-wrapper";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
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

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = getProductsByCollection(slug);

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
        <CollectionFiltersWrapper initialProducts={products} />
      </section>
    </>
  );
}
