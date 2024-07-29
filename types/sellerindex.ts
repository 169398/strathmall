import { carts,   reviews, sellerOrderItems, sellerOrders, sellerProducts } from "@/db/schema";
import {
  cartItemSchema,
  paymentResultSchema,
  shippingAddressSchema,
} from "@/lib/validator";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

// PRODUCTS
export type sellerProduct = InferSelectModel<typeof sellerProducts>;
export type Review = InferSelectModel<typeof reviews> & {
  user?: { name: string };
};

// CART
export type Cart = InferSelectModel<typeof carts>;
export type CartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;

// ORDERS

export type sellerOrder = InferSelectModel<typeof sellerOrders> & {
  orderItems: sellerOrderItem[];
  user: { name: string | null; email: string };
};
export type sellerOrderItem = InferSelectModel<typeof sellerOrderItems>;
