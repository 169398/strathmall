"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { product } from "@/types/sellerindex";
import { getLastViewedProducts } from "@/lib/actions/sellerproduct.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import ImageSlider from "../ImageSlider";

export default function RecentlyViewedProducts() {
  const [products, setProducts] = useState<product[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchProducts = async () => {
      if (userId) {
        const response = await getLastViewedProducts(userId);
        if (response.success && response.data && response.data.length > 0) {
          setProducts(response.data as unknown as product[]);
        }
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId]);

  // If the user is not signed in or there are no recently viewed products
  if (!userId || loading || products.length === 0) {
    return null;
  }

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-semibold mb-4">Recently Viewed Products</h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex space-x-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_20%] pl-2"
                >
                  <Card>
                    <CardContent className="p-3">
                      <Link href={`/products/${product.slug}`} passHref>
                        <div className="aspect-square relative mb-3 rounded-sm ">
                          <ImageSlider slug={product.images} />
                        </div>
                      </Link>
                      <h3 className="font-semibold text-sm mb-1">
                        <Link href={`/products/${product.slug}`} passHref>
                          <span className="text-blue-600 hover:underline">
                            {product.name}
                          </span>
                        </Link>
                      </h3>
                      <Link href={`/products/${product.slug}`} passHref>
                        <p className="text-blue-600 font-bold mb-2">
                          Ksh {product.price}
                        </p>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white shadow-md z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous products</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white shadow-md z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next products</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
