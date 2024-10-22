import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImageSlider from "../ImageSlider";
import FavoriteButton from "../FavoriteButton";
import { motion } from "framer-motion";

export default function DiscountedProductCard({ product }: { product: any }) {
  const discountPercentage = (
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
    100
  ).toFixed(0);



  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className="w-full max-w-sm sm:max-w-xs overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
       
      >
        
          <FavoriteButton productId={product.id} />
        <Badge className="absolute top-2 left-2 z-10 bg-red-600 text-white">
          {discountPercentage}% OFF
        </Badge>
        <CardHeader className="p-0">
          <Link href={`/product/${product.slug}`}>
            <div className="relative w-full aspect-square overflow-hidden">
              <ImageSlider slug={product.images} />
            </div>
          </Link>
        </CardHeader>
        <CardContent className="p-4 grid gap-2">
          <Link href={`/product/${product.slug}`}>
            <h2 className="text-sm font-medium line-clamp-2 hover:underline">
              {product.name}
            </h2>
          </Link>
                    <Link href={`/product/${product.slug}`}>

          <div className="flex items-baseline justify-between">
            <div className="text-xs font-medium text-muted-foreground line-through">
              ksh{Number(product.originalPrice).toFixed(2)}
            </div>
            <div className="text-lg font-bold text-green-600">
              ksh{Number(product.discountedPrice).toFixed(2)}
            </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
