
import { Resend } from "resend";
import { SENDER_EMAIL } from "@/lib/constants";
import { BakeryOrder, } from "@/types/sellerindex";
import SellerCakeNotification from "./sellercakenotification";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendSellerNotification = async ({
  order,
  sellerEmail,
}: {
  order: BakeryOrder;
  sellerEmail: string;
}) => {
  return await resend.emails.send({
    from: SENDER_EMAIL,
    to: sellerEmail,
    subject: "📢 New Cake Order Alert",
    react: <SellerCakeNotification order={order} />,
  });
};
