"use client";

import React, { useState, useEffect } from "react";
import HomeSkeleton from "@/components/shared/skeletons/HomeSkeleton";
import HomeContent from "../HomeContent";

interface HomeLoaderProps {
  latestProducts: any;
  allProducts: any;
  discountedProducts: any;
  Ads: any;
}

const HomeLoader: React.FC<HomeLoaderProps> = ({
  latestProducts,
  allProducts,
  discountedProducts,
  Ads,
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
      Ads={Ads}
    />
  );
};

export default HomeLoader;
