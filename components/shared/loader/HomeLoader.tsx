"use client";

import HomeSkeleton from "@/components/shared/skeletons/HomeSkeleton";
import HomeContent from "../HomeContent";

const HomeLoader = ({
  latestProducts,
  allProducts,
  discountedProducts,
  servicesData,
}: any) => {
  if (!latestProducts || !allProducts || !discountedProducts || !servicesData)
    return <HomeSkeleton />;

  return (
    <HomeContent
      latestProducts={latestProducts}
      allProducts={allProducts}
      discountedProducts={discountedProducts}
      servicesData={servicesData}
    />
  );
};

export default HomeLoader;
