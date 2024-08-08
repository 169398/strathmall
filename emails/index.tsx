import { Resend } from "resend";
import { SENDER_EMAIL, } from "@/lib/constants";
import PurchaseReceiptEmail from "./purchase-receipt";
import { order } from "@/types/sellerindex";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({
  order,
}: {
  order: order;
}) => {
  const res = await resend.emails.send({
    from: SENDER_EMAIL,
    to: order.user.email,
    subject: "📦Order Confirmation🧾✨",
    react: <PurchaseReceiptEmail order={order} />,
  });
  console.log(res);
};
