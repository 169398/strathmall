/* eslint-disable no-unused-vars */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Extract the callback data from the request body
    const callbackData = await req.json();

    // Process the callback data as needed
    console.log('Received M-Pesa callback:', callbackData);

    // Extract data from the callback payload. //when the transaction is not successful, we are not receiving the callback metadata
    
    const phone = callbackData?.Body.stkCallback.CallbackMetadata.Item[4].Value;
    const amount = callbackData?.Body.stkCallback.CallbackMetadata.Item[0].Value;
    const transactionID = callbackData?.Body.stkCallback.CallbackMetadata.Item[1].Value;

    //TODO ADD TO DATABASE
    
    // Respond to M-Pesa with a success response
    return NextResponse.json({ status: 'OK' });
    // NextResponse.json({ msg: "Successfuly created new User: " + newUser ,status:200})

  } catch (error) {
    // Handle errors
    console.error('Error handling M-Pesa callback:', error);
  }
}