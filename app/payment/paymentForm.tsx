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
    let status = "";
    if (isPending) {
      status = "Loading PayPal...";
    } else if (isRejected) {
      status = "Error in loading PayPal.";
    }
    return status;
  }

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(orderId);
    if (!res.success)
      return toast({
        description: res.message,
        variant: "destructive",
      });
     
    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(orderId, data);
    toast({
      description: res.message,
      variant: res.success ? "default" : "destructive",
    });
  };

  return (
    <div className="payment-form">
      <h2 className="text-xl pb-4">Order Summary</h2>
      <div className="flex justify-between">
        <div>Total</div>
        <div>{300}</div>
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
