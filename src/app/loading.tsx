import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <Skeleton className="h-[600px] md:h-[720px] w-full rounded-none" />

      {/* Product grid skeleton */}
      <div className="px-6 md:px-20 py-16 md:py-24">
        <div className="flex flex-col items-center gap-3 mb-12">
          <Skeleton className="h-3 w-24 rounded-none" />
          <Skeleton className="h-10 w-40 rounded-none" />
          <Skeleton className="h-4 w-80 rounded-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[3/4] w-full rounded-none" />
              <Skeleton className="h-5 w-3/4 mt-4 rounded-none" />
              <Skeleton className="h-4 w-20 mt-2 rounded-none" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
