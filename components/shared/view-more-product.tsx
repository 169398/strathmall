'use client';

import * as React from 'react';
import { useState } from 'react';
import { product } from '@/types/sellerindex';

import { Button } from '@/components/ui/button';
import ProductSkeleton from './product/product-skeleton';
import ProductCard from './product/product-card';

interface ViewMoreProps {
  data: product[];
  initialCount?: number;
  incrementBy?: number;
}

const ViewMore: React.FC<ViewMoreProps> = ({
  data,
  initialCount = 24,
  incrementBy = 12,
}) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  const handleViewMore = () => {
    setVisibleCount((prevCount) => prevCount + incrementBy);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {data.slice(0, visibleCount).map((product: product, i: number) => (
          <React.Suspense fallback={<ProductSkeleton />} key={`${product.slug}${i}`}>
            <div className="p-1 sm:p-2">
              <ProductCard product={product} />
            </div>
          </React.Suspense>
        ))}
      </div>
      {visibleCount < data.length && (
        <div className="text-center mt-4">
          <Button onClick={handleViewMore} variant="default" className="w-full sm:w-auto"aria-label='view more'>
            View More
          </Button>
        </div>
      )}
    </>
  );
};

export default ViewMore;
