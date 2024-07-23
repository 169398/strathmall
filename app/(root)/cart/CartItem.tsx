import { formatCurrency } from "@/lib/utils";
import { removeItemFromCart } from "@/lib/actions/cart.actions";
import Image from "next/image";
import { Cart } from "@/types";
import { X } from "lucide-react";
import Link from "next/link";

const CartItem = ({ cart }: { cart?: Cart }) => {

  // Handle item removal
  const removeItem = async (productId: string) => {
   
      const res = await removeItemFromCart(productId);
      if (res) {
        // Handle successful removal
      } else {
        // Ha}ndle removal failure
      }
      
    };
 

  return (
    <div className="space-y-3 py-2">
      {!cart || cart.items.length === 0 ? (
        <p className="text-center text-gray-500">Cart is empty</p>
      ) : (
        cart.items.map((item) => (
          <div
            key={item.productId}
            className="flex items-start justify-between gap-4"
          >
            <div className="flex items-center space-x-4">
              <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                <Link href={`/product/${item.slug}`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="absolute object-cover"
                  />
                  <span className="px-2">{item.name}</span>
                </Link>
              </div>
              <div className="flex flex-col self-start">
                <span className="line-clamp-1 text-sm font-medium mb-1">
                  {item.name}
                </span>
                <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
                  {item.slug} {/* Replace with actual label */}
                </span>
                <div className="mt-4 text-xs text-muted-foreground">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="flex items-center gap-0.5"
                  >
                    <X className="w-3 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-1 font-medium">
              <span className="ml-auto line-clamp-1 text-sm">
                {formatCurrency(item.price)}{" "}
                {/* Ensure price is formatted correctly */}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
  
};

export default CartItem;
