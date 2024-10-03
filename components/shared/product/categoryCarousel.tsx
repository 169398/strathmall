import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const categories = [
  { name: "Electronics", imgSrc: "/assets/images/electronics.jpg" },
  { name: "Shoes", imgSrc: "/assets/images/shoesnew.png" },
  { name: "Watches", imgSrc: "/assets/images/Watches.jpg" },
  {
    name: "Computer-accessories",
    imgSrc: "/assets/images/Computer-accessories.jpg",
  },
  { name: "BluetoothSpeakers", imgSrc: "/assets/images/Bluetoothspeaker.jpg" },
  { name: "Phonecovers", imgSrc: "/assets/images/phonecovers.png" },
  { name: "Gaming", imgSrc: "/assets/images/Gaming.jpg" },
  { name: "Earphones", imgSrc: "/assets/images/earphones.jpg" },
  { name: "Earpods", imgSrc: "/assets/images/earpods.png" },
  { name: "Phone-accessories", imgSrc: "/assets/images/phone-accessories.jpg" },
  { name: "Men's Clothing", imgSrc: "/assets/images/mensclothing.jpg" },
  { name: "Cleaning-Supplies", imgSrc: "/assets/images/cleaningsupplies.jpg" },
  { name: "Women's Clothing", imgSrc: "/assets/images/womensclothing.jpg" },
  { name: "Books", imgSrc: "/assets/images/books.jpg" },
  { name: "Home-Kitchen", imgSrc: "/assets/images/homekitchen.jpeg" },
  { name: "Toys-Entertainment", imgSrc: "/assets/images/toys.png" },
  { name: "Beauty-Personal Care", imgSrc: "/assets/images/personalcare.jpg" },
  { name: "Furniture", imgSrc: "/assets/images/furniture.jpg" },
  { name: "Sports and Entertainment", imgSrc: "/assets/images/sports.jpg" },
  {
    name: "Hair extensions-Wigs",
    imgSrc: "/assets/images/Hair-extensions.jpg",
  },
];

export default function CategoryCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (container && !isHovered) {
      const scrollSpeed = 20;
      let scrollStep = 1;

      const scroll = () => {
        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth - 1
        ) {
          container.scrollLeft = 0; // Continuously scroll without jumping
        } else {
          container.scrollLeft += scrollStep;
        }
      };

      const intervalId = setInterval(scroll, scrollSpeed);

      return () => clearInterval(intervalId);
    }
  }, [isHovered]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
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
      <div className="hidden lg:flex absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
        <button
          className="bg-white p-2 rounded-full shadow-md"
          onClick={scrollLeft}
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <div className="hidden lg:flex absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
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
        className="flex flex-col space-y-6 px-4 lg:px-16 rounded-sm overflow-x-auto lg:overflow-hidden scroll-smooth scrollbar-hide"
        style={{ whiteSpace: "nowrap", touchAction: "pan-x" }}
      >
        <div className="flex space-x-4 lg:space-x-6">
          {firstRowCategories.map((category, index) => (
            <Link
              key={index}
              href={`/search?category=${encodeURIComponent(category.name)}`}
              passHref
            >
              <div className="flex-shrink-0 text-center cursor-pointer">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                  <Image
                    src={category.imgSrc}
                    alt={category.name}
                    className="object-cover object-center w-full h-full"
                    width={128}
                    height={128}
                    quality={100}
                  />
                </div>
                <p className="text-center text-sm font-medium text-gray-800 mt-2">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex space-x-4 lg:space-x-6">
          {secondRowCategories.map((category, index) => (
            <Link
              key={index}
              href={`/search?category=${encodeURIComponent(category.name)}`}
              passHref
            >
              <div className="flex-shrink-0 text-center cursor-pointer">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                  <Image
                    src={category.imgSrc}
                    alt={category.name}
                    className="object-cover object-center w-full h-full"
                    width={128}
                    height={128}
                    quality={100}
                  />
                </div>
                <p className="text-center text-sm font-medium text-gray-800 mt-2">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
