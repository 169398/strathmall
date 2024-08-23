import * as React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse p-4 border border-gray-600 rounded-lg bg-gray-400">
      <div className="h-40 bg-gray-600 rounded mb-4"></div> 
      <div className="h-6 bg-gray-600 rounded mb-2"></div>  
      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>  
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>  
    </div>
  );
};

export default ProductSkeleton;
