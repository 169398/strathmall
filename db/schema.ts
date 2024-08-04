import {
  sellerCartItem,
  PaymentResult,
  ShippingAddress,
} from "@/types/sellerindex";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { primaryKey } from "drizzle-orm/pg-core/primary-keys";
import { AdapterAccountType } from "next-auth/adapters";

// USERS
export const users = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull().default("NO_NAME"),
    email: text("email").notNull(),
    role: text("role").notNull().default("user"),
    password: text("password"),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    address: json("address").$type<ShippingAddress>(),
    paymentMethod: text("paymentMethod"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => {
    return {
      userEmailIdx: uniqueIndex("user_email_idx").on(table.email),
    };
  }
);

// SELLER SHOPS
export const sellers = pgTable("sellerShop", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  shopName: text("shopName").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ACCOUNTS
export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

// SESSIONS
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// VERIFICATION TOKENS
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// SELLER PRODUCTS
export const sellerProducts = pgTable(
  "sellerProduct",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    sellerId: uuid("sellerId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    category: text("category").notNull(),
    images: text("images").array().notNull(),
    brand: text("brand").notNull(),
    description: text("description").notNull(),
    stock: integer("stock").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull().default("0"),
    rating: numeric("rating", { precision: 3, scale: 2 })
      .notNull()
      .default("0"),
    numReviews: integer("numReviews").notNull().default(0),
    isFeatured: boolean("isFeatured").default(false).notNull(),
    banner: text("banner"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => {
    return {
      productSlugIdx: uniqueIndex("product_slug_unique_idx").on(table.slug),
    };
  }
);

// SELLER REVIEWS
export const sellerReviews = pgTable("sellerReviews", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerProductId: uuid("sellerProductId")
    .notNull()
    .references(() => sellerProducts.id, { onDelete: "cascade" }),
  sellerId: uuid("sellerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isVerifiedPurchase: boolean("isVerifiedPurchase").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const sellerReviewsRelations = relations(sellerReviews, ({ one }) => ({
  user: one(users, { fields: [sellerReviews.userId], references: [users.id] }),
  sellerProduct: one(sellerProducts, {
    fields: [sellerReviews.sellerProductId],
    references: [sellerProducts.id],
  }),
  seller: one(users, {
    fields: [sellerReviews.sellerId],
    references: [users.id],
  }),
}));

// SELLER CARTS
export const sellerCarts = pgTable("sellerCart", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  userId: uuid("userId").references(() => users.id, {
    onDelete: "cascade",
  }),
  sessionCartId: text("sessionCartId").notNull(),
  items: json("items").$type<sellerCartItem[]>().notNull().default([]),
  itemsPrice: numeric("itemsPrice", { precision: 12, scale: 2 }).notNull(),
  shippingPrice: numeric("shippingPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),
  totalPrice: numeric("totalPrice", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// SELLER ORDERS
export const sellerOrders = pgTable("sellerOrders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerId: uuid("sellerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  shippingAddress: json("shippingAddress").$type<ShippingAddress>().notNull(),
  paymentMethod: text("paymentMethod").notNull(),
  paymentResult: json("paymentResult").$type<PaymentResult>(),
  itemsPrice: numeric("itemsPrice", { precision: 12, scale: 2 }).notNull(),
  shippingPrice: numeric("shippingPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),
  totalPrice: numeric("totalPrice", { precision: 12, scale: 2 }).notNull(),
  isPaid: boolean("isPaid").notNull().default(false),
  paidAt: timestamp("paidAt"),
  isDelivered: boolean("isDelivered").notNull().default(false),
  deliveredAt: timestamp("deliveredAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const sellerOrdersRelations = relations(
  sellerOrders,
  ({ one, many }) => ({
    sellerOrderItems: many(sellerOrderItems),
    user: one(users, { fields: [sellerOrders.userId], references: [users.id] }),
  })
);

// SELLER ORDER ITEMS
export const sellerOrderItems = pgTable("sellerOrderItems", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  sellerOrderId: uuid("sellerOrderId")
    .notNull()
    .references(() => sellerOrders.id, { onDelete: "cascade" }),
  sellerProductId: uuid("sellerProductId")
    .notNull()
    .references(() => sellerProducts.id, { onDelete: "cascade" }),
  sellerId: uuid("sellerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  image: text("image").notNull(),
  qty: integer("qty").notNull(),
  slug: text("slug").notNull(),

  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
});

export const sellerOrderItemsRelations = relations(
  sellerOrderItems,
  ({ one }) => ({
    sellerOrder: one(sellerOrders, {
      fields: [sellerOrderItems.sellerOrderId],
      references: [sellerOrders.id],
    }),
    sellerProduct: one(sellerProducts, {
      fields: [sellerOrderItems.sellerProductId],
      references: [sellerProducts.id],
    }),
    seller: one(users, {
      fields: [sellerOrderItems.sellerId],
      references: [users.id],
    }),
  })
);

// RELATIONS
export const sellerProductsRelations = relations(
  sellerProducts,
  ({ many, one }) => ({
    sellerReviews: many(sellerReviews),
    sellerOrderItems: many(sellerOrderItems),
    seller: one(users, {
      fields: [sellerProducts.sellerId],
      references: [users.id],
    }),
  })
);

export const sellersRelations = relations(sellers, ({ one, many }) => ({
  user: one(users, { fields: [sellers.userId], references: [users.id] }),
  products: many(sellerProducts),
}));
