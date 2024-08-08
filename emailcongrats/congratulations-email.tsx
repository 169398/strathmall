import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { seller } from "@/types/sellerindex";

type CongratulationsEmailProps = {
  seller: seller;
};

export default function CongratulationsEmail({
  seller,
}: CongratulationsEmailProps) {
  return (
    <Html>
      <Preview>🎉 Congratulations on setting up your shop!</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl mx-auto p-4">
            <Heading className="text-2xl font-bold text-blue-700">
              Congratulations 
            </Heading>
            <Section className="my-4">
              <Text className="text-lg">
                Your shop <strong>{seller.shopName}</strong> has been
                successfully set up on StrathMall. 🎉
              </Text>
              <Text className="mt-4">
                We&apos;re excited to have you on board 🥳 Please wait while we
                review your details. Once approved, you&apos;ll be able to
                manage your shop through the &quot;My Shop&quot; option in your
                account menu.
              </Text>
              <Text className="mt-4">
                If you have any questions in the meantime, feel free to reach
                out to our support team.
              </Text>
            </Section>
            <Section className="mt-6 text-center">
              <Text className="text-sm text-gray-500">
                Thank you for choosing StrathMall. We&apos;re looking forward to
                seeing your shop thrive and grow 🤗
              </Text>
              <Text className="text-sm text-gray-500 mt-2">Best regards,</Text>
              <Text className="text-sm text-gray-500">The StrathMall Team</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
