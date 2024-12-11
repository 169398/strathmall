"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicCanvas = dynamic(
  () => import(".//dynamic-canvas").then((mod) => mod.CanvasComponent),
  { ssr: false }
);

export function CanvasRevealEffect({ children, ...props }: { 
  children: React.ReactNode;
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <DynamicCanvas {...props}>{children}</DynamicCanvas>;
}
