import { sellerCarts,   sellerReviews, sellerOrderItems, sellerOrders, sellerProducts } from "@/db/schema";
import {
  sellerCartItemSchema,
  paymentResultSchema,
  shippingAddressSchema,
} from "@/lib/validator";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

// PRODUCTS
export type sellerProduct = InferSelectModel<typeof sellerProducts>;
export type Review = InferSelectModel<typeof sellerReviews> & {
  user?: { name: string };
};

// CART
export type sellerCart = InferSelectModel<typeof sellerCarts>;
export type sellerCartItem = z.infer<typeof sellerCartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;


// ORDERS

export type sellerOrder = InferSelectModel<typeof sellerOrders> & {
  sellerOrderItems: sellerOrderItem[];
  user: { name: string | null; email: string };
};
export type sellerOrderItem = InferSelectModel<typeof sellerOrderItems>;
