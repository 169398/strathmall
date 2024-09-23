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

type SellerNotificationProps = {
  order: order;
};

export default function SellerNotifyEmail({ order }: SellerNotificationProps) {
  return (
    <Html>
      <Preview>📦 New Order Alert - Deliver to Mithoo House</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl p-4 md:p-6 bg-blue-50 rounded-lg shadow-md">
            <Heading className="text-blue-600 text-3xl font-bold mb-4">
              New Order Alert 🚚
            </Heading>
            <Section>
              <Text className="text-gray-700 text-lg mb-4">
                Hi, you have a new order! Please deliver the following
                product(s) to the courier service at:
              </Text>
              <Text className="font-semibold text-gray-900">
                Mithoo House (Opposite Popman House), near Khoja stage. 1st
                floor, room M22.
              </Text>
              <Text className="text-gray-700 mt-2">
                Courier Contact: <span className="font-bold">0727465753</span>
              </Text>
              <Text className="text-gray-700 mt-2">
                You must Deliver within <span className="font-bold">12 hours</span> to ensure prompt
                shipping.
              </Text>
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
                      ksh {item.price}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
            <Section className="mt-6">
              <Text className="text-center text-blue-700 font-semibold">
                Please ensure timely delivery. Thank you for partnering with
                StrathMall!
              </Text>
            </Section>
            <Section className="mt-6 border-t border-blue-200 pt-4">
              <Text className="text-center text-sm text-gray-500">
                StrathMall, Nairobi, Kenya. | Contact Us: support@strathmall.com
              </Text>
              <Text className="text-center text-xs text-gray-400 mt-2">
                You are receiving this email because your product has been
                ordered on StrathMall.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
