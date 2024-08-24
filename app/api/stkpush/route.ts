import { NextRequest, NextResponse } from 'next/server';
import { generateAccessToken } from '@/lib/generateAccessToken';

export async function POST(req:NextRequest) {
    
  try {
    const { total, phoneNumber } = await req.json();

    const shortcode = process.env.MPESA_PAYBILL!;
    const passkey = process.env.MPESA_PASSKEY!;

    const date = new Date();

    const timestamp =
      date.getFullYear() + 
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password = Buffer.from(shortcode + passkey + timestamp).toString(
        "base64"
      );

    const mpesaBaseUrl = 'https://api.safaricom.co.ke';

    const accessToken = await generateAccessToken();

    const response = await fetch(
      `${mpesaBaseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerBuyGoodsOnline",
          Amount: total,
          PartyA: phoneNumber,
          PartyB: shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: "https://thriftgardening.com/api/callback",
          AccountReference: "Thrift Gardening",
          TransactionDesc: "Payment of X",
        }),
      },
    );

    // Directly use await to get the JSON response
    const data = await response.json();

    console.log(data)

    const {phone, amount, transactionID} = data;

    // Send the JSON response back to the client
    return NextResponse.json({phone, amount, transactionID})

  } catch (err) {
    return NextResponse.json(
      { error: "JSON response inaccessible...", err},
    { status:400})
  }
}