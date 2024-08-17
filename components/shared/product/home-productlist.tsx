import * as React from 'react';
import { product } from '@/types/sellerindex';
import ProductCard from './product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ProductListProps {
  title: string;
  data: product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, data }) => {
  return (
    <div className="relative">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="relative">
          <Carousel className="w-full overflow-x-auto scroll-snap-x mandatory">
            <CarouselContent className="flex space-x-4 scroll-snap-align-start">
              {data.map((product: product) => (
                <CarouselItem key={product.slug} className="flex-none w-1/2 lg:w-1/4 scroll-snap-align-start">
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Hide buttons on small screens */}
            <CarouselPrevious className="hidden md:flex absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full" />
            <CarouselNext className="hidden md:flex absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full" />
          </Carousel>
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
