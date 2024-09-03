import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ImageSlider from "../ImageSlider";
import FavoriteButton from "../FavoriteButton";

const DiscountedProductCard = ({ product }: { product: any }) => {
  const discountPercentage = (
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
    100
  ).toFixed(0);

  return (
    <Card className="w-full max-w-sm sm:max-w-xs border-red-500 border-2 shadow-lg">
      <div className="absolute top-2 right-2 z-20">
        <FavoriteButton productId={product.id} />
      </div>
      <CardHeader className="p-1">
        <Link href={`/product/${product.slug}`}>
          <div className="relative w-full aspect-square overflow-hidden rounded-md">
            <ImageSlider slug={product.images} />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 grid gap-1 sm:gap-2">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-xs sm:text-sm font-medium overflow-hidden">
            <Link href={`/product/${product.slug}`}>
              <h2 className="text-xs sm:text-sm font-medium overflow-hidden">
                {product.name}
              </h2>
            </Link>
          </h2>
        </Link>
        <div className="flex flex-col gap-1">
          <div className="text-xs sm:text-sm font-bold text-red-600 line-through">
            ksh{Number(product.originalPrice).toFixed(2)}
          </div>
          <Link href={`/product/${product.slug}`}>
            <div className="text-lg sm:text-md font-black text-green-600">
              ksh{Number(product.discountedPrice).toFixed(2)}
            </div>
          </Link>
          <Link href={`/product/${product.slug}`}>
            <div className="text-xs sm:text-sm font-bold text-red-600">
              {discountPercentage}% OFF
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountedProductCard;
