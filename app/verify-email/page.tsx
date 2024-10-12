"use client";

import Image from "next/image";



export default function VerificationPage( ){

  return (
    <div className="flex  flex-col items-center bg-blue-10 justify-center h-screen">
      <div className="relative mb-4 h-60 w-60 text-muted-foreground">
        <Image
          src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728757714/emails-sent_y3xo9f.jpg"
          fill
          alt=" email sent image"
        />
      </div>

      <h3 className="font-semibold text-2xl">Check your email</h3>

      <p className="text-muted-foreground text-center">
        We&apos;ve sent a verification link to your email.
      </p>
    </div>
  );
}
