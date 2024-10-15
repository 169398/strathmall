import * as React from 'react';
import { product } from '@/types/sellerindex';
import ProductCard from './product-card';
import ProductSkeleton from './product-skeleton'; 

interface ProductListProps {
  title: React.ReactNode;
  data: product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, data }) => {
  return (
    <div className="relative">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="w-full overflow-x-auto scroll-snap-x mandatory pb-6 pt-1">
          <div className="flex gap-4 sm:gap-0.5 scroll-snap-align-start">
            {data.map((product: product, i: number) => (
              <React.Suspense fallback={<ProductSkeleton />} key={`${product.slug}${i}`}>
                <div
                  className="flex-none w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 scroll-snap-align-start animate-carousel animate-slide"
                >
                  <div className="p-1 sm:p-0">
                    <ProductCard product={product} />
                  </div>
                </div>
              </React.Suspense>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
