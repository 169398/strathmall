import React from "react";
import { Vortex } from "../ui/vortex";
import { APP_NAME } from "@/lib/constants";

export function PaymentBg() {
  return (
    <div className="w-full mx-auto rounded h-[30rem] overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Welcome to {APP_NAME} Seller Community
        </h2>
        <p className="text-white text-sm md:text-2xl max-auto mt-6 text-auto">
          We are excited to have you join our seller community! Get ready to showcase your products and grow your business with us. 
        </p>
      </Vortex>
    </div>
  );
}
