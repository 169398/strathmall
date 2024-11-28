import { CartItem, PaymentResult, ShippingAddress } from "@/types";

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
  varchar,
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
    resetToken: text("resetToken"), 
    resetTokenExpires: timestamp("resetTokenExpires"),
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
  university: text("university").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  shopCategory: text("shopCategory").array().notNull(),
  offersServices: boolean("offersServices").default(false).notNull(),
  services: json("services").$type<{
    name: string;
    description: string;
    price: number | null;
    hasCustomPrice: boolean;
    images: string[];
  }[]>().default([]),
});

export const feedbacks = pgTable("feedbacks", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  feedbackText: text("feedbackText").notNull(),
  emoji: varchar("emoji", { length: 50 }),
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
export const products = pgTable(
  "product",
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
    discount: numeric("discount", { precision: 5, scale: 2 }).default("0"), 

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

//Last Viewed Products
export const lastViewedProducts = pgTable("last_viewed_products", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});
//Favourite Products

export const favorites = pgTable("favorites", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
}));

// SELLER REVIEWS
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sellerId: uuid("sellerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  isVerifiedPurchase: boolean("isVerifiedPurchase").notNull().default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  sellerProduct: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  seller: one(users, {
    fields: [reviews.sellerId],
    references: [users.id],
  }),
}));

// SELLER CARTS
export const carts = pgTable("cart", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  userId: uuid("userId").references(() => users.id, {
    onDelete: "cascade",
  }),
  sessionCartId: text("sessionCartId").notNull(),
  items: json("items").$type<CartItem[]>().notNull().default([]),
  itemsPrice: numeric("itemsPrice", { precision: 12, scale: 2 }).notNull(),
  shippingPrice: numeric("shippingPrice", {
    precision: 12,
    scale: 2,
  }).notNull(),
  totalPrice: numeric("totalPrice", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// SELLER ORDERS
export const orders = pgTable("order", {
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

export const cakeOrders = pgTable("cake_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerId: uuid("sellerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  location: text("location").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  cakeName: text("cakeName").notNull(),
  cakeSize: text("cakeSize").notNull(),
  cakeType: text("cakeType").notNull(),
  quantity: integer("quantity").notNull().default(1),
  customizations: text("customizations"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  cakeImage: text("cakeImage").notNull(),
  deliveryTime: text("deliveryTime").notNull(),
  deliveryDate: text("deliveryDate").notNull(),
});
export const ordersRelations = relations(
  orders,
  ({ one, many }) => ({
    orderItems: many(orderItems),
    user: one(users, { fields: [orders.userId], references: [users.id] }),
  })
);



// SELLER ORDER ITEMS
export const orderItems = pgTable("orderItems", {
  orderId: uuid("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sellerId: uuid("sellerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  image: text("image").notNull(),
  qty: integer("qty").notNull(),
  slug: text("slug").notNull(),

  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
},
(orderItem)=>({
  compoundKey: primaryKey({
    columns: [orderItem.orderId, orderItem.productId],
  }),
})
);



export const orderItemsRelations = relations(
  orderItems,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderItems.orderId],
      references: [orders.id],
    }),
    product: one(products, {
      fields: [orderItems.productId],
      references: [products.id],
    }),
    seller: one(users, {
      fields: [orderItems.sellerId],
      references: [users.id],
    }),
  })
);

// RELATIONS
export const sellerProductsRelations = relations(
  products,
  ({ many, one }) => ({
    sellerReviews: many(reviews),
    sellerOrderItems: many(orderItems),
    seller: one(users, {
      fields: [products.sellerId],
      references: [users.id],
    }),
  })
);

export const sellersRelations = relations(sellers, ({ one, many }) => ({
  user: one(users, { fields: [sellers.userId], references: [users.id] }),
  products: many(products),
}));

// REFERRALS
export const referrals = pgTable("referrals", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  referrerId: uuid("referrerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  referredId: uuid("referredId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  referralCode: text("referralCode").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// REFERRAL REWARDS
export const referralRewards = pgTable("referral_rewards", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mpesaNumber: text("mpesaNumber"),
  totalEarnings: numeric("totalEarnings", { precision: 10, scale: 2 }).default("0"),
  pendingPayment: numeric("pendingPayment", { precision: 10, scale: 2 }).default("0"),
  totalReferrals: integer("totalReferrals").default(0),
  lastPaidAt: timestamp("lastPaidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  referralCode: text("referral_code").notNull(),
});

// Add relations
export const referralRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
  }),
}));

export const referralRewardsRelations = relations(referralRewards, ({ one }) => ({
  user: one(users, {
    fields: [referralRewards.userId],
    references: [users.id],
  }),
}));
