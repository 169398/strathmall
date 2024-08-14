import { carts, feeorders, orderItems, orders,feeorderItems, products, reviews } from '@/db/schema'
import {
  cartItemSchema,
  feeResultSchema,
  paymentResultSchema,
  shippingAddressSchema,
} from '@/lib/validator'
import { InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'

// Products
export type Product = InferSelectModel<typeof products>
export type Review = InferSelectModel<typeof reviews> & {
  user?: { name: string }
}

// CART
export type Cart = InferSelectModel<typeof carts>
export type CartItem = z.infer<typeof cartItemSchema>

export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type PaymentResult = z.infer<typeof paymentResultSchema>
export  type feeResult = z.infer<typeof feeResultSchema >

// Orders

export type Order = InferSelectModel<typeof orders> & {
  sellerOrderItems: OrderItem[]
  user: { name: string | null; email: string }
}
export type OrderItem = InferSelectModel<typeof orderItems>

export type feeOrder = InferSelectModel<typeof feeorders> & {
  feeorderItems: feeorderItem[]
}
export type feeorderItem = InferSelectModel<typeof feeorderItems>
