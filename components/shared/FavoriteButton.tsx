"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  addProductToFavorites,
  removeProductFromFavorites,
} from "@/lib/actions/sellerproduct.actions";
import { useToast } from "@/components/ui/use-toast"


interface FavoriteButtonProps {
  productId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ productId }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast(); // Use the custom toast hook

  const handleFavoriteClick = async () => {
    try {
      let response;
      if (isFavorited) {
        // Handle unfavoriting logic
        response = await removeProductFromFavorites(productId);
          toast({
              variant: "default",
              description: "Product removed from favorites",
          }
        ); 
      } else {
        // Handle favoriting logic
        response = await addProductToFavorites(productId);
          toast({
                variant: "default",
                description: response.message,
        }); // Display success toast
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
        toast({
            variant: "destructive",
            description: error instanceof Error ? error.message : String(error),
      }); 
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("text-red-500", { "animate-bounce": isFavorited })}
      onClick={handleFavoriteClick}
      aria-label="Favorite"
    >
      <Heart
        fill={isFavorited ? "currentColor" : "none"}
        className="transition-colors"
      />
    </Button>
  );
};

export default FavoriteButton;
