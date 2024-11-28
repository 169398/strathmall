"use server";

import { desc } from "drizzle-orm";
import db from "@/db/drizzle";
import {
  favorites,
  lastViewedProducts,
  products,
  sellers,
  users,
} from "@/db/schema";
import { and, asc, count, eq, ilike, sql } from "drizzle-orm/sql";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validator";
import { auth } from "@/auth";
import { CacheService } from "@/lib/cache-utils";

// CREATE
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const session = await auth();

    const sellerId = session?.user.id || "";

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
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await db.query.products.findFirst({
      where: and(eq(products.id, product.id), eq(products.id, product.id)),
    });
    if (!productExists) throw new Error("Product not found");
    await db.update(products).set(product).where(eq(products.id, product.id));
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

// Add a product to favorites
export async function addProductToFavorites(productId: string) {
  try {
    const session = await auth();
    const userId = session?.user.id || "";

    if (!session?.user) {
      return {
        success: false,
        message: "Login  to favorite a product",
      };
    }

    // Check if the product is already favorited
    const existingFavorite = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.productId, productId)
      ),
    });

    if (existingFavorite) {
      return {
        success: true,
        message: "Product is already in favorites",
      };
    }

    // Add to favorites
    await db.insert(favorites).values({
      userId,
      productId,
    });

    revalidatePath("/favorites");
    return {
      success: true,
      message: "Product added to favorites successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Remove a product from favorites
export async function removeProductFromFavorites(productId: string) {
  try {
    const session = await auth();
    const userId = session?.user.id || "";

    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.productId, productId))
      );

    revalidatePath("/favorites");
    return {
      success: true,
      message: "Product removed from favorites successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get a user's favorite products
export async function getUserFavorites() {
  try {
    const session = await auth();
    const userId = session?.user.id || "";

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
      .innerJoin(favorites, eq(products.id, favorites.productId))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));

    return {
      success: true,
      data,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
//all products
export async function getAllProducts() {
  const categoryLimit = 4; // Limit to 4 products per category
  const totalColumns = 8; // Total number of columns to display on the homepage
  const categoryList = [
    "Electronics",
    "Shoes",
    "Watches",
    "Phones",
    "Computer-accessories",
    "BluetoothSpeakers",
    "Phonecovers",
    "Gaming",
    "Earphones",
    "Earpods",
    "Phone-accessories",
    "Men's Clothing",
    "Cleaning-Supplies",
    "Women's Clothing",
    "Books",
    "Luggages-Bags",
    "Home-Kitchen",
    "Toys-Entertainment",
    "Beauty-Personal Care",
    "Bakery",
    "Furniture",
    "Sports and Entertainment",
    "Hair extensions-Wigs",
  ];

  try {
    const productsByCategory = [];
    let categoryIndex = 0;

    // Loop until we have enough products for the columns
    while (productsByCategory.length < totalColumns * categoryLimit) {
      const category = categoryList[categoryIndex % categoryList.length];

      // Fetch products for the current category
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
        .from(products)
        .where(eq(products.category, category))
        .limit(categoryLimit);

      // Add the products to the list
      productsByCategory.push(...data);
      categoryIndex++;
    }

    return {
      success: true,
      data: productsByCategory,
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
    query && query !== "all" ? ilike(products.name, `%${query}%`) : undefined;
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

  const data = await db.select().from(products).where(condition).orderBy(order);

  return {
    data,
  };
}

export async function getProductsByCategory(category: string, limit = 10) {
  try {
    const data = await db
      .select({
        id: products.id,
        slug: products.slug,
        images: products.images,
        name: products.name,
        stock: products.stock,
        originalPrice: products.price,
        discount: products.discount,
        discountedPrice:
          sql<number>`(${products.price} - (${products.price} * ${products.discount} / 100))`.as(
            "discountedPrice"
          ),
      })
      .from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt))
      .limit(limit);

    return {
      success: true,
      data,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// GET
export async function getProductById(productId: string) {
  return await db.query.products.findFirst({
    where: eq(products.id, productId),
  });
}

export async function getLatestProducts() {
  const data = await db.query.products.findMany({
    where: sql`${products.category} != 'Food-Bakery'`,
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
    where: and(eq(products.slug, slug)),
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
    query && query !== "all" ? ilike(products.name, `%${query}%`) : undefined;
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
    where: and(eq(products.isFeatured, true), eq(products.sellerId, userId)),
    orderBy: [desc(products.createdAt)],
    limit: 4,
  });
  return data;
}
export async function getRelatedProducts(
  category: string,
  excludeProductId: string
) {
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
export async function deleteProduct(id: string) {
  try {
    const productExists = await db.query.products.findFirst({
      where: and(eq(products.id, id)),
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

export async function getHomePageData() {
  return CacheService.getOrSet(
    "homepage:data",
    async () => {
      const latestProducts = await db
        .select({
          id: products.id,
          slug: products.slug,
          images: products.images,
          name: products.name,
          stock: products.stock,
          price: products.price,
          discount: products.discount,
          discountedPrice:
            sql<number>`(${products.price} - (${products.price} * ${products.discount} / 100))`.as(
              "discountedPrice"
            ),
        })
        .from(products)
        .where(sql`${products.category} != 'Food-Bakery'`)
        .orderBy(desc(products.createdAt))
        .limit(10);

      const discountedProducts = await db
        .select({
          id: products.id,
          slug: products.slug,
          images: products.images,
          name: products.name,
          price: products.price,
          discount: products.discount,
          discountedPrice:
            sql<number>`(${products.price} - (${products.price} * ${products.discount} / 100))`.as(
              "discountedPrice"
            ),
        })
        .from(products)
        .where(sql`${products.discount} > 0`)
        .orderBy(desc(products.createdAt))
        .limit(10);

      if (!latestProducts || !discountedProducts) {
        throw new Error("Missing homepage product data from the database");
      }

      return {
        latestProducts,
        discountedProducts,
      };
    },
    {
      expirationTime: 60 * 30, // 30 minutes
    }
  );
}

export async function logProductView(userId: string, productId: string) {
  try {
    // Check if the product is already in the last viewed
    const existingView = await db.query.lastViewedProducts.findFirst({
      where: and(
        eq(lastViewedProducts.userId, userId),
        eq(lastViewedProducts.productId, productId)
      ),
    });

    // Update the timestamp if already viewed, otherwise insert new
    if (existingView) {
      await db
        .update(lastViewedProducts)
        .set({ viewedAt: new Date() })
        .where(eq(lastViewedProducts.id, existingView.id));
    } else {
      await db.insert(lastViewedProducts).values({
        userId,
        productId,
      });
    }

    //  limit the number of last viewed items per user (e.g., last 10 products)
    const viewsCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(lastViewedProducts)
      .where(eq(lastViewedProducts.userId, userId));
    const viewsCount = viewsCountResult[0].count;

    if (viewsCount > 10) {
      // Delete the oldest viewed product if there are more than 10
      const oldestView = await db
        .select({ id: lastViewedProducts.id })
        .from(lastViewedProducts)
        .where(eq(lastViewedProducts.userId, userId))
        .orderBy(asc(lastViewedProducts.viewedAt))
        .limit(1);

      if (oldestView.length > 0) {
        await db
          .delete(lastViewedProducts)
          .where(eq(lastViewedProducts.id, oldestView[0].id));
      }
    }
  } catch (error) {
    console.error("Error logging product view:", error);
  }
}

export async function getLastViewedProducts(userId: string, limit = 10) {
  try {
    const data = await db
      .select({
        id: products.id,
        slug: products.slug,
        images: products.images,
        name: products.name,
        stock: products.stock,
        price: products.price,
        discount: products.discount,
        discountedPrice:
          sql<number>`(${products.price} - (${products.price} * ${products.discount} / 100))`.as(
            "discountedPrice"
          ),
      })
      .from(products)
      .innerJoin(
        lastViewedProducts,
        eq(products.id, lastViewedProducts.productId)
      )
      .where(eq(lastViewedProducts.userId, userId))
      .orderBy(desc(lastViewedProducts.viewedAt)) // Most recent first
      .limit(limit);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching last viewed products:", error);
    return { success: false, message: "Failed to fetch last viewed products" };
  }
}

export async function getAllServices() {
  try {
    const sellersWithServices = await db
      .select({
        id: sellers.id,
        shopName: sellers.shopName,
        sellerName: users.name,
        phoneNumber: sellers.phoneNumber,
        services: sellers.services,
      })
      .from(sellers)
      .innerJoin(users, eq(sellers.userId, users.id))
      .where(eq(sellers.offersServices, true));

    return {
      success: true,
      data: sellersWithServices,
    };
  } catch (error) {
    console.error("Error fetching services:", error);
    return { success: false, message: formatError(error) };
  }
}
