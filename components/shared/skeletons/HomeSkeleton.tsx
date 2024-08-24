// components/shared/skeletons/HomeSkeleton.tsx
import React from 'react';

export default function HomeSkeleton() {
  return (
    <div>
      {/* Navbar Skeleton */}
      <div className="flex items-center justify-between p-4 bg-gray-200">
        <div className="w-24 h-8 bg-gray-300 rounded"></div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-64 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center space-y-4">
        <div className="w-48 h-8 bg-gray-300 rounded"></div>
        <div className="w-full max-w-prose h-6 bg-gray-300 rounded"></div>
        <div className="w-32 h-10 bg-gray-300 rounded"></div>
      </div>

      {/* Product List Skeleton */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="p-4 space-y-2">
                <div className="w-full h-48 bg-gray-300 rounded"></div>
                <div className="w-full h-6 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Promotion Skeleton */}
        <div className="w-full h-40 bg-gray-300 rounded"></div>

        {/* All Products Skeleton */}
        <div className="space-y-4">
          <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="p-4 space-y-2">
                <div className="w-full h-48 bg-gray-300 rounded"></div>
                <div className="w-full h-6 bg-gray-300 rounded"></div>
                <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Ecommerce Features Skeleton */}
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-full h-16 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
