// verifyemail/index.tsx

"use server";

import { Resend } from "resend";
import { verificationTokens, } from "@/db/schema";
import { addMinutes } from "date-fns";
import db from "@/db/drizzle";
import VerificationEmail from "./verify-email";
import { SENDER_EMAIL } from "@/lib/constants";
import{user} from "@/types/sellerindex";


export async function sendVerificationEmail(
  user: user
) {

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://strathmall.com"
        : "http://localhost:3000";
        
  const verificationToken = crypto.randomUUID();
  
  

  await db.insert(verificationTokens).values({
    identifier: user.email,
    token: verificationToken,
    expires: addMinutes(new Date(), 60),
  });

const verificationLink = `${baseUrl}/verify-mail?identifier=${user.email}&token=${verificationToken}`;

  const resend = new Resend(process.env.RESEND_API_KEY as string);

  await resend.emails.send({
    from: SENDER_EMAIL,
    to: user.email,
    subject: "Verify your email",
    react: (
      <VerificationEmail user={user} verificationLink={verificationLink} />
    ),
  });
}
