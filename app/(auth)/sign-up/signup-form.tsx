"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {  useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signUp } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";
import { useActionState, useState } from "react";

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const referralCode = searchParams.get('ref');


  const [data, action] = useActionState(signUp, {
    success: false,
    message: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button
        disabled={pending || !termsAccepted}
        className="w-full"
        variant="default"
        aria-label="sign up"
      >
        {pending ? "Submitting..." : "Sign Up"}
      </Button>
    );
  };

  // Redirect to the verification page if sign up is successful
  if (data.success) {
    router.push(`/verify-email?email=${signUpDefaultValues.email}`);
  }

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <input type="hidden" name="referralCode" value={referralCode || ""} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            type="text"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="john@example.com"
            required
            type="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            required
            type="password"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>
        <div className="flex items-start">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(Boolean(checked))}
            required
          />
          <Label htmlFor="terms" className="ml-2">
            I agree to the{" "}
            <Link href="/terms" target="_blank" className="link text-blue-600">
              StrathMall terms
            </Link>
          </Label>
        </div>
        <div>
          <SignUpButton />
        </div>

        {!data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            target="_self"
            className="link text-blue-600"
            href={`/sign-in?callbackUrl=${callbackUrl}`}
          >
            Sign In
          </Link>
        </div>
        {referralCode && (
          <div className="text-sm text-green-600 mb-4">
            You can also earn money when you refer a friend💰.
          </div>
        )}
      </div>
    </form>
  );
}
