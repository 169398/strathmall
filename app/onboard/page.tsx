"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PaymentBg } from "@/components/shared/Payment-bg";
import Footer from "@/components/shared/footer";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const WelcomeSellerPage = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={500}
          gravity={0.2}
          initialVelocityX={10}
        />
      )}

      {/* Hero Section */}
      <div className="flex-1 w-full container mx-auto items-center text-center">
        <PaymentBg />
      </div>

      {/* Body Section */}
      <div className="flex-1 bg-gray-100 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8">
            Seller Onboarding: Here&apos;s What You Need to Know 🚀
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-2xl font-semibold mb-2">
                Access Your Dashboard 🛠️
              </h3>
              <p>
                Once your payment is completed, you can access your seller
                dashboard by clicking on your user profile and selecting{" "}
                <strong>&quot;My Shop.&quot;</strong> This is where you can
                manage your products and track orders
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-2xl font-semibold mb-2">
                Delivery Service 🚚
              </h3>
              <p>
                Send your orders to Mithoo House (Opposite Popman House), near
                Khoja stage, 1st floor, room M22. Make sure to bring the
                products there within 24 hours for timely delivery
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-2xl font-semibold mb-2">
                Receive Your Payment 💵
              </h3>
              <p>
                After your order has been delivered, payments will be processed.
                Please note that a 5% commission will be deducted from your
                earnings.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-2xl font-semibold mb-2">Free Marketing 📢</h3>
              <p>
                We run extensive marketing campaigns across various platforms to
                give your products maximum exposure, at no additional cost to
                you.
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow-md">
              <h3 className="text-2xl font-semibold mb-2">
                Support & Maintenance 🔧
              </h3>
              <p>
                We take care of hosting, maintenance, and server uptime, so you
                can focus on running your business with peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="container rounded-sm">
        <Footer />
      </div>
    </div>
  );
};

export default WelcomeSellerPage;
