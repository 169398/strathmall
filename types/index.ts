import { sellerCarts, sellerOrderItems, sellerOrders, sellerProducts, sellerReviews } from '@/db/schema'
import {
  cartItemSchema,
  paymentResultSchema,
  shippingAddressSchema,
} from '@/lib/validator'
import { InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'

// sellerProducts
export type Product = InferSelectModel<typeof sellerProducts>
export type Review = InferSelectModel<typeof sellerReviews> & {
  user?: { name: string }
}

// CART
export type Cart = InferSelectModel<typeof sellerCarts>
export type CartItem = z.infer<typeof cartItemSchema>

export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type PaymentResult = z.infer<typeof paymentResultSchema>

// sellerOrders

export type Order = InferSelectModel<typeof sellerOrders> & {
  sellerOrderItems: OrderItem[]
  user: { name: string | null; email: string }
}
export type OrderItem = InferSelectModel<typeof sellerOrderItems>
