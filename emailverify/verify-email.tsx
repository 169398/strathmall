// verifyemail/verify-email.tsx

import React from "react";
import { user } from "@/types/sellerindex";


interface VerificationEmailProps {
  verificationLink: string;
  user: user;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({
  verificationLink,
  user,

}) => {
  return (
    <div>
      <h1>Verify your email {user.name}</h1>
      <p>
        Thank you for signing up. Please verify your email address by clicking
        the link below:
      </p>
      <a href={verificationLink}>Verify Email</a>
        <p>If you didn&apos;t sign up, you can safely ignore this email.</p>
    </div>
  );
};

export default VerificationEmail;
