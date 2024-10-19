"use client";

import { useEffect, useState } from "react";
import ProductPrice from "@/components/shared/product/product-price";
import QuickViewModalWrapper from "@/components/shared/product/quickview-modal-wrapper";
import Rating from "@/components/shared/product/rating";
import { getProductBySlug } from "@/lib/actions/sellerproduct.actions";
import { notFound } from "next/navigation";
import ReloadButton from "./reload-button";
import { ProductGallery } from "@/components/shared/product/gallery";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

export default function StorefrontProductQuickView({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const fetchedProduct = await getProductBySlug(slug);
      if (!fetchedProduct) return notFound();
      setProduct(fetchedProduct);
      setIsLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (isLoading) return <Loader />;
  if (!product) return notFound();

  return (
    <QuickViewModalWrapper>
      <motion.div
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
          >
            <ProductGallery
              images={product.images!.map((image: any) => ({
                src: image,
                altText: product.name,
                className: "rounded-sm",
              }))}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="md:w-1/2 flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-bold text-amber-900 mb-2">
                  {product.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="mb-4 bg-amber-200 text-amber-800"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rating value={Number(product.rating)} />
                {/* I will add this later not now">}
                {/* <span className="text-sm text-amber-700">
                  (Based on {product.rating} reviews)
                </span> */}
              </div>
              <ProductPrice
                value={Number(product.price)}
                className="text-2xl font-bold text-amber-900"
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
