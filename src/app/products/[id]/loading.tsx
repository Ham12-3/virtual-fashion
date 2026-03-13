import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="px-6 md:px-20 py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image gallery skeleton */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-20 sm:w-20 sm:h-24 rounded-none" />
            ))}
          </div>
          <Skeleton className="flex-1 aspect-[3/4] rounded-none" />
        </div>

        {/* Product info skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-3 w-32 rounded-none" />
          <Skeleton className="h-9 w-3/4 rounded-none" />
          <Skeleton className="h-6 w-20 rounded-none" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-none" />
            <Skeleton className="h-4 w-5/6 rounded-none" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-3">
            <Skeleton className="h-3 w-24 rounded-none" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-9 h-9 rounded-none" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-3 w-16 rounded-none" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-12 h-10 rounded-none" />
              ))}
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-14 w-full rounded-none" />
          <Skeleton className="h-14 w-full rounded-none" />
        </div>
      </div>
    </div>
  );
}
