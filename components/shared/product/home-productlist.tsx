import * as React from 'react';
import { product } from '@/types/sellerindex';
import ProductCard from './product-card';

interface ProductListProps {
  title: string;
  data: product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, data }) => {
  return (
    <div className="relative">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="w-full overflow-x-auto scroll-snap-x mandatory pb-6 pt-1">
          <div className="flex gap-4 scroll-snap-align-start">
            {data.map((product: product, i: number) => (
              <div
                key={`${product.slug}${i}`}
                className="flex-none w-full lg:w-1/4 scroll-snap-align-start animate-carousel animate-slide"
              >
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </div>
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
