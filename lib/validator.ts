import * as z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";
import {
  feeorderItems,
  orderItems,
  orders,
  products,
  reviews,
} from "@/db/schema";
import { towns } from "./address";
import { deliveryTimes } from "./delivery-time";

// USER
export const signInFormSchema = z.object({
  email: z.string().email().min(3, "Email must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email().min(3, "Email must be at least 3 characters"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    confirmPassword: z
      .string()
      .min(3, "Confirm password must be at least 3 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email().min(3, "Email must be at least 3 characters"),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "Id is required"),
  role: z.string().min(1, "Role is required"),
});

//seller product

export const insertProductSchema = createSelectSchema(products, {
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  stock: z.coerce.number().min(0, "Stock must be at least 0"),
}).omit({
  id: true,
  sellerId: true,
  rating: true,
  numReviews: true,
  createdAt: true,
});

export const updateProductSchema = createSelectSchema(products, {
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  stock: z.coerce.number().min(0, "Stock must be at least 0"),
}).omit({
  sellerId: true,
  rating: true,
  numReviews: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

// CART
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a non-negative number"),
  image: z.string().min(1, "Image is required"),
  price: z
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
      "Price must have exactly two decimal places (e.g., 49.99)"
    ),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  phoneNumber: z
    .string()
    .regex(
      /^(01|07|\+254)\d{8}$/,
      "Phone number must start with 01, 07, or +254 and be followed by 8 digits"
    ),
  town: z
    .string()
    .refine(
      (value) => towns.map((town) => town.name).includes(value),
      "Invalid town selected"
    ),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export const insertSellerOrderSchema = createInsertSchema(orders, {
  shippingAddress: shippingAddressSchema,
  paymentResult: z
    .object({
      id: z.string(),
      status: z.string(),
      email_address: z.string(),
      pricePaid: z.string(),
    })
    .optional(),
});

export const insertSellerOrderItemSchema = createInsertSchema(orderItems, {
  price: z.number(),
});

export const insertOrderSchema = createInsertSchema(orders, {
  shippingAddress: shippingAddressSchema,
  paymentResult: z
    .object({
      id: z.string(),
      status: z.string(),
      email_address: z.string(),
      pricePaid: z.string(),
    })
    .optional(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems, {
  price: z.number(),
});

export const createSellerSchema = z.object({
  shopName: z.string().min(3, "Shop name must be at least 3 characters"),
  shopCategory: z.array(z.string()).min(1, "Shop category required"),
  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid email address"
    ),
  phoneNumber: z
    .string()
    .regex(
      /^(01|07|\+254)\d{8}$/,
      "Phone number must start with 01, 07, or +254 and be followed by 8 digits"
    ),
  university: z
    .string()
    .min(1, "University required"),
});

export const updateSellerSchema = createSellerSchema.extend({
  id: z.string().min(1, "Id is required"),
});

export const insertFeeOrderSchema = z.object({
  userId: z.string().uuid(),
  sellerId: z.string().uuid(),
  paymentMethod: z.enum(["PayPal", "CreditCard", "DebitCard"]),
  totalAmount: z.string(),
  feeResult: z
    .object({
      id: z.string(),
      status: z.string(),
      email_address: z.string(),
      totalAmount: z.string(),
    })
    .optional(),
});

export const insertfeeorderItemSchema = createInsertSchema(feeorderItems, {
  totalAmount: z.number(),
});
export const insertCakeOrderSchema = z.object({
  userId: z.string().uuid(),
  sellerId: z.string().uuid(),
  location: z.string().min(1, "Location is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  cakeSize: z.string().min(1, "Cake size is required"),
  cakeType: z.enum(["egg",]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  customizations: z.string().optional(),
  cakeName: z.string().min(1, "Cake name is required"),
  cakeImage: z.string().min(1, "Cake image is required"),
  deliveryTime: z.enum(deliveryTimes as [string, ...string[]]),
  deliveryDate: z.string().min(1, "Delivery date is required"),
});

export const feeResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  totalAmount: z.string(),
});
