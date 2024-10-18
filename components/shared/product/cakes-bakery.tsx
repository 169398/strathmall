import * as React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Cake, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CakeCard from "./cakes-card";

interface Cakes {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  slug: string;
  rating: string;
  stock: number;
  discount: string;
  category: string;
  images: string[];
}

interface CakeShowcaseProps {
  title: string;
  cakes: Cakes[];
}

const CakeShowcase: React.FC<CakeShowcaseProps> = ({ title, cakes }) => {
  const [visibleCount, setVisibleCount] = useState(8);

  const handleViewMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 8, cakes.length));
  };

  return (
    <section className="py-12 bg-gradient-to-b from-amber-50 to-white dark:from-amber-900 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Cake className="w-8 h-8 mr-2 text-amber-500" />
          <h2 className="text-3xl font-bold text-center">{title}</h2>
        </div>
        {cakes.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <React.Suspense fallback={<CakeSkeleton />}>
                {cakes.slice(0, visibleCount).map((cake) => (
                  <CakeCard key={cake.id} cake={cake} />
                ))}
              </React.Suspense>
            </motion.div>

            {visibleCount < cakes.length && (
              <div className="text-center mt-8">
                <Button
                  onClick={handleViewMore}
                  variant="default"
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  View More <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No cakes available at the moment. Check back soon</p>
          </div>
        )}
      </div>
    </section>
  );
};

const CakeSkeleton: React.FC = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <CardContent className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </CardContent>
  </Card>
);

export default CakeShowcase;
