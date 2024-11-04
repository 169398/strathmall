import db from "@/db/drizzle";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";
import { MetadataRoute } from "next";

export async function GET(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch products with valid IDs
    const allProducts = await db.select().from(products)
      .where(sql`id is not null`); // Only get products with valid IDs

    const productRoutes = allProducts.map((product) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`,
      lastModified: new Date(product.createdAt).toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    return [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/products`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...productRoutes,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic sitemap if there's an error
    return [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
} 