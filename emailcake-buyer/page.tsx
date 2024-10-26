// emailcake-buyer/page.tsx

import { Resend } from "resend";
import { SENDER_EMAIL } from "@/lib/constants";
import { BakeryOrder } from "@/types/sellerindex";
import PurchaseReceiptEmail from "./purchasereceipt";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: BakeryOrder }) => {
  return await resend.emails.send({
    from: SENDER_EMAIL,
    to: order.user.email,
    subject: "📦 Order Confirmation - Your Cake Order",
    react: <PurchaseReceiptEmail order={order} />,
  });
};
