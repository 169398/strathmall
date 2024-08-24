'use client';
import React, { useState, useEffect } from 'react';
import HomeSkeleton from '@/components/shared/skeletons/HomeSkeleton';
import HomeContent from '../HomeContent';

interface HomeLoaderProps {
  latestProducts: any;
  allProducts: any;
}

const HomeLoader: React.FC<HomeLoaderProps> = ({ latestProducts, allProducts }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  return loading ? <HomeSkeleton /> : <HomeContent latestProducts={latestProducts} allProducts={allProducts} />;
};

export default HomeLoader;
