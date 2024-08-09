import { redirect } from "next/navigation";
import db from "@/db/drizzle";
import { verificationTokens, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { identifier?: string; token?: string };
}) {
  const identifier = searchParams.identifier;
  const token = searchParams.token;

  if (!identifier || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Invalid Request</h1>
        <p className="mt-4 text-lg">
          The verification link is missing required parameters.
        </p>
        <a href="/sign-up" className="mt-6 text-blue-500">
          Go back to Sign Up
        </a>
      </div>
    );
  }

  const verificationToken = await db
    .select()
    .from(verificationTokens)
    .where(
      and(
        eq(verificationTokens.identifier, identifier),
        eq(verificationTokens.token, token)
      )
    )
    .limit(1);

  if (verificationToken.length > 0) {
    // Update user's emailVerified status
    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.email, identifier));

    // Remove the used token
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, identifier),
          eq(verificationTokens.token, token)
        )
      );

    // Redirect to the verification success page
    redirect("/verify-email/success");
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Verification Failed</h1>
        <p className="mt-4 text-lg">
          The verification link is invalid or has expired.
        </p>
        <a href="/sign-up" className="mt-6 text-blue-500">
          Go back to Sign Up
        </a>
      </div>
    );
  }
}
