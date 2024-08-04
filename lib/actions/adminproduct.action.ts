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
  insertProductSchema,
  updateSellerProductSchema,
} from "../validator";

// CREATE
export async function createProduct(

  data: z.infer<typeof insertProductSchema>
) {




    const sellerProduct = insertProductSchema.parse(data);
    await db.insert(sellerProducts).values(sellerProduct );

    revalidatePath("/seller/products");
    return {
      success: true,
      message: "Product created successfully",
    };
  
}


// UPDATE
export async function updateProduct(
  data: z.infer<typeof updateSellerProductSchema>
) {
  try {
    const product = updateSellerProductSchema.parse(data);
    const productExists = await db.query.sellerProducts.findFirst({
      where: eq(sellerProducts.id, product.id),
    });
    if (!productExists) throw new Error("Product not found");
    await db
      .update(sellerProducts)
      .set(product)
      .where(eq(sellerProducts.id, product.id));
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// GET
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

// GET by ID
export async function getProductById(productId: string) {
  return await db.query.sellerProducts.findFirst({
    where: eq(sellerProducts.id, productId),
  });
}

// GET latest products
export async function getLatestProducts() {
  const data = await db.query.sellerProducts.findMany({
    orderBy: [desc(sellerProducts.createdAt)],
    limit: 4,
  });
  return data;
}

// GET by slug
export async function getProductBySlug(slug: string) {
  return await db.query.sellerProducts.findFirst({
    where: eq(sellerProducts.slug, slug),
  });
}

// GET all products
export async function getAllProducts({
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

// GET all categories
export async function getAllCategories() {
  const data = await db
    .selectDistinctOn([sellerProducts.category], {
      name: sellerProducts.category,
    })
    .from(sellerProducts)
    .orderBy(sellerProducts.category);
  return data;
}

// GET featured products
export async function getFeaturedProducts() {
  const data = await db.query.sellerProducts.findMany({
    where: eq(sellerProducts.isFeatured, true),
    orderBy: [desc(sellerProducts.createdAt)],
    limit: 4,
  });
  return data;
}

// DELETE
export async function deleteProduct(id: string) {
  try {
    const productExists = await db.query.sellerProducts.findFirst({
      where: eq(sellerProducts.id, id),
    });
    if (!productExists) throw new Error("Product not found");
    await db.delete(sellerProducts).where(eq(sellerProducts.id, id));
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
