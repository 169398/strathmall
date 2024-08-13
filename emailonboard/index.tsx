import { Resend } from "resend";
import { SENDER_EMAIL } from "@/lib/constants";
import PaymentReceipt from "./payment-receipt";
import { feeOrder } from "@/types";
import { seller } from "@/types/sellerindex";



const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order ,seller}: { order: feeOrder,seller:seller }) => {
  const res = await resend.emails.send({
    from: SENDER_EMAIL,
    to: seller.email,
    subject: "Payment Confirmation",
    react: <PaymentReceipt order={order} seller={seller}  />,
  });
return res;};
