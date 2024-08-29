"use server";

import { desc } from "drizzle-orm";
import db from "@/db/drizzle";
import { products } from "@/db/schema";
import { and, count, eq, ilike, sql } from "drizzle-orm/sql";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { z } from "zod";
import {
  insertProductSchema,
  updateProductSchema,
} from "../validator";
import { auth } from "@/auth";

// CREATE
export async function createProduct(

  data: z.infer<typeof insertProductSchema>
) {
  try {
const session = await auth();

  const sellerId = session?.user.id ||'';



    const product = insertProductSchema.parse(data);
    await db.insert(products).values([{ ...product, sellerId }]);

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
export async function updateProduct(
  data: z.infer<typeof updateProductSchema>
) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await db.query.products.findFirst({
      where: and(
        eq(products.id, product.id),
        eq(products.id, product.id)
      ),
    });
    if (!productExists) throw new Error("Product not found");
    await db
      .update(products)
      .set(product)
      .where(eq(products.id, product.id));
    revalidatePath("/seller/products");
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function checkSlugExists(slug: string): Promise<boolean> {
  const existingProduct = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });
  return !!existingProduct;
}
//all products
export async function getAllProducts() {
  try {
    const data = await db
      .select({

        id: products.id,
        stock: products.stock,
        price: products.price,
      
        slug: products.slug,
        images: products.images,
        name: products.name,
        originalPrice: products.price,
        discount: products.discount,
        discountedPrice:
          sql<number>`(${products.price} - (${products.price} * ${products.discount} / 100))`.as(
            "discountedPrice"
          ),
      })
      .from(products);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllSearchProducts({
  query,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  category: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  const queryFilter =
    query && query !== "all"
      ? ilike(products.name, `%${query}%`)
      : undefined;
  const categoryFilter =
    category && category !== "all"
      ? eq(products.category, category)
      : undefined;
  const ratingFilter =
    rating && rating !== "all"
      ? sql`${products.rating} >= ${rating}`
      : undefined;
  const priceFilter =
    price && price !== "all"
      ? sql`${products.price} >= ${price.split("-")[0]} AND ${
          products.price
        } <= ${price.split("-")[1]}`
      : undefined;
  const order =
    sort === "lowest"
      ? products.price
      : sort === "highest"
      ? desc(products.price)
      : sort === "rating"
      ? desc(products.rating)
      : desc(products.createdAt);

  const condition = and(queryFilter, categoryFilter, ratingFilter, priceFilter);

  const data = await db
    .select()
    .from(products)
    .where(condition)
    .orderBy(order)

  

  return {
    data,
  };
}

// GET
export async function getProductById(productId: string) {
  return await db.query.products.findFirst({
    where: eq(products.id, productId),
  });
}

export async function getLatestProducts() {
  const data = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    limit: 10,
  });
  return data;
}
//Discounted products
export async function getDiscountedProducts() {
  try {
    const data = await db
      .select({
        id: products.id,
        slug: products.slug,
        images: products.images,
        name: products.name,
        originalPrice: products.price,
        discount: products.discount,
        discountedPrice:
          sql<number>`(${products.price} - (${products.price} * ${products.discount} / 100))`.as(
            "discountedPrice"
          ),
      })
      .from(products)
      .where(sql`${products.discount} > 0`)
      .orderBy(desc(products.createdAt));


    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching discounted products:", error);
    return { success: false, message: "Failed to fetch discounted products" };
  }
}

export async function getProductBySlug(slug: string) {
  return await db.query.products.findFirst({
    where: and(
      eq(products.slug, slug),
    ),
  });
}

export async function getAllproducts({
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
      ? ilike(products.name, `%${query}%`)
      : undefined;
  const categoryFilter =
    category && category !== "all"
      ? eq(products.category, category)
      : undefined;
  const ratingFilter =
    rating && rating !== "all"
      ? sql`${products.rating} >= ${rating}`
      : undefined;
  const priceFilter =
    price && price !== "all"
      ? sql`${products.price} >= ${price.split("-")[0]} AND ${
          products.price
        } <= ${price.split("-")[1]}`
      : undefined;
  const order =
    sort === "lowest"
      ? products.price
      : sort === "highest"
      ? desc(products.price)
      : sort === "rating"
      ? desc(products.rating)
      : desc(products.createdAt);

  const condition = and(
    eq(products.sellerId, sellerId),
    queryFilter,
    categoryFilter,
    ratingFilter,
    priceFilter
  );
  const data = await db
    .select()
    .from(products)
    .where(condition)
    .orderBy(order)
    .offset((page - 1) * limit)
    .limit(limit);

  const dataCount = await db
    .select({ count: count() })
    .from(products)
    .where(condition);
  

  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

export async function getAllCategories() {
  const data = await db
    .selectDistinctOn([products.category], {
      name: products.category,
    })
    .from(products)
    .orderBy(products.category);
  return data;
}

export async function getFeaturedProducts(userId: string) {
  const data = await db.query.products.findMany({
    where: and(
      eq(products.isFeatured, true),
      eq(products.sellerId, userId)
    ),
    orderBy: [desc(products.createdAt)],
    limit: 4,
  });
  return data;
}
export async function getRelatedProducts(category: string, excludeProductId: string) {
  try {
    const data = await db.query.products.findMany({
      where: and(
        eq(products.category, category),
        sql`${products.id} != ${excludeProductId}` 
      ),
      orderBy: [desc(products.createdAt)],
      limit: 10, 
    });
    return data;
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
// DELETE
export async function deleteProduct(id: string, ) {
  try {
    const productExists = await db.query.products.findFirst({
      where: and(
        eq(products.id, id),
      ),
    });
    if (!productExists) throw new Error("Product not found");
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/seller/products");
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

