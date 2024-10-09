
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const url = new URL(request.url);
  const securityKey = url.pathname.split("/").pop();

  // Validate the security key
  if (securityKey !== process.env.MPESA_CALLBACK_SECRET_KEY) {
    return NextResponse.json("Unauthorized request", { status: 401 });
  }

  // Extract client IP and check whitelist
  const clientIp =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("remote-addr");
  const whitelist = [
    "196.201.214.200",
    "196.201.214.206",
    "196.201.213.114",
    "196.201.214.207",
    "196.201.214.208",
    "196.201.213.44",
    "196.201.212.127",
    "196.201.212.138",
    "196.201.212.129",
    "196.201.212.136",
    "196.201.212.74",
    "196.201.212.69",
  ];

  if (!clientIp || !whitelist.includes(clientIp)) {
    return NextResponse.json({ error: "IP not whitelisted" }, { status: 403 });
  }

  // Handle successful or failed transaction
  if (!data.Body.stkCallback.CallbackMetadata) {
    // For failed transactions
    console.log(data.Body.stkCallback.ResultDesc);
    return NextResponse.json("Transaction failed", { status: 400 });
  }

  // Extract metadata
  const body = data.Body.stkCallback.CallbackMetadata.Item;
  const amountObj = body.find((obj: any) => obj.Name === "Amount");
  const codeObj = body.find((obj: any) => obj.Name === "MpesaReceiptNumber");
  const phoneNumberObj = body.find((obj: any) => obj.Name === "PhoneNumber");

  const amount = amountObj.Value;
  const mpesaCode = codeObj.Value;
  const phoneNumber = phoneNumberObj.Value.toString();

  try {
    // Process the transaction (e.g., save to DB)
    console.log({ amount, mpesaCode, phoneNumber });

    return NextResponse.json("Callback received", { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
