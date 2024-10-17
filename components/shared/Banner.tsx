"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";

export default function Banner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const phoneNumber = "254714594345";
  const message =
    "Hello, I would like to inquire about the shop categories and universities.";

  const handleSendText = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full bg-red-500 rounded-sm border-t-12">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex flex-grow items-center space-x-2 text-white">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              If your shop category or university is not listed below, please
              send a text here
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-auto">
            <Button
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
              onClick={handleSendText}
              aria-label="Send WhatsApp message"
            >
              <FaWhatsapp className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              aria-label="Close banner"
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
