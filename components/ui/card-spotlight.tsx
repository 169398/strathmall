"use client";

import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React, { MouseEvent as ReactMouseEvent, useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

const DynamicCanvasRevealEffect = dynamic(
  () => import('./canvas-reveal-effect').then((mod) => mod.CanvasRevealEffect),
  { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-transparent" />
  }
);

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#262626",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const maskImage = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, white, transparent 80%)`;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "group/spotlight p-10 rounded-md relative border border-neutral-800 bg-black dark:border-neutral-800",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute z-0 -inset-px rounded-md opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          backgroundColor: color,
          maskImage,
        }}
      >
        <Suspense fallback={null}>
          {isHovering && typeof window !== 'undefined' && (
            <DynamicCanvasRevealEffect
              containerClassName="bg-transparent absolute inset-0 pointer-events-none"
              colors={[[59, 130, 246], [139, 92, 246]]}
              dotSize={3}
            >
              {children}
            </DynamicCanvasRevealEffect>
          )}
        </Suspense>
      </motion.div>
    </div>
  );
};
