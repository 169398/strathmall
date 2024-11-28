import { auth } from "@/auth";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  getAllSellerOrders, } from "@/lib/actions/sellerorder.actions";
import { APP_NAME } from "@/lib/constants";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Seller Orders - ${APP_NAME}`,
};

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { page = "1" } = await searchParams;
  
  const session = await auth();
  if (session?.user.role !== "seller")
    throw new Error("seller permission required");
  
  const sellerId = session.user.id || "";
  const orders = await getAllSellerOrders({
    page: Number(page),
    sellerId,
  });

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Orders</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>BUYER</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{formatId(order.orderId)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>
                  {order.userName ? order.userName : "Deleted user"}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.paidAt && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "not paid"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : "not delivered"}
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm" aria-label="details">
                    <Link href={`/order/${order.orderId}`}>Details</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders?.totalPages!} />
        )}
      </div>
    </div>
  );
}
