import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMyCart } from "@/lib/actions/sellercart.actions";

export default async function CartButton() {
  const cart = await getMyCart();

  return (
    <Button
      asChild
      variant="ghost"
      className="relative flex items-center justify-center h-10 px-4 py-2"
      aria-label="cart"
    >
      <Link href="/cart" className="flex items-center gap-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-18 w-18"
        />
        {cart && cart.items.length > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
            {cart.items.reduce((a: number, c: { qty: number }) => a + c.qty, 0)}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
