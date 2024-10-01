"use client";

import HomeSkeleton from "@/components/shared/skeletons/HomeSkeleton";
import HomeContent from "../HomeContent";

const HomeLoader = ({
  latestProducts,
  allProducts,
  discountedProducts,
  
  // Ads,
}: any) => {
  if (!latestProducts || !allProducts || !discountedProducts)
    return <HomeSkeleton />;

  return (
    <HomeContent
      latestProducts={latestProducts}
      allProducts={allProducts}
      discountedProducts={discountedProducts}
      // Ads={Ads}

    />
  );
};

export default HomeLoader;
