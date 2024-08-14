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

export default function PaymentForm({
  paypalClientId,
  orderId,
}: {
  paypalClientId: string;
  orderId: string;
}) {
  const { toast } = useToast();

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    if (isPending) {
      return <div>Loading PayPal...</div>;
    } else if (isRejected) {
      return <div>Error in loading PayPal.</div>;
    }
    return null;
  }

  const handleCreatePayPalOrder = async () => {
    try {
      const res = await createPayPalOrder(orderId);
      console.log("Response from server:", res);

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
    console.log("Approved PayPal orderID:", data.orderID);
  
    try {
      const res = await approvePayPalOrder(orderId, { orderID: data.orderID });
  
      toast({
        description: res.message,
        variant: res.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        description: "Failed to approve PayPal order.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="payment-form">
      <h2 className="text-xl pb-4">Order Summary</h2>
      <div className="flex justify-between">
        <div>Total</div>
        <div>300</div>
      </div>
      <div>
        <PayPalScriptProvider options={{ clientId: paypalClientId }}>
          <PrintLoadingState />
          <PayPalButtons
            createOrder={handleCreatePayPalOrder}
            onApprove={handleApprovePayPalOrder}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
}
