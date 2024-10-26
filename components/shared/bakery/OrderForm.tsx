"use client";

import { createCakeOrder } from "@/lib/actions/selleractions";
import { cakeSizes } from "@/lib/cake-size";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { deliveryTimes } from "@/lib/delivery-time"; // Import delivery times

interface OrderFormProps {
  productId: string;
  sellerId: string;
  cakeName: string; 
  cakeImage: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  productId,
  sellerId,
  cakeName, // Destructure cakeName from props
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
    deliveryDate: "", // Add deliveryDate
    deliveryTime: deliveryTimes[0], // Add deliveryTime with default value
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submission

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
    setIsSubmitting(true); // Start submission
    const formData = new FormData();
    formData.append("sellerId", sellerId); // Include sellerId in formData
    formData.append("cakeName", cakeName); // Append cakeName from props
    formData.append("cakeImage", cakeImage); // Append cakeImage from props
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
        setOrderDetails({
          location: "",
          phoneNumber: "",
          quantity: 1,
          cakeSize: cakeSizes[0].value,
          cakeType: "egg",
          customizations: "",
          deliveryDate: "",
          deliveryTime: deliveryTimes[0],
        }); // Clear form on success
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
      setIsSubmitting(false); // End submission
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
          {/* Add more cake types if needed */}
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

      {/* New Delivery Date Field */}
      <label>
        Delivery Date:
        <input
          type="date"
          name="deliveryDate"
          value={orderDetails.deliveryDate}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
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
