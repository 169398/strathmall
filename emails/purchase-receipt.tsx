import sampleData from '@/lib/sample-data'
import { formatCurrency } from '@/lib/utils'
import { order } from '@/types/sellerindex'
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

type OrderInformationProps = {
  order: order
}

PurchaseReceiptEmail.PreviewProps = {
  order: {
    sellerId:'',
    id: crypto.randomUUID(),
    userId: '123',
    user: {
      name: 'John Doe',
      email: 'email@example.com',
    },
    paymentMethod: 'Stripe',
    shippingAddress: {
      fullName: 'John Doe',
      streetAddress: '123 Main St',
      city: 'Nairobi',
      postalCode: '10001',
      country: 'Kenya',
    },
    createdAt: new Date(),
    totalPrice: '110',
    shippingPrice: '20',
    itemsPrice: '80',
    orderItems: sampleData.products.map((x) => ({
      id: '123',
      name: x.name,
      image: x.images[0],
      sellerId: '123',
      orderId: '123',
      productId: '123',
      slug: x.slug,
      price: x.price,
      qty: x.stock,
    })),
    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id: '123',
      status: 'succeeded',
      pricePaid: '12',
      email_address: 'email@example.com',
    },
  },
} satisfies OrderInformationProps

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Order ID
                  </Text>
                  <Text className="mt-0 mr-4">{order.id.toString()}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Purchased On
                  </Text>
                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Price Paid
                  </Text>
                  <Text className="mt-0 mr-4">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
              {order.orderItems.map((item) => (
                <Row key={item.productId} className="mt-8">
                  <Column className="w-20">
                    <Img
                      width="80"
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith('/')
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-top">
                    <Text className="mx-2 my-0">
                      {item.name} x {item.qty}
                    </Text>
                  </Column>
                  <Column align="right" className="align-top">
                    <Text className="m-0 ">{formatCurrency(item.price)}</Text>
                  </Column>
                </Row>
              ))}
              {[
                { name: 'Items', price: order.itemsPrice },
                { name: 'Shipping', price: order.shippingPrice },
                { name: 'Total', price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}:</Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">{formatCurrency(price)}</Text>
                  </Column>
                  
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
