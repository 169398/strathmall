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
  title: React.ReactNode;
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
    <Card className="relative w-full h-auto bg-gradient-to-r from-red-50 to-orange-50 rounded-xl overflow-hidden shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            {title}
          </h2>
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-white hover:bg-gray-100 text-gray-800 border-gray-200"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-white hover:bg-gray-100 text-gray-800 border-gray-200"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {data.length > 0 ? (
          <ScrollArea className="w-full" style={{ overflow: "visible" }}>
            <div
              ref={scrollContainerRef}
              className="flex space-x-6 pb-2 transition-transform duration-500 ease-in-out"
            >
              {data.map((product, i) => (
                <React.Suspense
                  fallback={
                    <div className="w-[220px] h-[320px] bg-gray-200 animate-pulse rounded-lg" />
                  }
                  key={`${product.slug}${i}`}
                >
                  <div className="w-[220px] flex-none transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                    <DiscountedProductCard product={product} />
                  </div>
                </React.Suspense>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="bg-gray-200" />
          </ScrollArea>
        ) : (
          <p className="text-center text-gray-600 py-12">
            No products found. Please check back later.
          </p>
        )}
      </CardContent>
      <div className="sm:hidden flex justify-between items-center w-full absolute bottom-4 left-0 px-4">
        <Button
          variant="outline"
          size="icon"
          className="bg-white hover:bg-gray-100 text-gray-800 border-gray-200"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-white hover:bg-gray-100 text-gray-800 border-gray-200"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 " />
        </Button>
      </div>
      <ConfettiCannon />
    </Card>
  );
}
