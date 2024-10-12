import { toast } from "@/components/ui/use-toast";
import { Metadata } from "next"
import { ensureStartsWith } from "./utils";




const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'



export const paypal = {


  createOrder: async function createOrder(price: number) {
     const conversionRate = 0.0074419; 
    const convertedPrice = (price * conversionRate).toFixed(2);

    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: "post",
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
  },
  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken()
    const url = `${base}/v2/checkout/orders/${orderId}/capture`
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return handleResponse(response)
  },
}

async function generateAccessToken() {

  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString(
    'base64'
  )
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'post',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })

  const jsonData = await handleResponse(response)
  return jsonData.access_token
}

async function handleResponse(response: any) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  toast({
    description:
      "Payment was not successful. Please check your details and account balance and try again",
    variant: "destructive",
  });
  throw new Error(errorMessage);
}

const { TWITTER_CREATOR, TWITTER_SITE } = process.env;
const twitterCreator = TWITTER_CREATOR
  ? ensureStartsWith(TWITTER_CREATOR, "@")
  : undefined;
const twitterSite = TWITTER_SITE
  ? ensureStartsWith(TWITTER_SITE, "https://")
  : undefined;
export function constructMetadata({
  title = "StrathMall - Affordable prices on Top local goods",
  description = "Discover StrathMall, the ultimate  marketplace for premium goods, connecting Top local  sellers with savvy shoppers",
  image = "https://res.cloudinary.com/db0i0umxn/image/upload/v1728757718/thumbnail_fnswvj.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    ...(twitterCreator &&
      twitterSite && {
        twitter: {
          card: "summary_large_image",
          creator: twitterCreator,
          site: twitterSite,
        },
      }),
    icons,
    metadataBase: new URL("https://strathmall.com/"),
    ...(noIndex && {
      robots: {
        index: true,
        follow: true,
      },
    }),
  };
}
