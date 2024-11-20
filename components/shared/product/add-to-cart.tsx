'use client'

import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/sellercart.actions'
import { towns } from '@/lib/address'
import { cart, cartItem } from '@/types/sellerindex'
import { Loader, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function AddToCart({
  cart,
  item,
  variant = "default"
}: {
  cart?: cart
  item: Omit<cartItem, 'cartId'>
  variant?: "default" | "icon"
}) {
  const router = useRouter()
  const { toast } = useToast()
  const townName = towns[0].name
  const [isPending, startTransition] = useTransition()
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId)
  return existItem ? (
    <div>
      <Button
        type="button"
        aria-label='Remove from cart'
        variant="outline"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await removeItemFromCart(item.productId, townName)
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            })
            return
          })
        }}
      >
        {isPending ? (
          <Loader className="w-4 h-4  animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        aria-label='Add to cart'
        variant="outline"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await addItemToCart(item, townName)
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            })
            return
          })
        }}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className={variant === "icon" ? "w-8 h-8" : "w-full"}
      size={variant === "icon" ? "icon" : "default"}
      type="button"
      aria-label='Add to cart'
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await addItemToCart(item, townName)
          if (!res.success) {
            toast({
              variant: 'destructive',
              description: res.message,
            })
            return
          }
          toast({
            description: `${item.name} added to the cart`,
            action: (
              <ToastAction
                className="bg-primary"
                onClick={() => router.push('/cart')}
                altText="Go to cart"
              >
                Go to cart
              </ToastAction>
            ),
          })
        })
      }}
    >
      {isPending ? (
        <Loader className="animate-spin h-4 w-4" />
      ) : variant === "icon" ? (
        <>
          <ShoppingCart className="h-4 w-4" />
          <Plus className="h-3 w-3 absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full" />
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Add to cart
        </>
      )}
    </Button>
  )
}
