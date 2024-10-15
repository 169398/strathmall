'use client';
import * as React from 'react';
import { useState } from 'react';
import { product } from '@/types/sellerindex';
import ProductCard from './product-card';
import ProductSkeleton from './product-skeleton';
import { Button } from '@/components/ui/button';

interface AllProductListProps {
  title: React.ReactNode;
  data: product[];
}

const AllProductList: React.FC<AllProductListProps> = ({ title, data }) => {
  const [visibleCount, setVisibleCount] = useState(12);

  const handleViewMore = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

  return (
    <div className="relative">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <>
<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
{data.slice(0, visibleCount).map((product: product, i: number) => (
    <React.Suspense fallback={<ProductSkeleton />} key={`${product.slug}${i}`}>
      <div className="  flex-none p-0.5 sm:p-1">
        <ProductCard product={product} />
      </div>
    </React.Suspense>
  ))}
</div>
          {visibleCount < data.length && (
            <div className="text-center mt-2">
              <Button onClick={handleViewMore} variant="default" aria-label='view more'>
                View More <span role="img" aria-label="sparkles"></span>
              </Button>
            </div>
          )}
        </>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  );
};

export default AllProductList;
