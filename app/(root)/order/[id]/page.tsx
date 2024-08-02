import Stripe from 'stripe'
import { getSellerOrderById } from '@/lib/actions/sellerorder.actions'
import { APP_NAME } from '@/lib/constants'
import { notFound } from 'next/navigation'
import OrderDetailsForm from './order-details-form'
import { auth } from '@/auth'

export const metadata = {
  title: `Order Details - ${APP_NAME}`,
}

const OrderDetailsPage = async ({
  params: { id ,sellerId},
}: {
  params: {
    id: string
    sellerId:string
  }
}) => {
  const session = await auth()
  const order = await getSellerOrderById(id,sellerId)
  if (!order) notFound()

  let client_secret = null
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'KES',
      metadata: { orderId: order.id },
    })
    client_secret = paymentIntent.client_secret
  }

  return (
      <OrderDetailsForm
      order={{ ...order, sellerOrderItems: [] }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={session?.user.role === 'admin' || false}
      stripeClientSecret={client_secret} sellerId={sellerId}      />
    )
}

export default OrderDetailsPage
