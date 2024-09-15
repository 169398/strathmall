'use client';


import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ThankYouPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-16 px-8">
      <h1 className="text-4xl font-bold mb-8">Thank You!</h1>
      <p className="mb-8">Your payment has been successfully processed.</p>
      <Button variant="default" onClick={() => router.push("/dashboard")} aria-label="go to dashboard">
        Go to your Dashboard
      </Button>
    </div>
  );
};

export default ThankYouPage;
