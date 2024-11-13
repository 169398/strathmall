import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import Rating from "./rating";
import { Button } from "@/components/ui/button";
import { product } from "@/types/sellerindex";
import { Suspense, useState, useEffect, useRef } from "react";
import ImageSlider from "../ImageSlider";
import { Skeleton } from "@/components/ui/skeleton";
import FavoriteButton from "../FavoriteButton";
import { useMediaQuery } from "react-responsive";
import { useSession } from "next-auth/react";
import { logProductView } from "@/lib/actions/sellerproduct.actions";
import { Badge } from "@/components/ui/badge";
import { useAccessibility } from "@/lib/context/AccessibilityContext";
import { useRouter } from "next/navigation";

const skeleton =
  "w-full h-6 animate-pulse rounded bg-gray-300 dark:bg-neutral-700";

// Helper function to calculate the discounted price
const calculateDiscountedPrice = (price: string, discount: string | null) => {
  if (discount && parseFloat(discount) > 0) {
    const originalPrice = parseFloat(price);
    const discountValue = parseFloat(discount);
    const discountedPrice =
      originalPrice - (originalPrice * discountValue) / 100;
    return discountedPrice.toFixed(2);
  }
  return price;
};

const ProductCard = ({ product }: { product: product }) => {
  const { isAccessibilityMode, speak } = useAccessibility();
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isDiscounted = product.discount && parseInt(product.discount) > 0;
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discount
  );
  const [showFavorite, setShowFavorite] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Use session to get the user's ID
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (isAccessibilityMode && cardRef.current) {
      const handleFocus = () => {
        const priceText = product.discount 
          ? `Original price ${product.price} shillings, discounted to ${discountedPrice} shillings` 
          : `${product.price} shillings`;
        
        speak(
          `Product: ${product.name}. ${priceText}. 
           Rating: ${product.rating} out of 5 stars. 
           ${product.stock > 0 ? 'In stock' : 'Out of stock'}`
        );
      };

      cardRef.current.addEventListener('focus', handleFocus);
      cardRef.current.addEventListener('mouseenter', handleFocus);

      return () => {
        cardRef.current?.removeEventListener('focus', handleFocus);
        cardRef.current?.removeEventListener('mouseenter', handleFocus);
      };
    }
  }, [isAccessibilityMode, product, speak, discountedPrice]);

  // Function to log product view on interaction
  const handleProductView = async () => {
    if (userId) {
      await logProductView(userId, product.id);
    }
  };

  return (
    <Card
      ref={cardRef}
      tabIndex={0}
      role="article"
      aria-label={`Product: ${product.name}`}
      className="w-full max-w-sm sm:max-w-xs relative focus:outline-none focus:ring-2 focus:ring-blue-500"
      onMouseEnter={() => !isMobile && setShowFavorite(true)}
      onMouseLeave={() => !isMobile && setShowFavorite(false)}
      onClick={() => isMobile && setShowFavorite(!showFavorite)}
    >
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[200px] sm:h-[300px] w-full bg-neutral-600 dark:bg-neutral-700 animate-pulse rounded">
            <div className="aspect-square object-cover rounded" />
          </div>
        }
      >
        <div
          className={`absolute top-2 right-2 z-20 transition-opacity duration-300 ${
            showFavorite ? "opacity-100" : "opacity-0"
          }`}
        >
          <FavoriteButton productId={product.id} />
        </div>

        <CardHeader className="p-1 relative z-10">
          <Link 
            href={`/product/${product.slug}`} 
            onClick={handleProductView}
            aria-label={`View details of ${product.name}`}
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-sm">
              <ImageSlider slug={product.images!} />
            </div>
          </Link>
        </CardHeader>
      </Suspense>

      <Suspense
        fallback={
          <div className="p-2 sm:p-4 grid gap-1 sm:gap-4 bg-slate-600">
            <Skeleton className={skeleton} />
            <Skeleton className={skeleton} />
            <Skeleton className={skeleton} />
            <Skeleton className={skeleton} />
          </div>
        }
      >
        <CardContent className="p-2 sm:p-4 grid gap-1 sm:gap-2">
          <Link 
            href={`/product/${product.slug}`}
            onClick={handleProductView}
            aria-label={`View details of ${product.name}`}
          >
            <h2 className="text-xs sm:text-sm font-medium overflow-hidden">
              {product.name}
            </h2>
          </Link>

          <div 
            className="flex flex-col gap-1"
            aria-label={`Product information for ${product.name}`}
          >
            <Rating 
              value={Number(product.rating)}
              aria-label={`Rated ${product.rating} out of 5 stars`}
            />
            
            {product.stock > 0 ? (
              <div role="status" aria-live="polite">
                {isDiscounted ? (
                  <div className="flex flex-col">
                    <span className="text-red-500 line-through" aria-label="Original price">
                      {`Ksh ${product.price}`}
                    </span>
                    <span className="text-2xl sm:text-sm font-black" aria-label="Discounted price">
                      {`Ksh ${discountedPrice}`}
                    </span>
                    <Badge className="absolute top-2 left-2 z-10 bg-red-600 text-white">
                      {(parseFloat(product.discount ?? "0")).toFixed(0)}% OFF
                    </Badge>
                  </div>
                ) : (
                  <ProductPrice
                    value={Number(product.price)}
                    className="text-2xl sm:text-sm font-black"
                    aria-label={`Price: ${product.price} shillings`}
                  />
                )}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-destructive" role="status">
                Out of Stock
              </p>
            )}
          </div>

          <Button
            onClick={() => router.push(`/quickview/product/${product.slug}`)}
            className="w-full"
            aria-label={`Quick view ${product.name}`}
          >
            Quick View
          </Button>
        </CardContent>
      </Suspense>
    </Card>
  );
};

export default ProductCard;
