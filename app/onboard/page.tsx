
'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";



const WelcomeSellerPage = () => {
  const router = useRouter();

  const handleProceedToPayment = () => {
    // Redirect to the payment page
    router.push("/payment");
  };

  return (
    <div className="min-h-screen   flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 px-8 flex flex-col justify-center container mx-auto rounded-sm items-center text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to {APP_NAME} Seller Community!
        </h1>
        <p className="text-lg mb-8">
          Congratulations on starting your journey with us. We are thrilled to
          have you!
        </p>
        <Button variant="secondary" onClick={handleProceedToPayment}>
          Proceed to Payment
        </Button>
      </div>

      {/* Body Section */}
      <div className="flex-1 bg-gray-100 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8">
            Why the Onboarding Fee is Worth It
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-2xl font-semibold mb-2">
                Professional Photoshoot
              </h3>
              <p>
                A picture is worth a thousand words. Our professional photoshoot
                services ensure your products look their best, attracting more
                customers and driving sales.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-2xl font-semibold mb-2">Free Marketing</h3>
              <p>
                Benefit from our extensive marketing campaigns. We promote your
                products across various platforms, giving you maximum exposure
                without any additional cost.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-2xl font-semibold mb-2">Seller Support</h3>
              <p>
                Our dedicated support team is here to help you every step of the
                way. From setting up your shop to managing orders, we&apos;ve got you
                covered.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-blue-600 text-white py-8 px-8  container rounded-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h4 className="text-xl font-semibold">Get Started Now</h4>
            <p>Join our community of successful sellers.</p>
          </div>
          <Button variant="outline" onClick={handleProceedToPayment}>
            Pay 300 KES
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSellerPage;
