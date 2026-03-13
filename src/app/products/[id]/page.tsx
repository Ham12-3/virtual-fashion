import { notFound } from "next/navigation";
import { products, getProductById } from "@/lib/data";
import { ProductDetailClient } from "./product-detail-client";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
