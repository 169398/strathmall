import { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import Stripe from 'stripe'

import { Button } from '@/components/ui/button'
import { getOrderById } from '@/lib/actions/sellerorder.actions'
import { APP_NAME } from '@/lib/constants'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const metadata: Metadata = {
  title: `Stripe Payment Success - ${APP_NAME}`,
}

interface SuccessPageProps {
  params: Promise<{
    id: string;
    sellerId: string;
  }>;
  searchParams: Promise<{
    payment_intent: string;
  }>;
}

export default async function SuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const { id } = await params;
  const { payment_intent } = await searchParams;
  
  const order = await getOrderById(id);
  if (!order) notFound();

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);
  
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  )
    return notFound();

  const isSuccess = paymentIntent.status === 'succeeded';
  if (!isSuccess) return redirect(`/order/${id}`);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center ">
        <h1 className="h1-bold">Thanks for your purchase</h1>
        <div>We are now processing your order.</div>
        <Button asChild aria-label='view order'>
          <Link href={`/order/${id}`}>View order</Link>
        </Button>
      </div>
    </div>
  )
}
