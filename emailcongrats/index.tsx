import { Resend } from "resend";
import { SENDER_EMAIL } from "@/lib/constants";
import CongratulationsEmail from "./congratulations-email";
import { seller } from "@/types/sellerindex";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendCongratulatoryEmail = async ({
 seller
}: {
  seller : seller;
}) => {
  const res = await resend.emails.send({
    from: SENDER_EMAIL,
    to: seller.email,
    subject: "🎉 Congratulations on setting up your shop",
    react: <CongratulationsEmail  seller={seller} />,
  });
  console.log(res);
};
