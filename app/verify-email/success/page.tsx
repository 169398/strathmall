"use client";

import Link from "next/link";

export default function VerificationSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
     

      <h1 className="text-2xl font-bold">Verification Successful</h1>
      <p className="mt-4 text-lg text-center">
        Your email has been successfully verified. You can now log in.
      </p>
      <Link
        href="/sign-in"
        className="mt-6 text-blue-500 font-semibold text-lg"
      >
        Log In
      </Link>
    </div>
  );
}
