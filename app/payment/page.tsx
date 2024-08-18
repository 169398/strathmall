import { getOrderById } from "@/lib/actions/onboarding.actions";
import { APP_NAME } from "@/lib/constants";
import { notFound } from "next/navigation";
import PaymentForm from "./paymentForm";

export const metadata = {
  title: `Order Details - ${APP_NAME}`,
};

const OrderDetailsPage = async ({
  params: { id },
}: {
  params: {
    id: string;
  };
}) => {
  const order = await getOrderById(id);

  console.log('order',order)
  if (!order) notFound();


  return (
    <PaymentForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
    />
  );
};

export default OrderDetailsPage;
