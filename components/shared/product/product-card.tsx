"use client";

import { Eye } from "lucide-react";
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
import AddToCart from "./add-to-cart";
import { round2 } from "@/lib/utils";
import { getMyCart } from "@/lib/actions/sellercart.actions";
import { Cart } from "@/types";


const ProductCard = ({ product }: { product: product }) => {
  const { isAccessibilityMode, speak } = useAccessibility();
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [cart, setCart] = useState<Cart
    | undefined>(undefined);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchCart = async () => {
      const cartData = await getMyCart();
      setCart(cartData);
    };
    fetchCart();
  }, []);

  const isDiscounted = product.discount && parseInt(product.discount) > 0;
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discount
  );

  // Accessibility handlers
  useEffect(() => {
    if (isAccessibilityMode && cardRef.current) {
      const handleFocus = () => {
        const priceText = isDiscounted
          ? `Original price ${product.price} shillings, discounted to ${discountedPrice} shillings`
          : `${product.price} shillings`;
        speak(
          `Product: ${product.name}. ${priceText}. Rating: ${
            product.rating
          } out of 5 stars. ${product.stock > 0 ? "In stock" : "Out of stock"}`
        );
      };

      cardRef.current.addEventListener("focus", handleFocus);
      cardRef.current.addEventListener("mouseenter", handleFocus);

      return () => {
        cardRef.current?.removeEventListener("focus", handleFocus);
        cardRef.current?.removeEventListener("mouseenter", handleFocus);
      };
    }
  }, [isAccessibilityMode, product, speak, discountedPrice, isDiscounted]);

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
      className="group w-full max-w-sm sm:max-w-xs relative focus:outline-none focus:ring-2 focus:ring-primary"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => isMobile && setIsHovered(!isHovered)}
    >
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[200px] sm:h-[300px] w-full bg-muted animate-pulse rounded">
            <div className="aspect-square object-cover rounded" />
          </div>
        }
      >
        <CardHeader className="p-1 relative">
          {/* Discount Badge */}
          {isDiscounted && (
            <Badge className="absolute top-2 left-2 z-20 bg-red-600 text-white">
              {parseFloat(product.discount ?? "0").toFixed(0)}% OFF
            </Badge>
          )}

          {/* Quick View Button */}
          <Button
            variant="secondary"
            size="sm"
            className={`absolute bottom-4 left-4 z-20 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => router.push(`/quickview/product/${product.slug}`)}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Quick View
          </Button>

          {/* Favorite Button */}
          <div
            className={`absolute top-2 right-2 z-20 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <FavoriteButton productId={product.id} />
          </div>

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
          <div className="p-2 sm:p-4 grid gap-1 sm:gap-4">
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
          </div>
        }
      >
        <CardContent className="p-3 grid gap-2 relative">
          <Link
            href={`/product/${product.slug}`}
            onClick={handleProductView}
            className="group-hover:text-primary transition-colors"
          >
            <h2 className="text-sm font-medium line-clamp-2">{product.name}</h2>
          </Link>

          <div className="flex items-center gap-2">
            <Rating value={Number(product.rating)} />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.numReviews} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            {isDiscounted && (
              <span className="text-sm text-muted-foreground line-through">
                Ksh {product.price}
              </span>
            )}
            <ProductPrice
              value={Number(discountedPrice)}
              className="text-lg font-bold text-primary"
            />
          </div>

          {product.stock <= 10 && product.stock > 0 && (
            <p className="text-xs text-orange-500">Only {product.stock} left</p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-destructive">Out of Stock</p>
          )}

          <div className="absolute bottom-2 right-2">
            <AddToCart
              cart={cart}
              item={{
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(discountedPrice ?? round2(product.price)),
                qty: 1,
                image: product.images![0],
              }}
              variant="icon"
            />
          </div>
        </CardContent>
      </Suspense>
    </Card>
  );
};

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

export default ProductCard;
