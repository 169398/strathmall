import sampleData from "@/lib/sample-data";
import { formatCurrency } from "@/lib/utils";
import { order } from "@/types/sellerindex";
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
} from "@react-email/components";

type OrderInformationProps = {
  order: order;
};

PurchaseReceiptEmail.PreviewProps = {
  order: {
    sellerId: "",
    id: crypto.randomUUID(),
    userId: "123",
    user: {
      name: "John Doe",
      email: "email@example.com",
    },
    paymentMethod: "Stripe",
    shippingAddress: {
      fullName: "John Doe",
      streetAddress: "123 Main St",
      city: "Nairobi",
      postalCode: "10001",
      country: "Kenya",
      phoneNumber: "0712345678",
    },
    createdAt: new Date(),
    totalPrice: "110",
    shippingPrice: "20",
    itemsPrice: "80",
    orderItems: sampleData.products.map((x) => ({
      id: "123",
      name: x.name,
      image: x.images[0],
      sellerId: "123",
      orderId: "123",
      productId: "123",
      slug: x.slug,
      price: x.price,
      qty: x.stock,
    })),
    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id: "123",
      status: "succeeded",
      pricePaid: "12",
      email_address: "email@example.com",
    },
  },
} satisfies OrderInformationProps;

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  return (
    <Html>
      <Preview>📦 View your StrathMall order receipt 🧾✨ </Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl p-4 md:p-6 bg-blue-50 rounded-lg shadow-md">
            <Heading className="text-blue-600 text-3xl font-bold mb-4">
               Purchase Receipt 🧾
            </Heading>
            <Section>
              <Row>
               
                <Column>
                  <Text className="mb-0 text-gray-700 text-sm">
                    Purchased On
                  </Text>
                  <Text className="text-lg font-medium">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-700 text-sm">Price Paid</Text>
                  <Text className="text-lg font-medium">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-blue-200 rounded-lg p-4 my-4 bg-white shadow-sm">
              {order.orderItems.map((item) => (
                <Row key={item.productId} className="mt-6">
                  <Column className="w-20">
                    <Img
                      width="80"
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-top">
                    <Text className="mx-2 my-0 text-blue-700">
                      {item.name} x {item.qty}
                    </Text>
                  </Column>
                  <Column align="right" className="align-top">
                    <Text className="m-0 text-gray-900 font-semibold">
                      {formatCurrency(item.price)}
                    </Text>
                  </Column>
                </Row>
              ))}
              {[
                { name: "Items", price: order.itemsPrice },
                { name: "Shipping", price: order.shippingPrice },
                { name: "Total", price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1 mt-2">
                  <Column align="left" className="text-blue-600 font-medium">
                    {name}:
                  </Column>
                  <Column align="right" className="align-top">
                    <Text className="m-0 text-gray-900">
                      {formatCurrency(price)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
            <Section className="mt-6">
              <Text className="text-center text-blue-700 font-semibold">
                Thank you for shopping at StrathMall 🤗
              </Text>
            </Section>
            <Section className="mt-6 border-t border-blue-200 pt-4">
              <Text className="text-center text-sm text-gray-500">
                StrathMall, Nairobi, Kenya. | Contact Us: support@strathmall.com
              </Text>
              <Text className="text-center text-xs text-gray-400 mt-2">
                You are receiving this email because you made a purchase at
                StrathMall. If you have any questions, please contact our
                support.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
