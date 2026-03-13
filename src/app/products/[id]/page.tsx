import { notFound } from "next/navigation";
import { products, getProductById, formatPrice } from "@/lib/data";
import { ProductDetailClient } from "./product-detail-client";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Maison Élégance`,
      description: product.description,
    },
  };
}

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = getProductById(params.id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
