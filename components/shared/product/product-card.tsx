import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import Rating from "./rating";
import { Button } from "@/components/ui/button";
import { product } from "@/types/sellerindex";
import { Suspense } from "react";
import ImageSlider from "../ImageSlider";
import { Skeleton } from "@/components/ui/skeleton";
import FavoriteButton from "../FavoriteButton";

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
  const isDiscounted = product.discount && parseInt(product.discount) > 0;
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discount
  );

  return (
    <Card className="w-full max-w-sm sm:max-w-xs relative">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[200px] sm:h-[300px] w-full bg-neutral-600 dark:bg-neutral-700 animate-pulse rounded">
            <div className="aspect-square object-cover rounded" />
          </div>
        }
      >
        <div className="absolute top-2 right-2 z-20">
          <FavoriteButton productId={product.id} />
        </div>
        <CardHeader className="p-1 relative z-10">
          <Link href={`/product/${product.slug}`}>
            <div className="relative w-full aspect-square overflow-hidden rounded-sm">
              <ImageSlider slug={product.images!}  />
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
          <div>
            <Link href={`/product/${product.slug}`}>
              <h2 className="text-xs sm:text-sm font-medium overflow-hidden">
                {product.name}
              </h2>
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <Rating value={Number(product.rating)} />
            {product.stock > 0 ? (
              isDiscounted ? (
                <div className="flex flex-col">
                  <span className="text-red-500 line-through">{`Ksh ${product.price}`}</span>
                  <span className="text-2xl sm:text-sm font-black">{`Ksh ${discountedPrice}`}</span>
                  <span className="text-red-500">{`-${product.discount}%`}</span>
                </div>
              ) : (
                <ProductPrice
                  value={Number(product.price)}
                  className="text-2xl sm:text-sm font-black"
                />
              )
            ) : (
              <p className="text-xs sm:text-sm text-destructive">
                Out of Stock
              </p>
            )}
          </div>
          <div>
            <Link
              href={`/quickview/product/${product.slug}`}
              className="w-full"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 w-full text-xs sm:text-ms"
              >
                <span>Quick View</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Suspense>
    </Card>
  );
};

export default ProductCard;
