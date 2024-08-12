import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import Rating from "./rating";
import { Button } from "@/components/ui/button";
import { product } from "@/types/sellerindex";

const ProductCard = ({ product }: { product: product }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.slug}`}>
          <Image
            alt={product.name}
            className="aspect-square object-cover rounded"
            height={300}
            src={product.images![0]}
            width={300}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 grid gap-2 sm:gap-4">
        <div>
          <p className="text-xs sm:text-sm">{product.brand}</p>
        </div>
        <div>
          <Link href={`/product/${product.slug}`}>
            <h2 className="text-sm sm:text-base font-medium">{product.name}</h2>
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          <Rating
            value={Number(product.rating)}
          />
          {product.stock > 0 ? (
            <ProductPrice
              value={Number(product.price)}
              className="text-xs sm:text-sm"
            />
          ) : (
            <p className="text-xs sm:text-sm text-destructive">Out of Stock</p>
          )}
        </div>
        <div>
          <Link
            href={`/quickview/product/${[product.slug]}`}
            className="w-full"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex gap-2 w-full text-xs sm:text-sm"
            >
              <span>Quick View</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
