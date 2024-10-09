'use client';

import { sendStkPush } from "@/lib/actions/stkPush";
import { stkPushQuery } from "@/lib/actions/stkPushQuery";
import React, { useState } from "react";
import STKPushQueryLoading from "./STKPushQueryLoading";
import PaymentSuccess from "./PaymentSuccess";


const PaymentForm = () => {
  // State for handling loading and success
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stkQueryLoading, setStkQueryLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reqcount, setReqcount] = useState(0);

  // Example form data state (can be replaced with your form handling logic)
  const [dataFromForm, setDataFromForm] = useState({
    mpesa_phone: "",
    name: "",
    amount: "",
  });

  // Function for validating the form and handling STK push submission
  const handleSubmit = async () => {
    setLoading(true);

    const formData = {
      mpesa_number: dataFromForm.mpesa_phone.trim(),
      name: dataFromForm.name.trim(),
      amount: parseFloat(dataFromForm.amount),
    };

    // Regex for Kenyan phone number validation
    const kenyanPhoneNumberRegex =
      /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8}|\+2547\d{8}|\+2541\d{8})$/;

    if (!kenyanPhoneNumberRegex.test(formData.mpesa_number)) {
      setLoading(false);
      return alert("Invalid M-Pesa number");
    }

    // Call sendStkPush server action
    const { data: stkData, error: stkError } = await sendStkPush(formData);

    if (stkError) {
      setLoading(false);
      return alert(stkError);
    }

    const checkoutRequestId = stkData.CheckoutRequestID;
    setStkQueryLoading(true);

    // Start polling the STK query
    stkPushQueryWithIntervals(checkoutRequestId);
  };

  // Function for querying STK Push status with polling
  const stkPushQueryWithIntervals = (CheckoutRequestID: string) => {
    const timer = setInterval(async () => {
      setReqcount(reqcount + 1);

      if (reqcount === 15) {
        clearInterval(timer);
        setStkQueryLoading(false);
        setLoading(false);
        setErrorMessage("You took too long to pay");
      }

      const { data, error } = await stkPushQuery(CheckoutRequestID);

      if (error) {
        if (error.response.data.errorCode !== "500.001.1001") {
          clearInterval(timer);
          setStkQueryLoading(false);
          setLoading(false);
          setErrorMessage(error?.response?.data?.errorMessage);
        }
      }

      if (data) {
        if (data.ResultCode === "0") {
          clearInterval(timer);
          setStkQueryLoading(false);
          setLoading(false);
          setSuccess(true);
        } else {
          clearInterval(timer);
          setStkQueryLoading(false);
          setLoading(false);
          setErrorMessage(data?.ResultDesc);
        }
      }
    }, 2000);
  };

  return (
    <>
      {stkQueryLoading ? (
        <STKPushQueryLoading number={dataFromForm.mpesa_phone} />
      ) : success ? (
        <PaymentSuccess />
      ) : (
        <div className="lg:pl-12">
          {/* Form Fields */}
          <input
            type="text"
            placeholder="Enter M-Pesa number"
            value={dataFromForm.mpesa_phone}
            onChange={(e) =>
              setDataFromForm({ ...dataFromForm, mpesa_phone: e.target.value })
            }
            className="mb-4 p-2 border"
          />
          <input
            type="text"
            placeholder="Enter Name"
            value={dataFromForm.name}
            onChange={(e) =>
              setDataFromForm({ ...dataFromForm, name: e.target.value })
            }
            className="mb-4 p-2 border"
          />
          <input
            type="number"
            placeholder="Enter Amount"
            value={dataFromForm.amount}
            onChange={(e) =>
              setDataFromForm({ ...dataFromForm, amount: e.target.value })
            }
            className="mb-4 p-2 border"
          />

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-orange-500 px-4 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 focus:bg-orange-600 focus:outline-none"
          >
            {loading ? "Processing..." : "Proceed With Payment"}
          </button>

          {/* Error Message Display */}
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </div>
      )}
    </>
  );
};

export default PaymentForm;
