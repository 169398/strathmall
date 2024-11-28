"use client";

import { useEffect, useState, useRef } from "react";
import ProductPrice from "@/components/shared/product/product-price";
import QuickViewModalWrapper from "@/components/shared/product/quickview-modal-wrapper";
import Rating from "@/components/shared/product/rating";
import { getProductBySlug } from "@/lib/actions/sellerproduct.actions";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/shared/product/gallery";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useAccessibility } from "@/lib/context/AccessibilityContext";
import ReloadButton from "./[slug]/reload-button";

interface QuickViewClientProps {
  
    slug: string;
  
}

export default function QuickViewClient({ slug }: QuickViewClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const { isAccessibilityMode, speak } = useAccessibility();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await getProductBySlug(slug);
      if (!fetchedProduct) return notFound();
      setProduct(fetchedProduct);
      setIsLoading(false);
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (isAccessibilityMode && product) {
      speak(
        `Quick view for ${product.name}. 
         Description: ${product.description}. 
         Price: ${product.price} shillings. 
         Rating: ${product.rating} out of 5 stars. 
         ${product.stock > 0 ? "In stock" : "Out of stock"}`
      );
    }
  }, [isAccessibilityMode, product, speak]);

  if (isLoading) return <Loader />;
  if (!product) return notFound();

  return (
    <QuickViewModalWrapper>
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-label={`Quick view for ${product.name}`}
        aria-modal="true"
        tabIndex={-1}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8 p-6 bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg shadow-lg"
      >
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:w-1/2 rounded-sm"
            role="img"
            aria-label={`Images of ${product.name}`}
          >
            <ProductGallery
              images={product.images!.map((image: any) => ({
                src: image,
                altText: `${product.name} product image`,
                className: "rounded-sm",
              }))}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="md:w-1/2 flex flex-col gap-4"
            role="region"
            aria-label="Product details"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-bold text-amber-900 mb-2">
                  {product.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="mb-4 bg-amber-200 text-amber-800"
                  role="status"
                >
                  New Arrival
                </Badge>
              </div>
            </div>
            <Separator className="my-4 bg-amber-200" />
            <p className="text-amber-800 leading-relaxed">
              {product.description}
            </p>
            <Separator className="my-4 bg-amber-200" />
            <div
              className="flex items-center justify-between"
              role="region"
              aria-label="Product rating and price"
            >
              <div className="flex items-center gap-2">
                <Rating
                  value={Number(product.rating)}
                  aria-label={`Rated ${product.rating} out of 5 stars`}
                />
              </div>
              <ProductPrice
                value={Number(product.price)}
                className="text-2xl font-bold text-amber-900"
                aria-label={`Price: ${product.price} shillings`}
              />
            </div>
            <Separator className="my-4 bg-amber-200" />
            <div className="flex items-center justify-between">
              <ReloadButton />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </QuickViewModalWrapper>
  );
}
