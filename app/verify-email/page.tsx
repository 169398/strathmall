"use client";

import Image from "next/image";



export default function VerificationPage( ){

  return (
    <div className="flex  flex-col items-center bg-blue-10 justify-center h-screen">
      <div className="relative mb-4 h-60 w-60 text-muted-foreground">
        <Image src="/emails-sent.png" fill alt=" email sent image" />
      </div>

      <h3 className="font-semibold text-2xl">Check your email</h3>
 
        <p className="text-muted-foreground text-center">
          We&apos;ve sent a verification link to your email.
        </p>
      
    </div>
  );
}
