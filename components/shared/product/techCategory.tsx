"use client";

import { useState, useEffect } from "react";
import { getProductsByCategory } from "@/lib/actions/sellerproduct.actions";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Electronics = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [accessories, setAccessories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the products
  useEffect(() => {
    const fetchAccessories = async () => {
      const response = await getProductsByCategory("Electronics");
      if (response.success) {
        setAccessories(response.data || []);
      }
      setLoading(false);
    };
    fetchAccessories();
  }, []);

  // Scrolling functionality
  const scrollLeft = () => {
    setScrollPosition((prev) => Math.max(prev - 300, 0)); // Scroll left, and limit it to zero
  };

  const scrollRight = () => {
    const maxScroll = accessories.length * 300 - 900; // Prevent scrolling beyond available products
    setScrollPosition((prev) => Math.min(prev + 300, maxScroll));
  };

  if (loading) {
    return (
      <div className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 sm:text-lg">
            Best Sellers in Computers & Accessories
          </h2>
          {/* Skeleton loading */}
          <div className="flex space-x-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[200px] md:min-w-[250px] lg:min-w-[300px] bg-gray-300 h-40 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-gray-100">
      <div className="container mx-auto px-4 relative">
        
        <h2 className="text-3xl font-semibold mb-6  md:text-2xl lg:text-3xl sm:text-sm">
            Best Sellers in Computers & Accessories
        </h2>

        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl z-10"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl z-10"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        </button>

        {/* Products */}
        <div className="overflow-hidden relative">
          <div
            className="flex space-x-4 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {accessories.map((product) => (
              <div
                key={product.id}
                className="min-w-[200px] md:min-w-[250px] lg:min-w-[300px]"
              >
                <a
                  href={`/product/${product.slug}`}
                  key={product.id}
                  className="block group"
                >
                  <div className="bg-white   shadow-md hover:shadow-lg transition-shadow duration-300">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-60 rounded-sm object-cover "
                      width={300}
                      loading="lazy"
                      height={300}
                    />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Electronics;
