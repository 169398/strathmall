"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { formatCurrency } from "@/lib/utils";
import { Cart } from "@/types";
import { ArrowRight, Loader, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from "react";
import CartItem from "./CartItem";
import { Separator } from "@/components/ui/separator";

export default function CartForm({ cart }: { cart?: Cart }) {
  // const router = useRouter();
  const itemCount = cart?.items.reduce((a, c) => a + c.qty, 0) || 0;
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // const { toast } = useToast();
  // const [isPending, startTransition] = useTransition();

  return (
    <>
      <Sheet>
        <SheetTrigger className="group -m-2 flex items-center p-2">
          <ShoppingCart
            aria-hidden="true"
            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-800"
          />
          <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
            {isMounted ? itemCount : 0}
          </span>
        </SheetTrigger>

        <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
          <SheetHeader className="space-y-2.5 pr-6">
            <SheetTitle>Cart ({itemCount})</SheetTitle>
          </SheetHeader>
          {itemCount > 0 ? (
            <>
              <div className="flex w-full flex-col pr-6">
                <ScrollArea>
                  {cart?.items.map((item) => (
                    <CartItem cart={cart} key={item.productId} />
                  ))}
                </ScrollArea>
              </div>
              <div className="space-y-4 pr-6">
                <Separator />
                <div className="space-y-1.5 text-sm">
                  <div className="flex">
                    <span className="flex-1">Quantity</span>
                    <span>{itemCount}</span>
                  </div>
                  <div className="flex">
                    <span className="flex-1">Price</span>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                  <div className="flex">
                    <span className="flex-1">Total</span>
                    <span>{formatCurrency()}</span>
                  </div>
                </div>
                <SheetFooter>
                  <SheetTrigger asChild>
                    <Link
                      href="/shipping-address"
                      className={buttonVariants({
                        className: "w-full",
                      })}
                    >
                      Continue to Checkout
                    </Link>
                  </SheetTrigger>
                </SheetFooter>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-1">
              <div
                aria-hidden="true"
                className="relative mb-4 h-60 w-60 text-muted-foreground"
              >
                <Image src="/emptycart.png" fill alt="Empty Cart" />
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
                  Add to your cart to checkout
                </Link>
              </SheetTrigger>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
