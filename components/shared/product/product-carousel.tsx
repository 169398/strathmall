'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { sellerProduct } from '@/types/sellerindex'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductCarousel({ data }: { data: sellerProduct[] }) {
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
        {data.map((sellerProduct: sellerProduct) => (
          <CarouselItem key={sellerProduct.id}>
            <Link href={`/sellerProduct/${sellerProduct.slug}`}>
              <div className="relative   mx-auto  ">
                <Image
                  alt={sellerProduct.name}
                  src={sellerProduct.banner!}
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white  ">
                    {sellerProduct.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
