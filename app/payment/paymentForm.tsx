"use client";

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useToast } from "@/components/ui/use-toast";
import {
  createPayPalOrder,
  approvePayPalOrder,
} from "@/lib/actions/onboarding.actions";
import { feeOrder } from "@/types";

export default function PaymentForm({
  paypalClientId,
  order,
}: {
  paypalClientId: string;
  order: feeOrder;
}) {
  const { toast } = useToast();

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    if (isPending) {
      return <div className="text-center text-gray-500">Loading PayPal...</div>;
    } else if (isRejected) {
      return (
        <div className="text-center text-red-500">
          Error in loading PayPal. Please try again later.
        </div>
      );
    }
    return null;
  }

  const handleCreatePayPalOrder = async () => {
    try {
      const res = await createPayPalOrder(order.id);

      if (!res.success) {
        toast({
          description: res.message,
          variant: "destructive",
        });
        return null;
      }

      const paypalOrderId = res.data?.paypalOrderId;
      if (!paypalOrderId) {
        throw new Error("PayPal order ID not found in response");
      }

      return paypalOrderId; // Return PayPal's order ID
    } catch (error: any) {
      toast({
        description: error.message || "Failed to create PayPal order.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    try {
      const res = await approvePayPalOrder(order.id, { orderID: data.orderID });

      if (res?.success) {
        toast({
          description: "Payment approved successfully!",
          variant: "default",
        });
      } else {
        toast({
          description: res?.message || "Failed to approve PayPal order. Please try again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/onboard"; // Redirect to onboard page
        }, 1000);
      }
    } catch (error) {
      toast({
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/onboard"; // Redirect to onboard page
      }, 1000);
    }
  };

  return (
    <div className="payment-page mt-12 lg:mt-1">
      {/* Hero Section */}
      <div className="hero-section container rounded-sm  bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#ff00ff] to-[#00ffff] text-white text-center py-8 ">
        <h1 className="text-4xl font-bold mb-2">Complete Your Payment</h1>
        <p className="text-lg">
          Securely pay the onboarding fee to join our marketplace.Then wait for your account to be approved.We will notify you via a call or email.
        </p>
      </div>

      {/* Payment Form */}
      <div className="payment-form max-w-lg mx-auto p-4 bg-white shadow-md rounded-md mt-8">
        <h2 className="text-2xl font-semibold pb-4 text-gray-800">
          Order Summary
        </h2>
        <div className="flex justify-between text-lg mb-4">
          <div className="font-medium">Total:</div>
          <div className="font-medium">1000 KES</div>
        </div>
        <div>
          <PayPalScriptProvider options={{ clientId: paypalClientId }}>
            <PrintLoadingState />
            <div className="mt-4">
              <PayPalButtons
                createOrder={handleCreatePayPalOrder}
                onApprove={handleApprovePayPalOrder}
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "pill",
                  label: "pay",
                }}
              />
            </div>
          </PayPalScriptProvider>
          <span className="text-xs text-blue-300 ">Mpesa coming soon</span>
        </div>
      </div>

      {/* Footer */}
      <div className="footer bg-gray-100 text-slate-400 text-center py-4 mt-12">
        <p className="text-sm">© 2024 Your Marketplace. All rights reserved.</p>
        <p className="text-sm">
          Secure and trusted payment processing by PayPal.
        </p>
      </div>
    </div>
  );
}
