"use client";

import React, { useState, useEffect } from "react";
import HomeSkeleton from "@/components/shared/skeletons/HomeSkeleton";
import HomeContent from "../HomeContent";

interface HomeLoaderProps {
  latestProducts: any;
  allProducts: any;
  discountedProducts: any; // Add this prop
}

const HomeLoader: React.FC<HomeLoaderProps> = ({
  latestProducts,
  allProducts,
  discountedProducts,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <HomeSkeleton />
  ) : (
    <HomeContent
      latestProducts={latestProducts}
      allProducts={allProducts}
      discountedProducts={discountedProducts}
    />
  );
};

export default HomeLoader;
