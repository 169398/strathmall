'use client';


import {  useSearchParams } from "next/navigation";
import { getOrderById } from "@/lib/actions/onboarding.actions";
import PaymentForm from "./paymentForm";
import { useEffect } from "react";



export default function PaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderId) {
      // Fetch the order by ID
      getOrderById(orderId).then((order) => {
        console.log("Order:", order);
      });
    }
  }, [orderId]);

  return (
      <PaymentForm
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        orderId={orderId ?? ""}
      />
    );
}

