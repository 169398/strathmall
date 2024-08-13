import React from "react";
import { Vortex } from "../ui/vortex";
import { APP_NAME } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { createFee } from "@/lib/actions/onboarding.actions";
import { toast } from "../ui/use-toast";

export function PaymentBg() {
  const router = useRouter();

  const handleProceedToPayment = async () => {
    try {
      // Create the fee record
      const response = await createFee();
      if (response.success) {
        // Redirect to the payment page if fee creation is successful
        router.push("/payment");
      } else {
        // Handle error if fee creation fails
        console.error("Error creating fee:", response.message);
        toast({
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full mx-auto rounded h-[30rem] overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Welcome to {APP_NAME} Seller Community!
        </h2>
        <p className="text-white text-sm md:text-2xl max-auto mt-6 text-auto">
          To kickstart your success, we kindly request a one-time onboarding fee
          of 300 KES. This fee enables us to provide you with exceptional
          services and support throughout your selling journey.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button
            onClick={handleProceedToPayment}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
          >
            Proceed to Payment
          </button>
        </div>
      </Vortex>
    </div>
  );
}
