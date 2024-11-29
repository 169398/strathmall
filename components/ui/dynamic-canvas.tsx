"use client";

import React, { useEffect, useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(
  () => import('@react-three/fiber').then((mod) => {
    const { Canvas } = mod;
    const DynamicCanvasComponent = ({ children }: { children: React.ReactNode }) => (
      <Canvas>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    );
    DynamicCanvasComponent.displayName = 'DynamicCanvasComponent';
    return DynamicCanvasComponent;
  }),
  { ssr: false }
);

export function CanvasComponent({
  children,
  containerClassName,
  showGradient = true,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  showGradient?: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn("h-full relative bg-white w-full", containerClassName)}>
      <div className="h-full w-full">
        <DynamicCanvas>{children}</DynamicCanvas>
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />
      )}
    </div>
  );
}
