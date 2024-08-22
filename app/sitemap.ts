"use server";

import { getAllCategories, getAllproducts } from "@/lib/actions/sellerproduct.actions";
import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = ['/', '/about', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const productsPromise = getAllproducts({
    sellerId: '',
    query: 'all',
    category: 'all',
    limit: 1000, // Adjust based on your expected total products
    page: 1,
  }).then(({ data }) =>
    data.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.createdAt,
    }))
  );

  const categoriesPromise = getAllCategories().then((categories) =>
    categories.map((category) => ({
      url: `${baseUrl}/category/${category.name}`,
      lastModified: new Date().toISOString(),
    }))
  );

  let fetchedRoutes: { url: string; lastModified: string }[] = [];

  try {
    fetchedRoutes = (await Promise.all([productsPromise, categoriesPromise])).flat().map((route) => ({
      url: route.url,
      lastModified: route.lastModified instanceof Date ? route.lastModified.toISOString() : route.lastModified,
    }));
  } catch (error) {
    console.error("Error fetching sitemap data:", error);
  }

  return [...routesMap, ...fetchedRoutes];
}
