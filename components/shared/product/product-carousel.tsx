'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { product } from '@/types/sellerindex'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

// Skeleton fallback for carousel item
const CarouselItemSkeleton = () => (
  <div className="relative w-full h-64 bg-gray-600 dark:bg-neutral-700 animate-pulse" />
)

export default function ProductCarousel({ data }: { data: product[] }) {
  return (
    <Carousel
      className="w-full mb-12"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product: product) => (
          <Suspense key={product.id} fallback={<CarouselItemSkeleton />}>
            <CarouselItem>
              <Link href={`/product/${product.slug}`}>
                <div className="relative mx-auto">
                  <Image
                    alt={product.name}
                    src={product.banner!}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-full h-auto"
                  />
                         
                          
                          

                  <div className="absolute inset-0 flex items-end justify-center">
                    <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                      {product.name}
                    </h2>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          </Suspense>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
