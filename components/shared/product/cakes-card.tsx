import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Cake, Heart } from "lucide-react";
import ProductPrice from "./product-price";
import ImageSlider from "../ImageSlider";
import { logProductView } from "@/lib/actions/sellerproduct.actions";
import { useSession } from "next-auth/react";

interface Cakes {
  id: string;
  slug: string;
  name: string;
  price: string;
  discount: string | null;
  rating: string;
  stock: number;
  images: string[];
}


export default function CakeCard({ cake }: { cake: Cakes }) {
  const [isHovered, setIsHovered] = useState(false);
  const isDiscounted = cake.discount && parseInt(cake.discount) > 0;
  const discountedPrice = isDiscounted
    ? (
        parseFloat(cake.price) -
        (parseFloat(cake.price) * parseFloat(cake.discount ?? "0")) / 100
      ).toFixed(2)
    : cake.price;
  // Use session to get the user's ID
  const { data: session } = useSession();
  const userId = session?.user?.id;
// Function to log product view on interaction
  const handleProductView = async () => {
    if (userId) {
      await logProductView(userId, cake.id);
    }
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="mb-4 mx-1" // Reduced the side margins
    >
      <Card
        className="w-full max-w-xs sm:max-w-sm relative overflow-hidden bg-gradient-to-br from-pink-100 to-yellow-100 dark:from-pink-900 dark:to-yellow-900"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="p-0 relative">
          <Link href={`/cake/${cake.slug}`} onClick={handleProductView}>
            <div className="relative w-full aspect-square overflow-hidden">
              <Suspense fallback={<Skeleton className="w-full h-full" />}>
                <div className="w-full h-full object-cover">
                  <ImageSlider slug={cake.images} />
                </div>
              </Suspense>
              {isDiscounted && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {cake.discount}% OFF
                </div>
              )}
            </div>
          </Link>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 grid gap-2">
          <motion.h2
            className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 truncate"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {cake.name}
          </motion.h2>
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Cake className="w-4 h-4 text-pink-500" />
              <span className="text-xs sm:text-sm text-green-500">
                in stock
              </span>
            </div>
            <div className="flex items-center">
              {isDiscounted ? (
                <>
                  <span className="text-red-500 text-xs sm:text-sm line-through mr-1 sm:mr-2">
                    <ProductPrice value={parseFloat(cake.price)} />
                  </span>
                  <span className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                    <ProductPrice value={parseFloat(discountedPrice)} />
                  </span>
                </>
              ) : (
                <span className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200">
                  <ProductPrice value={parseFloat(cake.price)} />
                </span>
              )}
            </div>
          </motion.div>
          <motion.div
            className="flex justify-between items-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className={`text-lg sm:text-xl ${
                    i < Math.round(parseFloat(cake.rating))
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * i }}
                >
                  ★
                </motion.span>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white dark:bg-gray-800 w-8 h-8 sm:w-10 sm:h-10"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isHovered ? "text-red-500 fill-red-500" : "text-gray-500"
                }`}
              />
            </Button>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link href={`/cake/${cake.slug}`} className="w-full" onClick={handleProductView}>
              <Button
                variant="default"
                size="sm"
                className="w-full text-xs sm:text-sm bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white"
              >
                View Cake
              </Button>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
