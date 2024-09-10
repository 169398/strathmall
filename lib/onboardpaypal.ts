
const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";
export const paypal = {
  createOrder: async function createOrder() {
    // Conversion rate from KES to USD, ensure it's up-to-date
    const totalAmount = 1000;
    const conversionRate = 0.0074477; 
    const convertedPrice = (totalAmount * conversionRate).toFixed(2);
console.log(`Converted Price: ${convertedPrice}`);

    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: convertedPrice,
              },
            },
          ],
        }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  },

  capturePayment: async function capturePayment(orderId: string) {
    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders/${orderId}/capture`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      throw error;
    }
  },
};

async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

  if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
    throw new Error("PayPal client credentials are missing.");
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    "base64"
  );

  try {
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const jsonData = await handleResponse(response);
    return jsonData.access_token;
  } catch (error) {
    console.error("Error generating PayPal access token:", error);
    throw error;
  }
}

async function handleResponse(response: Response) {
  if (response.ok) {
    return response.json();
  }

  const errorMessage = await response.text();
  
  throw new Error(`PayPal API error: ${errorMessage}`);
}
