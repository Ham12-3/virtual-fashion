import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionLoading() {
  return (
    <>
      {/* Banner skeleton */}
      <Skeleton className="h-[320px] md:h-[420px] w-full rounded-none" />

      {/* Filters + Grid skeleton */}
      <div className="px-6 md:px-20 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filter sidebar skeleton */}
          <div className="hidden lg:block w-[260px] shrink-0 space-y-8">
            <Skeleton className="h-3 w-16 rounded-none" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-3 w-20 rounded-none" />
                <Skeleton className="h-10 w-full rounded-none" />
              </div>
            ))}
          </div>

          {/* Product grid skeleton */}
          <div className="flex-1">
            <Skeleton className="h-3 w-16 mb-6 rounded-none" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[3/4] w-full rounded-none" />
                  <Skeleton className="h-5 w-3/4 mt-4 rounded-none" />
                  <Skeleton className="h-3 w-full mt-2 rounded-none" />
                  <Skeleton className="h-4 w-16 mt-2 rounded-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
