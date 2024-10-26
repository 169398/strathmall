import { BakeryOrder } from "@/types/sellerindex";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type BuyerReceiptProps = {
  order: BakeryOrder;
};

export default function PurchaseReceiptEmail({ order }: BuyerReceiptProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl p-4 bg-white rounded-lg shadow-md">
            <Heading className="text-green-600 text-2xl font-bold mb-4">
              Order Confirmation 🧾
            </Heading>
            <Section className="border border-gray-300 p-4 my-4 bg-green-50 rounded-lg">
              <Text className="text-lg font-semibold text-gray-700">
                Order Details:
              </Text>
              <Text>Order ID: {order.id}</Text>
              <Text>Shipping Address: {order.location}</Text>
              <Text>Phone Number: {order.phoneNumber}</Text>
              <Text>Cake Size: {order.cakeSize}</Text>
              <Text>Cake Type: {order.cakeType}</Text>
              <Text>Quantity: {order.quantity}</Text>
              {order.customizations && (
                <Text>Customizations: {order.customizations}</Text>
              )}
              <Text className="mt-4 text-gray-600 font-medium">
                Thank you for placing your order! The seller will contact you
                soon to arrange delivery.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
