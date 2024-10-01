import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link from Next.js
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const categories = [
  { name: "Electronics", imgSrc: "/images/costume.jpg" },
  { name: "Shoes", imgSrc: "/images/sports.jpg" },
  { name: "Watches", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Computer-accessories", imgSrc: "/images/computer.jpg" },
  { name: "BluetoothSpeakers", imgSrc: "/images/pets.jpg" },
  { name: "Phonecovers", imgSrc: "/images/home.jpg" },
  { name: "Gaming", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Earphones", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Earpods", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Phone-accessories", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Men's Clothing", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Cleaning-Supplies", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Women's Clothing", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Books", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Home-Kitchen", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Toys-Entertainment", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Beauty-Personal Care", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Bakery", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Furniture", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Sports and Entertainment", imgSrc: "/images/mens-clothing.jpg" },
  { name: "Hair extensions-Wigs", imgSrc: "/images/mens-clothing.jpg" },
];

export default function CategoryCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (container && !isHovered) {
      const scrollSpeed = 20; 
      let scrollStep = 1;
      let resetTimeout: ReturnType<typeof setTimeout>;

      const scroll = () => {
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth
        ) {
          clearTimeout(resetTimeout);
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += scrollStep;
        }
      };

      const intervalId = setInterval(scroll, scrollSpeed);

      // Cleanup on unmount
      return () => {
        clearInterval(intervalId);
        clearTimeout(resetTimeout);
      };
    }
  }, [isHovered]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 300; 
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 300; 
    }
  };

  const half = Math.ceil(categories.length / 2);
  const firstRowCategories = categories.slice(0, half);
  const secondRowCategories = categories.slice(half);

  return (
    <div
      className="relative bg-white container overflow-hidden rounded-sm h-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-center text-2xl font-bold mb-6">
        Shop by Categories
      </h2>

      {/* Arrows for larger screens */}
      <div className="hidden lg:block absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
        <button
          className="bg-white p-2 rounded-full shadow-md"
          onClick={scrollLeft}
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <div className="hidden lg:block absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
        <button
          className="bg-white p-2 rounded-full shadow-md"
          onClick={scrollRight}
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Categories container - 2 rows */}
      <div
        ref={containerRef}
        className="flex flex-col space-y-6 px-16 rounded-sm overflow-x-auto lg:overflow-hidden scroll-smooth scrollbar-hide"
        style={{ whiteSpace: "nowrap", touchAction: "pan-x" }}
      >
        <div className="flex space-x-6">
          {firstRowCategories.map((category, index) => (
            <Link
              key={index}
              href={`/search?category=${encodeURIComponent(category.name)}`}
              passHref
            >
              <div className="flex-shrink-0 text-center cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  <Image
                    src={category.imgSrc}
                    alt={category.name}
                    className="w-32 h-32 rounded-full object-cover"
                    width={128}
                    height={128}
                  />
                  <p className="text-center text-sm font-medium text-gray-800">
                    {category.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex space-x-6">
          {secondRowCategories.map((category, index) => (
            <Link
              key={index}
              href={`/search?category=${encodeURIComponent(category.name)}`}
              passHref
            >
              <div className="flex-shrink-0 text-center cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  <Image
                    src={category.imgSrc}
                    alt={category.name}
                    className="w-32 h-32 rounded-sm object-cover"
                    width={128}
                    height={128}
                  />
                  <p className="text-center text-sm font-medium text-gray-800">
                    {category.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
