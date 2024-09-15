import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import ConfettiCannon from "@/components/magicui/confetti";

interface Product {
  slug: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  images: string[];
}

interface DiscountedProductListProps {
  title: string;
  data: Product[];
}

const DiscountedProductCard = React.lazy(
  () => import("./discountedProductCard")
);

export default function DiscountedProductList({
  title,
  data,
}: DiscountedProductListProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Card className="relative w-full bg-gradient-to-r from-blue-500 to-pink-500 shadow-lg rounded-lg overflow-hidden">
      <CardContent className="p-6">
        {/* Rice Advertisement Section */}
        <div className="mb-6 bg-yellow-300 rounded-lg p-4 text-center">
          <h2 className="text-2xl font-bold text-black mb-2">
            Special Rice Offer!
          </h2>
          <p className="text-lg text-black mb-4">
            Get the best quality rice at unbeatable prices.
          </p>
          <Button className="bg-green-500 text-white hover:bg-green-600" aria-label="shop now">
            Shop Now
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
        </div>
        {data.length > 0 ? (
          <ScrollArea>
            <div
              ref={scrollContainerRef}
              className="flex space-x-6 pb-4 transition-transform duration-500 ease-in-out"
            >
              {data.map((product, i) => (
                <React.Suspense
                  fallback={
                    <div className="w-[250px] h-[350px] bg-muted animate-pulse rounded-lg" />
                  }
                  key={`${product.slug}${i}`}
                >
                  <div className="w-[250px] flex-none transition-transform transform hover:-translate-y-2 hover:scale-105 duration-300 ease-in-out">
                    <DiscountedProductCard product={product} />
                  </div>
                </React.Suspense>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <p className="text-center text-white">No discounted products found</p>
        )}
      </CardContent>
      <div className="hidden lg:flex justify-between items-center w-full absolute top-1/2 transform -translate-y-1/2 px-4">
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-600 hover:bg-gray-500 text-white"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-gray-600 hover:bg-gray-500 text-white"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <ConfettiCannon />
    </Card>
  );
}
