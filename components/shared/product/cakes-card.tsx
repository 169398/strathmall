"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cake, Heart } from "lucide-react";
import { product } from "@/types/sellerindex";
import ImageSlider from "../ImageSlider";



const CakeCard = ({ product }: { product: product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className="w-full max-w-sm sm:max-w-xs relative overflow-hidden"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onClick={() => isMobile && setIsHovered(!isHovered)}
      >
        <CardHeader className="p-0 relative">
          <Link href={`/product/${product.slug}`}>
            <div className="relative w-full aspect-square overflow-hidden  ">
              <div className="transition-transform duration-300 ease-in-out transform hover:scale-110">
                <ImageSlider slug={product.images!} />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
            </div>
          </Link>
          <motion.div
            className="absolute top-2 right-2 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button size="icon" variant="secondary" className="rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
          </motion.div>
        </CardHeader>
        <CardContent className="p-4">
          <Link href={`/product/${product.slug}`}>
            <h2 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors duration-300">
                          {product.name}
            </h2>
          </Link>
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-blue-600">
                          Ksh{product.price}
                          
                      </span>
                      
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href={`/quickview/product/${product.slug}`}
              className="w-full"
            >
              <Button
                variant="default"
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Cake className="mr-2 h-4 w-4" />
                View Cake
              </Button>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CakeCard;
