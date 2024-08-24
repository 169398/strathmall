import { NextResponse } from "next/server";


interface Token {
  access_token: string;
  expires_in: string;
}

export async function generateAccessToken() {
    const consumer_key = process.env.SAFARICOM_CONSUMER_KEY;
    const consumer_secret = process.env.SAFARICOM_CONSUMER_SECRET;

    const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');
    
    const mpesaBaseUrl = 'https://api.safaricom.co.ke';
    
    const response = await fetch(
      `${mpesaBaseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    try {
        const data: Token = await response.json();

        return NextResponse.json({ accessToken: data.access_token})

    } catch (err) {
      return NextResponse.json({ error: "Token inaccessible..." + err ,status:400})
    }
  }