import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse p-4 border border-gray-400 rounded-lg bg-gray-400">
      <Skeleton className="h-40 bg-gray-400 rounded mb-4"/>
      <Skeleton className="h-6 bg-gray-400 rounded mb-2"/> 
      <Skeleton className="h-4 bg-gray-400 rounded w-3/4 mb-2"/> 
      <Skeleton className="h-4 bg-gray-400 rounded w-1/2"/> 
    </div>
  );
};

export default ProductSkeleton;
