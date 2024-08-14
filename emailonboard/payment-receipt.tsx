import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { formatCurrency } from "@/lib/utils";
import { feeOrder } from "@/types";
import { seller } from "@/types/sellerindex";

type OnboardingReceiptEmailProps = {
  order:feeOrder;
  seller:seller;
};

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default function OnboardingReceiptEmail({
  order,
 seller,

  
}: OnboardingReceiptEmailProps) {
  return (
    <Html>
      <Preview>
        🎉 Welcome to StrathMall! Your onboarding payment is complete 🧾
      </Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl p-4 md:p-6 bg-blue-50 rounded-lg shadow-md">
            <Heading className="text-blue-600 text-3xl font-bold mb-4">
              Onboarding Payment Receipt 🧾
            </Heading>
            <Text className="text-lg font-semibold text-gray-900">
              Hello 
            </Text>
            <Text className="mb-6 text-gray-700">
              Thank you for setting up your shop, <strong>{seller.shopName}</strong>,
              on StrathMall. We&apos;re excited to have you on board
            </Text>

            <Section className="border border-solid border-blue-200 rounded-lg p-4 my-4 bg-white shadow-sm">
              <Row>
                <Column>
                  <Text className="mb-0 text-gray-700 text-sm">
                    Payment Date
                  </Text>
                  <Text className="text-lg font-medium">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-700 text-sm">
                    Amount Paid
                  </Text>
                  <Text className="text-lg font-medium">
                    {formatCurrency(order.totalAmount)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-700 text-sm">
                    Payment Method
                  </Text>
                  <Text className="text-lg font-medium">{order.paymentMethod}</Text>
                </Column>
              </Row>
            </Section>

            <Section className="mt-6">
              <Text className="text-center text-blue-700 font-semibold">
                We&apos;re thrilled to have you as part of our sellers community!
                🎉
              </Text>
              <Text className="text-center text-gray-700 mt-2">
                You can now manage your shop and start listing products on
                StrathMall.
              </Text>
            </Section>

            <Section className="mt-6 border-t border-blue-200 pt-4">
              <Text className="text-center text-sm text-gray-500">
                StrathMall, Nairobi, Kenya. | Contact Us: support@strathmall.com ,0714594345
              </Text>
              <Text className="text-center text-xs text-gray-400 mt-2">
                You are receiving this email because you completed the
                onboarding process at StrathMall. If you have any questions,
                please contact our support.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
