"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  addItemToCart,
  removeItemFromCart,
} from "@/lib/actions/sellercart.actions";
import { towns } from "@/lib/address";
import { formatCurrency } from "@/lib/utils";
import { CartItem } from "@/types";
import { cart } from "@/types/sellerindex";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useAccessibility } from "@/lib/context/AccessibilityContext";

export default function CartForm({ cart }: { cart?: cart }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const townName = towns[0].name;
  const { isAccessibilityMode, speak } = useAccessibility();

  useEffect(() => {
    if (isAccessibilityMode) {
      if (!cart || cart.items.length === 0) {
        speak("Your cart is empty. Start shopping to add items.");
      } else {
        speak(`Your cart has ${cart.items.length} items. Total price is ${cart.totalPrice} shillings.`);
      }
    }
  }, [isAccessibilityMode, cart]);

  const handleRemoveItem = async (productId: string) => {
    startTransition(async () => {
      const res = await removeItemFromCart(productId, townName);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      }
    });
  };

  const handleAddItem = async (item: CartItem) => {
    startTransition(async () => {
      const res = await addItemToCart({ ...item, productId: item.productId },townName);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      }
    });
  };

  const handleCheckout = () => {
    startTransition(() => router.push("/shipping-address"));
  };

  return (
    <Sheet>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center space-y-2 mb-5">
          <div
            aria-hidden="true"
            className="relative mb-4 h-60 w-60 text-muted-foreground"
          >
            <Image
              src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728757715/emptycart_tjokx8.png"
              fill
              alt="empty shopping cart hippo"
            />
          </div>
          <div className="text-xl font-semibold">Your cart is empty</div>
          <SheetTrigger asChild>
            <Link
              href="/search"
              className={buttonVariants({
                variant: "link",
                size: "sm",
                className: "text-sm text-muted-foreground",
              })}
            >
              Add items to your cart to checkout
            </Link>
          </SheetTrigger>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4  animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => handleAddItem(item)}
                        aria-label="Add item"
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4  animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <Card>
              <CardContent className="p-4 gap-4">
                <div className="pb-3 text-xl">
                  Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):
                  {formatCurrency(cart.itemsPrice)}
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader className="animate-spin w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Sheet>
  );
}
