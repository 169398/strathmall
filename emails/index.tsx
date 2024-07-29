import { Resend } from 'resend'
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants'
import PurchaseReceiptEmail from './purchase-receipt'
import { sellerOrder } from '@/types/sellerindex'

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ sellerOrder }: { sellerOrder: sellerOrder }) => {
  const res = await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: sellerOrder.user.email,
    subject: 'Order Confirmation',
    react: <PurchaseReceiptEmail sellerOrder={sellerOrder} />,
  })
  console.log(res)
}
