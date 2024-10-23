"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  Search } from "lucide-react";
import { getProductsByCategory } from "@/lib/actions/sellerproduct.actions";
import CakeShowcase from "@/components/shared/product/cakes-bakery";
import { Input } from "@/components/ui/input";

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

export default function BakeryPage() {
  const [cakes, setCakes] = useState<Cakes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCakes = async () => {
      const response = await getProductsByCategory("Food-Bakery");
      if (response.success) {
        setCakes(
          (response.data || []).map((cake: any) => ({
            ...cake,
            price: cake.discountedPrice.toString(),
          }))
        );
      }
      setLoading(false);
    };
    fetchCakes();
  }, []);

  const filteredCakes = cakes.filter((cake) =>
    cake.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen pt-6 lg:pt-0 bg-gradient-to-b from-amber-50 to-white dark:from-amber-900 dark:to-background">
      <div className="container mx-auto px-0 py-4 lg:px-4 lg:py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
            Sweet Delights Bakery
          </h1>
          <p className="text-center text-lg mb-8 max-w-2xl mx-auto">
            Discover our delectable range of cakes, crafted with love and the
            finest ingredients.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full md:w-96">
            <Input
              type="text"
              placeholder="Search cakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
        </motion.div>

        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
                >
                  <div className="animate-pulse">
                    <div className="bg-gray-300 dark:bg-gray-700 h-48 rounded-md mb-4"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <CakeShowcase title="Our Signature Cakes" cakes={filteredCakes} />
            </motion.div>
          )}
        </AnimatePresence>

        
      </div>
    </main>
  );
}
