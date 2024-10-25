"use client";

import { createCakeOrder } from "@/lib/actions/selleractions";
import { cakeSizes } from "@/lib/cake-size";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";

const OrderForm = ({ productId }: { productId: string }) => {
  const { toast } = useToast(); 
  const [orderDetails, setOrderDetails] = useState({
    location: "",
    phoneNumber: "",
    quantity: 1,
    cakeSize: cakeSizes[0].value,
    cakeType: "egg",
    customizations: "",
    
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setOrderDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(orderDetails).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("productId", productId);

    try {
      const result = await createCakeOrder(null, formData);

      if (result.success) {
        toast({
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Order Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form className="flex flex-col gap-3 mt-4" onSubmit={handleSubmit}>
      <label>
        Location:
        <input
          type="text"
          name="location"
          value={orderDetails.location}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
      </label>
      <label>
        Phone Number:
        <input
          type="tel"
          name="phoneNumber"
          value={orderDetails.phoneNumber}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
      </label>
      <label>
        Cake Size:
        <select
          name="cakeSize"
          value={orderDetails.cakeSize}
          onChange={handleInputChange}
          className="border p-2 w-full"
        >
          {cakeSizes.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Cake Type:
        <select
          name="cakeType"
          value={orderDetails.cakeType}
          onChange={handleInputChange}
          className="border p-2 w-full"
        >
          <option value="egg">Egg</option>
        </select>
      </label>
      <label>
        Quantity:
        <input
          type="number"
          name="quantity"
          value={orderDetails.quantity}
          onChange={handleInputChange}
          className="border p-2 w-full"
          min="1"
          required
        />
      </label>
      <label>
        Customizations (Notes):
        <textarea
          name="customizations"
          value={orderDetails.customizations}
          onChange={handleInputChange}
          className="border p-2 w-full"
        />
      </label>
      <button type="submit" className="bg-pink-500 text-white p-2 rounded">
        Make Order
      </button>
    </form>
  );
};

export default OrderForm;
