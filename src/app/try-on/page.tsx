import { Suspense } from "react";
import { TryOnClient } from "./try-on-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Virtual Try-On | Maison Élégance",
  description:
    "Upload your photo and see how any garment looks on you with our AI-powered virtual try-on.",
};

function TryOnFallback() {
  return (
    <div className="px-6 md:px-20 py-10 md:py-16">
      <div className="text-center mb-10">
        <Skeleton className="h-4 w-32 mx-auto mb-3 rounded-none" />
        <Skeleton className="h-10 w-48 mx-auto mb-3 rounded-none" />
        <Skeleton className="h-4 w-64 mx-auto rounded-none" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <Skeleton className="aspect-[3/4] rounded-none" />
        <Skeleton className="aspect-[3/4] rounded-none" />
      </div>
    </div>
  );
}

export default function TryOnPage() {
  return (
    <Suspense fallback={<TryOnFallback />}>
      <TryOnClient />
    </Suspense>
  );
}
