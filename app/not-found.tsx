'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <div className="relative w-full max-w-lg mx-auto">
        <Image
          src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728757718/not-found_ovodoc.svg"
          alt="Not Found"
          width={400}
          height={400}
          className="mx-auto"
        />
      </div>
      <h1 className="mt-2 text-4xl font-bold">Oops! Page not found.</h1>
      <p className="mt-2 text-lg text-center">
        Sorry, the page you&apos;re looking for doesn&apos;t exist. You may have
        mistyped the address
      </p>
      <Button
        variant="default"
        className="mt-4 ml-2 "
        onClick={() => (window.location.href = "/")}
        aria-label="Take me home"
      >
        Take me home
      </Button>
    </div>
  );
}
