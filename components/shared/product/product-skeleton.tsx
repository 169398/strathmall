import * as React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse p-4 border border-gray-500 rounded-lg bg-white">
      <div className="h-40 bg-gray-500 rounded mb-4"></div> 
      <div className="h-6 bg-gray-500 rounded mb-2"></div>  
      <div className="h-4 bg-gray-500 rounded w-3/4 mb-2"></div>  
      <div className="h-4 bg-gray-500 rounded w-1/2"></div>  
    </div>
  );
};

export default ProductSkeleton;
