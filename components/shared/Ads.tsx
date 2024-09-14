import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ads } from "@/lib/ads";

export default function Ads() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const adImages = ads;

  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? adImages.length - 1 : prevIndex - 1
      );
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === adImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  React.useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === adImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Switch every 3 seconds

      return () => clearInterval(interval);
    }
  }, [adImages.length, isHovered]);

  return (
    <div
      className="relative w-full bg-red-500 shadow-lg rounded-sm overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold text-white">Best Deals 🎉</h2>
      </div>

      <div className="relative">
        <div className="flex items-center justify-center">
          <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
            {/* Responsive height */}
            <Image
              src={adImages[currentIndex]}
              alt={`Ad ${currentIndex + 1} of ${adImages.length}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              priority
            />
          </div>
        </div>

        <div className="hidden lg:flex justify-between items-center w-full absolute top-1/2 transform -translate-y-1/2 px-4">
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800 hover:bg-gray-700 text-white"
            onClick={() => scroll("left")}
            aria-label="Previous ad"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-800 hover:bg-gray-700 text-white"
            onClick={() => scroll("right")}
            aria-label="Next ad"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
