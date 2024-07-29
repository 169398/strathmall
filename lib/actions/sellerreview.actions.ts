"use server";

import { z } from "zod";
import { insertSellerReviewSchema } from "../validator";
import { auth } from "@/auth";
import db from "@/db/drizzle";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { sellerProducts, sellerReviews } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { formatError } from "../utils";
import { PAGE_SIZE } from "../constants";

export async function createUpdateReview(
  data: z.infer<typeof insertSellerReviewSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const review = insertSellerReviewSchema.parse({
      ...data,
      userId: session?.user.id,
    });
    const product = await db.query.sellerProducts.findFirst({
      where: eq(sellerProducts.id, review.sellerProductId),
    });
    if (!product) throw new Error("Product not found");

    const reviewExists = await db.query.reviews.findFirst({
      where: and(
        eq(sellerReviews.sellerProductId, review.sellerProductId),
        eq(sellerReviews.userId, review.userId)
      ),
    });
    await db.transaction(async (tx) => {
      if (reviewExists) {
        await tx
          .update(sellerReviews)
          .set({
            description: review.description,
            title: review.title,
            rating: review.rating,
          })
          .where(eq(sellerReviews.id, reviewExists.id));
      } else {
        await tx.insert(sellerReviews).values(review);
      }
      const averageRating = db.$with("average_rating").as(
        db
          .select({ value: sql`avg(${sellerReviews.rating})`.as("value") })
          .from(sellerReviews)
          .where(eq(sellerReviews.sellerProductId, review.sellerProductId))
      );
      const numReviews = db.$with("num_reviews").as(
        db
          .select({ value: sql`count(*)`.as("value") })
          .from(sellerReviews)
          .where(eq(sellerReviews.sellerProductId, review.sellerProductId))
      );
      await tx
        .with(averageRating, numReviews)
        .update(sellerProducts)
        .set({
          rating: sql`(select * from ${averageRating})`,
          numReviews: sql`(select * from ${numReviews})`,
        })
        .where(eq(sellerProducts.id, review.sellerProductId));
    });

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: "Review updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getReviews({
  sellerProductId,
  limit = PAGE_SIZE,
  page,
}: {
  sellerProductId: string;
  limit?: number;
  page: number;
}) {
  const data = await db.query.sellerReviews.findMany({
    where: eq(sellerReviews.sellerProductId, sellerProductId),
    with: { user: { columns: { name: true } } },
    orderBy: [desc(sellerReviews.createdAt)],
    limit,
    offset: (page - 1) * limit,
  });
  const dataCount = await db
    .select({ count: count() })
    .from(sellerReviews)
    .where(eq(sellerReviews.sellerProductId, sellerProductId));
  return {
    data,
    totalPages: Math.ceil(dataCount[0].count / limit),
  };
}

export const getUserReviewByProductId = async ({
  sellerProductId,
}: {
  sellerProductId: string;
}) => {
  const session = await auth();
  if (!session) throw new Error("User is not authenticated");

  return await db.query.sellerReviews.findFirst({
    where: and(
      eq(sellerReviews.sellerProductId, sellerProductId,),
      eq(sellerReviews.userId, session?.user.id!)
    ),
  });
};
