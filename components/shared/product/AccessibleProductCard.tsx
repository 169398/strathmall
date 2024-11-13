import { useAccessibility } from '@/lib/context/AccessibilityContext';
import { useEffect, useRef } from 'react';
import { product } from '@/types/sellerindex';

export function AccessibleProductCard({ product }: { product: product }) {
  const { isAccessibilityMode, speak } = useAccessibility();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || !isAccessibilityMode) return;

    const handleFocus = () => {
      const description = `Product: ${product.name}. Price: ${product.price} shillings. Rating: ${product.rating} stars. ${product.stock > 0 ? 'In stock' : 'Out of stock'}`;
      speak(description);
    };

    element.addEventListener('focus', handleFocus);
    element.addEventListener('mouseenter', handleFocus);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('mouseenter', handleFocus);
    };
  }, [product, isAccessibilityMode, speak]);

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      role="article"
      aria-label={`Product: ${product.name}`}
      className="focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {/* Your existing ProductCard content */}
    </div>
  );
} 