'use client'
import Image from 'next/image'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Suspense } from 'react'

// Skeleton fallback for main image
const MainImageSkeleton = () => (
  <div className="min-h-[300px] flex justify-center items-center bg-gray-600 dark:bg-neutral-700 animate-pulse">
    <div className="h-full w-full object-cover object-center" />
  </div>
)

// Skeleton fallback for thumbnails
const ThumbnailSkeleton = () => (
  <div className="w-[100px] h-[100px] bg-gray-600 dark:bg-neutral-700 animate-pulse mr-2" />
)

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = React.useState(0)

  return (
    <div className="space-y-4">
      <Suspense fallback={<MainImageSkeleton />}>
        <Image
          src={images[current]}
          alt="product image"
          width={1000}
          height={1000}
          loading='lazy'
          className="min-h-[300px] object-cover object-center"
        />
      </Suspense>

      <div className="flex">
        {images.map((image, index) => (
          <Suspense key={image} fallback={<ThumbnailSkeleton />}>
            <div
              className={cn(
                'border mr-2 cursor-pointer hover:border-blue-600',
                current === index && 'border-blue-500'
              )}
              onClick={() => setCurrent(index)}
            >
              <Image src={image} alt={'thumbnail image'} width={100} height={100} />
            </div>
          </Suspense>
        ))}
      </div>
    </div>
  )
}
