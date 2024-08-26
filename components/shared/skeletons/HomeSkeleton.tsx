// components/shared/skeletons/HomeSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function HomeSkeleton() {
  return (
    <div>
    

      {/* Hero Section Skeleton */}
      <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center space-y-4">
        <Skeleton className="w-48 h-8  rounded"/>
        <Skeleton className="w-full max-w-prose h-6   rounded"/>
        <Skeleton className="w-32 h-10  rounded"/>
      </div>

      {/* Product List Skeleton */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="w-48 h-8  rounded mx-auto"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="p-4 space-y-2">
                <Skeleton className="w-full h-48  rounded"/>
                <Skeleton className="w-full h-6  rounded"/>
                <Skeleton className="w-3/4 h-6  rounded"/>
              </div>
            ))}
          </div>
        </div>

        {/* Product Promotion Skeleton */}
        <Skeleton className="w-full h-40  rounded"/>

        {/* All Products Skeleton */}
        <div className="space-y-4">
          <div className="w-48 h-8  rounded mx-auto"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="p-4 space-y-2">
                <Skeleton className="w-full h-48  rounded"/>
                <Skeleton className="w-full h-6  rounded"/>
                <Skeleton className="w-3/4 h-6  rounded"/>
              </div>
            ))}
          </div>
        </div>

        {/* Ecommerce Features Skeleton */}
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton  key={index} className="w-full h-16  rounded"/>
          ))}
        </div>
      </div>
    </div>
  );
}
