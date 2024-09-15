"use client";

import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getUserFavorites,
  removeProductFromFavorites,
} from "@/lib/actions/sellerproduct.actions";

interface FavoriteProduct {
  id: string;
  slug: string;
  images: string[];
  name: string;
  originalPrice: string;
  discount: string | null;
  discountedPrice: number;
}

export default function FavoriteProductsSheet() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchFavorites();
    }
  }, [isOpen]);

  const fetchFavorites = async () => {
    const response = await getUserFavorites();
    if (response.success && response.data) {
      setFavorites(response.data);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    const response = await removeProductFromFavorites(productId);
    if (response.success) {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((product) => product.id !== productId)
      );
    }
  };

  const handleViewProduct = (slug: string) => {
    router.push(`/product/${slug}`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Heart className="mr-2 text-red-600 cursor-pointer" />
      </SheetTrigger>
      <SheetContent className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Favorites
        </h2>
        {favorites.length === 0 ? (
          <p className="text-gray-500">You have no favorite products.</p>
        ) : (
          <div className="space-y-4">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    width={64}
                    height={64}
                  />
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 overflow-x-hidden">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ksh
                      {Number(
                        product.discountedPrice || product.originalPrice
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleViewProduct(product.slug)}
                    variant="secondary"
                    aria-label="View product"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleRemoveFavorite(product.id)}
                    variant="destructive"
                    aria-label="Remove from favorites"
                    
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
