'use client';


import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useToast } from "@/components/ui/use-toast";
import { approveOnboardingFeePayPalOrder, createOnboardingFeePayPalOrder } from "@/lib/actions/onboarding.actions";



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
export default function OnboardingPayPalForm({
  userId,
  paypalClientId,
}: {
  userId: string;
  paypalClientId: string;
}) {
  const { toast } = useToast();

  const handleCreatePayPalOrder = async () => {
    const res = await createOnboardingFeePayPalOrder(userId);
    if (!res.success) {
      toast({ description: res.message, variant: "destructive" });
      return null;
    }
    return res.data.orderId; 
  };
  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approveOnboardingFeePayPalOrder(userId, data);
    toast({
      description: res.message,
      variant: res.success ? "default" : "destructive",
    });
  };

  return (
    <PayPalScriptProvider options={{ clientId: paypalClientId }}>
        <PrintLoadingState />
      <PayPalButtons
        createOrder={handleCreatePayPalOrder}
        onApprove={handleApprovePayPalOrder}
      />
    </PayPalScriptProvider>
  );
}
