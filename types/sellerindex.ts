import { carts,   reviews, orderItems, orders, products, sellers, users } from "@/db/schema";
import {
  cartItemSchema,
  paymentResultSchema,
  shippingAddressSchema,
} from "@/lib/validator";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

// PRODUCTS
export type product = InferSelectModel<typeof products>;
export type Review = InferSelectModel<typeof reviews> & {
  user?: { name: string };
};

// CART
export type cart = InferSelectModel<typeof carts>;
export type cartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentResult = z.infer<typeof paymentResultSchema>;


// ORDERS

export type order = InferSelectModel<typeof orders> & {
  orderItems: orderItem[];
  user: { name: string | null; email: string };
};
export type orderItem = InferSelectModel<typeof orderItems>;

// SELLER
export type seller = InferSelectModel< typeof sellers>

// USER
export type user = InferSelectModel< typeof users>
