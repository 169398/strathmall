import { Skeleton } from "@/components/ui/skeleton";

export function SearchSkeleton() {
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div>
        <div className="text-xl pt-3">
          <Skeleton className="h-6 w-24" />
        </div>
        <div>
          <ul>
            {Array.from({ length: 6 }).map((_, idx) => (
              <li key={idx} className="py-1">
                <Skeleton className="h-4 w-32" />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3">
            <Skeleton className="h-6 w-24" />
          </div>
          <ul>
            {Array.from({ length: 4 }).map((_, idx) => (
              <li key={idx} className="py-1">
                <Skeleton className="h-4 w-32" />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3">
            <Skeleton className="h-6 w-36" />
          </div>
          <ul>
            {Array.from({ length: 4 }).map((_, idx) => (
              <li key={idx} className="py-1">
                <Skeleton className="h-4 w-32" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-4 w-16 mx-2" />
            ))}
          </div>
        </div>
        <div>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full mb-4" />
          ))}
        </div>
      </div>
    </div>
  );
}
