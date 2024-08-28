import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DiscountedProductSkeleton = () => {
  return (
    <div className="w-full max-w-sm sm:max-w-xs p-4 border-red-500 border-2 shadow-lg">
      <div className="aspect-square w-full bg-gray-300 rounded-md animate-pulse"></div>
      <div className="mt-2 grid gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
};

export default DiscountedProductSkeleton;
