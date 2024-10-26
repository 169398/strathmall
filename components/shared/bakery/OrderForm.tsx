"use client";

import { createCakeOrder } from "@/lib/actions/selleractions";
import { cakeSizes } from "@/lib/cake-size";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { deliveryTimes } from "@/lib/delivery-time";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";

interface OrderFormProps {
  productId: string;
  sellerId: string;
  cakeName: string;
  cakeImage: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  productId,
  sellerId,
  cakeName,
  cakeImage,
}) => {
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState({
    location: "",
    phoneNumber: "",
    quantity: 1,
    cakeSize: cakeSizes[0].value,
    cakeType: "egg",
    customizations: "",
    deliveryDate: new Date(), // Use Date object
    deliveryTime: deliveryTimes[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setOrderDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleDateChange = (date: Date) => {
    setOrderDetails((prevDetails) => ({ ...prevDetails, deliveryDate: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("sellerId", sellerId);
    formData.append("cakeName", cakeName);
    formData.append("cakeImage", cakeImage);
    Object.entries(orderDetails).forEach(([key, value]) => {
      formData.append(
        key,
        value instanceof Date ? value.toISOString() : (value as string)
      );
    });
    formData.append("productId", productId);

    try {
      const result = await createCakeOrder(null, formData);

      if (result.success) {
        toast({
          description: result.message,
          variant: "default",
        });
        setOrderDetails({
          location: "",
          phoneNumber: "",
          quantity: 1,
          cakeSize: cakeSizes[0].value,
          cakeType: "egg",
          customizations: "",
          deliveryDate: new Date(),
          deliveryTime: deliveryTimes[0],
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
    } finally {
      setIsSubmitting(false);
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
          placeholder="i.e. Langata Road, Estate name ,Appartment name"
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
          placeholder="i.e. 0712345678"
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
          placeholder="i.e. Add a message to the cake or any special instructions"
        />
      </label>

      {/* New Delivery Date Field */}
      <label>
        Delivery Date:
        <Popover>
          <PopoverTrigger asChild>
            <button className="bg-white border p-2 rounded w-full text-left">
              {orderDetails.deliveryDate
                ? orderDetails.deliveryDate.toLocaleDateString()
                : "Select Date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-2 bg-white shadow rounded-md">
            <DatePicker
              selected={orderDetails.deliveryDate}
              onChange={(date: Date | null) => handleDateChange(date as Date)}
              minDate={new Date()}
              inline
            />
          </PopoverContent>
        </Popover>
      </label>

      {/* New Delivery Time Field */}
      <label>
        Delivery Time:
        <select
          name="deliveryTime"
          value={orderDetails.deliveryTime}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        >
          {deliveryTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>

      <motion.button
        type="submit"
        className={`bg-pink-500 text-white p-2 rounded flex items-center justify-center ${
          isSubmitting ? "cursor-not-allowed opacity-50" : ""
        }`}
        whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <FiLoader className="animate-spin mr-2" />
            Processing...
          </>
        ) : (
          "Make Order"
        )}
      </motion.button>
    </form>
  );
};

export default OrderForm;
