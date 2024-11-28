"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { markReferralAsPaid } from "@/lib/actions/referral.actions";
import { useRouter } from "next/navigation";

export function ReferralsCard({ referrals }: { referrals: any}) {
  const router = useRouter();

  const handlePayment = async (userId: string) => {
    try {
      const result = await markReferralAsPaid(userId);
      if (result.success) {
        toast.success("Payment marked as completed");
        // Refresh the page to show updated data
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to process payment");
    }
  };

  const columns = [
    {
      accessorKey: "userName",
      header: "User",
    },
    {
      accessorKey: "mpesaNumber",
      header: "M-Pesa Number",
    },
    {
      accessorKey: "totalReferrals",
      header: "Total Referrals",
    },
    {
      accessorKey: "pendingPayment",
      header: "Amount Due",
      cell: ({ row }: { row:any}) => `KES ${row.original.pendingPayment}`,
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <Button
          size="sm"
          variant={row.original.pendingPayment > 0 ? "default" : "outline"}
          onClick={() => handlePayment(row.original.userId)}
          disabled={row.original.pendingPayment <= 0}
        >
          {row.original.pendingPayment > 0 ? "Mark as Paid" : "Paid"}
        </Button>
      ),
    },
  ];

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Referral Payments</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={referrals} />
      </CardContent>
    </Card>
  );
}
