"use client";

import { useState, useEffect } from "react";
import { getProductsByCategory } from "@/lib/actions/sellerproduct.actions";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Watches = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [watches, setWatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatches = async () => {
      const response = await getProductsByCategory("Watches");
      if (response.success) {
        setWatches(response.data || []);
      }
      setLoading(false);
    };
    fetchWatches();
  }, []);

  const scrollLeft = () => setScrollPosition((prev) => Math.max(prev - 300, 0));
  const scrollRight = () =>
    setScrollPosition((prev) =>
      Math.min(prev + 300, watches.length * 300 - 900)
    );

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white">
        <div className="container rounded-sm mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center tracking-wide animate-pulse">
            Exclusive Luxury Watches
          </h2>
          {/* Loading Skeleton */}
          <div className="flex space-x-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[300px] bg-gray-700 h-64 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-1 rounded-sm bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white relative">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-12 text-center tracking-wide animate-pulse">
          Exclusive Luxury Watches
        </h2>

        {/* Watches Display */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 p-3 rounded-full shadow-md hover:shadow-xl z-10"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 p-3 rounded-full shadow-md hover:shadow-xl z-10"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </button>

          {/* Watches */}
          <div className="overflow-hidden relative">
            <div
              className="flex space-x-8 transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${scrollPosition}px)` }}
            >
              {watches.map((watch) => (
                <div
                  key={watch.id}
                  className="min-w-[300px] bg-gradient-to-b from-gray-800 to-black p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
                >
                  <a
                    href={`/product/${watch.slug}`}
                    key={watch.id}
                    className="block group"
                  >
                    <div className="relative group">
                      <Image
                        src={watch.images[0]}
                        alt={watch.name}
                        width={300}
                        height={300}
                        loading="lazy"
                        className="w-full h-64 object-cover rounded-t-lg"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                        <p className="text-white text-lg font-semibold">
                          View Details
                        </p>
                      </div>
                    </div>
                  </a>
                  <div className="text-center mt-4">
                    <h3 className="text-2xl font-bold">{watch.name}</h3>
                    <p className="text-lg mt-2 text-gray-400">{watch.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/luxury-pattern.png')] opacity-10 z-[-1]"></div>
      </div>
    </section>
  );
};

export default Watches;
