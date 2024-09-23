import { Resend } from "resend";
import { SENDER_EMAIL } from "@/lib/constants";
import { order } from "@/types/sellerindex";
import SellerNotifyEmail from "./sellerNotify";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendSellerNotification = async ({
  order,
  sellerEmail,
}: {
  order: order;
  sellerEmail: string;
}) => {
  const res = await resend.emails.send({
    from: SENDER_EMAIL,
    to: sellerEmail,
    subject: "📦 New Order Alert - Please Deliver Your Product",
    react: <SellerNotifyEmail order={order} />,
  });
  return res;
};
