'use client';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function ProductGallery({ images }: { images: { src: string; altText: string }[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImageIndex = (currentImageIndex + 1) % images.length;
  const previousImageIndex = (currentImageIndex - 1 + images.length) % images.length;

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div>
      <div className="relative aspect-square h-full max-h-[200px] w-full overflow-hidden">
        {images[currentImageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[currentImageIndex]?.altText}
            src={images[currentImageIndex]?.src}
            priority={true}
          />
        )}

        {images.length > 1 && (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
              <button
                onClick={() => handleImageChange(previousImageIndex)}
                aria-label="Previous product image"
                className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center"
                
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-50"></div>
              <button
                onClick={() => handleImageChange(nextImageIndex)}
                aria-label="Next product image"
                className="h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center"
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <ul className="my-12 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => (
            <li key={image.src} className="h-20 w-20">
              <button
                onClick={() => handleImageChange(index)}
                aria-label="Select product image"
                className="h-full w-full"
              >
                <Image
                  alt={image.altText}
                  src={image.src}
                  width={80}
                  height={80}
                  className={`h-full w-full ${index === currentImageIndex ? 'border-2 border-blue-600' : ''}`}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
