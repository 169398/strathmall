"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductsByCategory } from "@/lib/actions/sellerproduct.actions";

const ShoesCategory = () => {
  const [shoes, setShoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedShoes, setDisplayedShoes] = useState<any[]>([]);

  // Fetch shoes from category
  useEffect(() => {
    const fetchShoes = async () => {
      const response = await getProductsByCategory("Shoes");
      if (response.success) {
        setShoes(response.data || []);
      }
      setLoading(false);
    };
    fetchShoes();
  }, []);

  // Determine how many shoes to display based on screen width
  const getDisplayedShoes = useCallback(
    (width: number) => {
      return width < 768 ? shoes.slice(0, 4) : shoes.slice(0, 8);
    },
    [shoes]
  );

  useEffect(() => {
    const handleResize = () => {
      setDisplayedShoes(getDisplayedShoes(window.innerWidth));
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize(); // Initial call
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [shoes, getDisplayedShoes]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-200 border border-gray-400 rounded-sm shadow-md">
        <h2 className="text-2xl font-bold mb-4">Classy Shoes</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full h-60 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 sm-text-sm">
        Level up your shoe game
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {displayedShoes.map((product) => (
          <a
            href={`/product/${product.slug}`}
            key={product.id}
            className="block group"
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src={product.images[0]}
                alt={product.name}
                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                width={300}
                loading="lazy"
                height={300}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-transparent to-transparent text-white text-center"></div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ShoesCategory;
