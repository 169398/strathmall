"use client"; 

import { cakeSizes } from "@/lib/cake-size";
import React, { useState } from "react";

const OrderForm = () => {
  const [orderDetails, setOrderDetails] = useState({
    location: "",
    phoneNumber: "",
    quantity: 1,
    notes: "",
    cakeSize: cakeSizes[0].value, 
    cakeType: "egg", 
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setOrderDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  return (
    <form className="flex flex-col gap-3 mt-4">
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
          {/* Add more cake types as needed */}
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
          name="notes"
          value={orderDetails.notes}
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
