import { toast } from "@/components/ui/use-toast";

const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export const paypal = {
  createOrder: async function createOrder(totalAmount: number) {
    // Conversion rate from KES to USD, ensure it's up-to-date
    const conversionRate = 0.0074103;
    const convertedPrice = (totalAmount * conversionRate).toFixed(2);

    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders`;
      console.log("Creating PayPal order...");
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

      console.log("PayPal order created successfully.");
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
      console.log("Capturing PayPal payment...");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("PayPal payment captured successfully.");
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

    console.log("PayPal access token generated successfully.");
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
  console.log("PayPal API error:", errorMessage);
  toast({
    description:
      "Payment was not successful. Please check your details and account balance and try again.",
    variant: "destructive",
  });
  throw new Error(`PayPal API error: ${errorMessage}`);
}
