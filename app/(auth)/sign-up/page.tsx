import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";

import SignUpForm from "./signup-form";
import { Session } from "next-auth";
import { ReferralHandler } from "./referral-handler";

interface SignUpPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
    ref?: string;
    [key: string]: string | undefined;
  }>;
}

export const metadata: Metadata = {
  title: `Sign Up - ${APP_NAME}`,
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = (await auth()) as Session | null;
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl;
  const referralCode = params?.ref;

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728757714/logo_bxjyga.png"
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
            />
          </Link>
          <div className="text-xs text-center text-muted-foreground bg-blue-200 mt-4">
            🛡️Your information is protected{" "}
          </div>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to create your account
          </CardDescription>
          {referralCode && (
            <div className="text-sm text-center text-green-600 bg-green-100 p-2 rounded">
              🎉 You were referred by a friend! Create your account to get
              started.
            </div>
          )}
        </CardHeader>
        <CardContent>
          <SignUpForm />
          <ReferralHandler/>
        </CardContent>
      </Card>
    </div>
  );
}
