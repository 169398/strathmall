import React from "react";
import OnboardingPayPalForm from "./paymentForm";
import { auth } from "@/auth";

export default async function OnboardPage() {
const session = await auth();
    const userId = session?.user.id || "";


  const paypalClientId = process.env.PAYPAL_CLIENT_ID || "";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Complete Your Onboarding</h1>
      <p className="mb-4">
        To complete your onboarding, please pay the Ksh 300 fee using PayPal.
      </p>
      <OnboardingPayPalForm userId={userId} paypalClientId={paypalClientId} />
    </div>
  );
}
