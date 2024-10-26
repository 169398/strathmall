
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

type SellerNotificationProps = {
  order: BakeryOrder;
};

export default function SellerCakeNotification({
  order,
}: SellerNotificationProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl p-4 bg-white rounded-lg shadow-md">
            <Heading className="text-blue-600 text-2xl font-bold mb-4">
              New Cake Order Notification 🎂
            </Heading>
            <Section className="border border-gray-300 p-4 my-4 bg-blue-50 rounded-lg">
              <Text className="text-lg font-semibold text-gray-700">
                Order Details:
              </Text>
              <Text>Order ID: {order.id}</Text>
              <Text>Buyer: {order.user.name}</Text>
              <Text>Contact: {order.phoneNumber}</Text>
              <Text>Cake Size: {order.cakeSize}</Text>
              <Text>Quantity: {order.quantity}</Text>
              <Text>Customizations: {order.customizations}</Text>
              <Text className="mt-4 text-gray-600 font-medium">
                Please process this order promptly and contact the seller for the delivery 
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
