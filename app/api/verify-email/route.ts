// /app/api/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db/drizzle";
import { verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const identifier = searchParams.get("identifier");
  const token = searchParams.get("token");

  if (!identifier || !token) {
    return NextResponse.redirect("/verify-email?error=invalid");
  }

  const result = await db
    .select()
    .from(verificationTokens)
    .where(
      eq(verificationTokens.identifier, identifier),
      eq(verificationTokens.token, token),
      eq(verificationTokens.expires, ">=", new Date())
    )
    .first();

  if (result) {
    // Token is valid; delete it from the database
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    // Redirect to the success page
    return NextResponse.redirect("/success");
  }

  // If the token is invalid or expired, redirect to an error page
  return NextResponse.redirect("/verify-email?error=invalid-token");
}
