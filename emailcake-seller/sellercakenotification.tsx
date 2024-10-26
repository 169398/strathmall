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
  Link,
  Img,
} from "@react-email/components";
import {
  CakeIcon,
  PhoneIcon,
  UserIcon,
  HashIcon,
  LayersIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";

type SellerNotificationProps = {
  order: BakeryOrder;
};

export default function Component(
  { order }: SellerNotificationProps = {
    order: {
      id: "ORD123456",
      user: { name: "John Doe", email: "john.doe@example.com" },
      phoneNumber: "+1 (555) 123-4567",
      cakeName: "Choco Delight",
      cakeSize: "9-inch",
      quantity: 1,
      customizations: "Happy Birthday message on top",
      createdAt: new Date(),
      userId: "user123",
      sellerId: "seller123",
      location: "123 Main St, Anytown, AN 12345",
      cakeType: "Chocolate",
      cakeImage: "chocolate-cake.jpg",
      deliveryTime: "10:00 AM",
      deliveryDate: "2024-05-15",
    },
  }
) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-gray-100">
          <Container className="max-w-2xl mx-auto my-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <Section className="bg-blue-500 p-6 text-white">
              <div className="flex justify-between items-center">
                
                <Text className="text-sm font-medium">Order {order.id.slice(0, 14)}</Text>
              </div>
              <Heading className="text-3xl font-bold mt-4">
                New Cake Order Notification 🎂
              </Heading>
            </Section>

            <Section className="p-6">
              <div className="mb-6">
                <Text className="text-xl font-semibold text-blue-800 mb-3">
                  Hello Seller,
                </Text>
                <Text className="text-gray-600">
                  You have received a new cake order. Please review the details
                  below and prepare for timely delivery.
                </Text>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg shadow-inner mb-6">
                <Text className="text-lg font-semibold text-blue-800 mb-4">
                  Order Details:
                </Text>
                <Img
                  src={
                    order.cakeImage.startsWith("/")
                      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${order.cakeImage}`
                      : order.cakeImage
                  }
                  alt={order.cakeName}
                  width={400}
                  className="mx-auto mb-6 rounded-md shadow-sm transform transition-transform hover:scale-105"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <HashIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <Text className="text-gray-700">
                      <span className="font-medium">Order ID:</span> {order.id}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <Text className="text-gray-700">
                      <span className="font-medium">Buyer:</span>{" "}
                      {order.user.name}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <CakeIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <Text className="text-gray-700">
                      <span className="font-medium">Cake:</span>{" "}
                      {order.cakeName}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <CakeIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <Text className="text-gray-700">
                      <span className="font-medium">Size:</span>{" "}
                      {order.cakeSize}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <LayersIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <Text className="text-gray-700">
                      <span className="font-medium">Quantity:</span>{" "}
                      {order.quantity}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <Text className="text-gray-700">
                      <span className="font-medium">Order Date:</span>{" "}
                      {order.createdAt.toLocaleDateString()}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <Text className="text-gray-700">
                      <span className="font-medium">Delivery Date:</span>{" "}
                      {order.deliveryDate}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <Text className="text-gray-700">
                      <span className="font-medium">Delivery Time:</span>{" "}
                      {order.deliveryTime}
                    </Text>
                  </div>
                </div>
                {order.customizations && (
                  <div className="mt-4">
                    <Text className="text-gray-700">
                      <span className="font-medium">Customizations:</span>{" "}
                      {order.customizations}
                    </Text>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <Text className="text-lg font-semibold text-blue-800 mb-4">
                  Delivery Information:
                </Text>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <Text className="text-gray-700">
                      <span className="font-medium">Address:</span>{" "}
                      {order.location}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <Text className="text-gray-700">
                      <span className="font-medium">Phone:</span>{" "}
                      {order.phoneNumber}
                    </Text>
                  </div>
                </div>
              </div>
            </Section>

            <Section className="bg-blue-50 p-6 text-center">
              <Text className="text-gray-600 font-medium">
                Please call the buyer and ensure timely preparation and delivery of this order. If
                you have any questions, contact StrathMall support.
              </Text>
            </Section>

            <footer className="bg-blue-500 text-blue-100 py-8 px-6">
              <Container className="max-w-2xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                   
                    <Text className="text-sm">
                      © 2024 StrathMall. All rights reserved.
                    </Text>
                  </div>
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                    <Link
                      href="https://www.strathmall.com/privacy"
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="https://www.strathmall.com/terms"
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                    <Link
                      href="tel:0714594345"
                      className="text-blue-200 hover:text-white transition-colors"
                    >
                      Support: 0714594345
                    </Link>
                  </div>
                </div>
              </Container>
            </footer>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
