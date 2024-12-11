"use client";

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { order } from "@/types/sellerindex";
import Image from "next/image";
import Link from "next/link";
import {
  approvePayPalOrder,
  createPayPalOrder,
  deliverOrder,
  updateOrderToPaidByCOD,
} from "@/lib/actions/sellerorder.actions";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import StripePayment from "./stripe-payment";

export default function OrderDetailsForm({
  order,
  paypalClientId,
  isAdmin,
  isDelivery,
  stripeClientSecret,
}: {
  order: order;
  paypalClientId: string;
  isAdmin: boolean;
  isDelivery: boolean;
  stripeClientSecret: string | null;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    if (isPending) return "Loading PayPal...";
    if (isRejected) return "Error in loading PayPal.";
    return null;
  }

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);
    if (!res?.success) {
      toast({ description: res?.message, variant: "destructive" });
      return null;
    }
    return res?.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);
    toast({
      description: res?.message,
      variant: res?.success ? "default" : "destructive",
    });
  };

  const MarkAsPaidButton = () => (
    <Button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await updateOrderToPaidByCOD(order.id);
          toast({
            variant: res?.success ? "default" : "destructive",
            description:"An error occured, please try again",
          });
        })
      }
      aria-label="mark as paid"
    >
      {isPending ? "Processing..." : "Mark As Paid"}
    </Button>
  );

  const MarkAsDeliveredButton = () => (
    <Button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await deliverOrder(order.id);
          toast({
            variant: res?.success ? "default" : "destructive",
            description: "An error occured, please try again",
          });
        })
      }
      aria-label="mark as delivered"
    >
      {isPending ? "Processing..." : "Mark As Delivered"}
    </Button>
  );

  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.fullName}, {shippingAddress.town},{" "}
                {shippingAddress.phoneNumber}
              </p>
             

              {isDelivered ? (
                <Badge variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 space-y-4 gap-4">
              <h2 className="text-xl pb-4">Order Summary</h2>
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {!isPaid && paymentMethod === "PayPal" && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              )}
              {!isPaid && paymentMethod === "CashOnDelivery" && isAdmin && (
                <MarkAsPaidButton />
              )}
              {isPaid && !isDelivered && (isAdmin || isDelivery) && (
                <MarkAsDeliveredButton />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
