"use server";

import { desc } from "drizzle-orm";
import db from "@/db/drizzle";
import { sellerProducts } from "@/db/schema";
import { and, count, eq, ilike, sql } from "drizzle-orm/sql";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { z } from "zod";
import {
  insertSellerProductSchema,
  updateSellerProductSchema,
} from "../validator";
import { auth } from "@/auth";

// CREATE
export async function createSellerProduct(

  data: z.infer<typeof insertSellerProductSchema>
) {
  try {
const session = await auth();

  const sellerId = session?.user.id ||'';



    const sellerProduct = insertSellerProductSchema.parse(data);
    await db.insert(sellerProducts).values([{ ...sellerProduct, sellerId }]);

    revalidatePath("/seller/products");
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// UPDATE seller product
export async function updateSellerProduct(
  data: z.infer<typeof updateSellerProductSchema>
) {
  try {
    const sellerProduct = updateSellerProductSchema.parse(data);
    const productExists = await db.query.sellerProducts.findFirst({
      where: and(
        eq(sellerProducts.id, sellerProduct.id),
        eq(sellerProducts.id, sellerProduct.id)
      ),
    });
    if (!productExists) throw new Error("Product not found");
    await db
      .update(sellerProducts)
      .set(sellerProduct)
      .where(eq(sellerProducts.id, sellerProduct.id));
    revalidatePath("/seller/products");
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllSearchProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  category: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const queryFilter =
    query && query !== "all"
      ? ilike(sellerProducts.name, `%${query}%`)
      : undefined;
  const categoryFilter =
    category && category !== "all"
      ? eq(sellerProducts.category, category)
      : undefined;
  const ratingFilter =
    rating && rating !== "all"
      ? sql`${sellerProducts.rating} >= ${rating}`
      : undefined;
  const priceFilter =
    price && price !== "all"
      ? sql`${sellerProducts.price} >= ${price.split("-")[0]} AND ${
          sellerProducts.price
        } <= ${price.split("-")[1]}`
      : undefined;
  const order =
    sort === "lowest"
      ? sellerProducts.price
      : sort === "highest"
      ? desc(sellerProducts.price)
      : sort === "rating"
      ? desc(sellerProducts.rating)
      : desc(sellerProducts.createdAt);

  const condition = and(queryFilter, categoryFilter, ratingFilter, priceFilter);

  const data = await db
    .select()
    .from(sellerProducts)
    .where(condition)
    .orderBy(order)
    .offset((page - 1) * limit)
    .limit(limit);

  const dataCount = await db
    .select({ count: count() })
    .from(sellerProducts)
    .where(condition);

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

// GET
export async function getSellerProductById(sellerProductId: string) {
  return await db.query.sellerProducts.findFirst({
    where: eq(sellerProducts.id, sellerProductId),
  });
}

export async function getSellerLatestProducts() {
  const data = await db.query.sellerProducts.findMany({
    orderBy: [desc(sellerProducts.createdAt)],
    limit: 4,
  });
  return data;
}

export async function getSellerProductBySlug(slug: string) {
  return await db.query.sellerProducts.findFirst({
    where: and(
      eq(sellerProducts.slug, slug),
    ),
  });
}

export async function getAllSellerProducts({
  sellerId,
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  sellerId: string;
  query: string;
  category: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const queryFilter =
    query && query !== "all"
      ? ilike(sellerProducts.name, `%${query}%`)
      : undefined;
  const categoryFilter =
    category && category !== "all"
      ? eq(sellerProducts.category, category)
      : undefined;
  const ratingFilter =
    rating && rating !== "all"
      ? sql`${sellerProducts.rating} >= ${rating}`
      : undefined;
  const priceFilter =
    price && price !== "all"
      ? sql`${sellerProducts.price} >= ${price.split("-")[0]} AND ${
          sellerProducts.price
        } <= ${price.split("-")[1]}`
      : undefined;
  const order =
    sort === "lowest"
      ? sellerProducts.price
      : sort === "highest"
      ? desc(sellerProducts.price)
      : sort === "rating"
      ? desc(sellerProducts.rating)
      : desc(sellerProducts.createdAt);

  const condition = and(
    eq(sellerProducts.sellerId, sellerId),
    queryFilter,
    categoryFilter,
    ratingFilter,
    priceFilter
  );
  const data = await db
    .select()
    .from(sellerProducts)
    .where(condition)
    .orderBy(order)
    .offset((page - 1) * limit)
    .limit(limit);

  const dataCount = await db
    .select({ count: count() })
    .from(sellerProducts)
    .where(condition);

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

export async function getAllSellerCategories() {
  const data = await db
    .selectDistinctOn([sellerProducts.category], {
      name: sellerProducts.category,
    })
    .from(sellerProducts)
    .orderBy(sellerProducts.category);
  return data;
}

export async function getSellerFeaturedProducts(userId: string) {
  const data = await db.query.sellerProducts.findMany({
    where: and(
      eq(sellerProducts.isFeatured, true),
      eq(sellerProducts.sellerId, userId)
    ),
    orderBy: [desc(sellerProducts.createdAt)],
    limit: 4,
  });
  return data;
}

// DELETE
export async function deleteSellerProduct(id: string, ) {
  try {
    const productExists = await db.query.sellerProducts.findFirst({
      where: and(
        eq(sellerProducts.id, id),
      ),
    });
    if (!productExists) throw new Error("Product not found");
    await db.delete(sellerProducts).where(eq(sellerProducts.id, id));
    revalidatePath("/seller/products");
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
