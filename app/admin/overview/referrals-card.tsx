"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Users, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markReferralAsPaid } from "@/lib/actions/referral.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

export function ReferralsCard({ referrals }: { referrals: any}) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePayment = async (userId: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Invalid user ID",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingId(userId);
      const result = await markReferralAsPaid(userId);
      
      
      if (result?.success) {
        setShowSuccess(userId);
        toast({
          title: "Success!",
          description: result.message || "Payment has been processed successfully",
        });
        
        setTimeout(() => {
          setShowSuccess(null);
          router.refresh();
        }, 2000);
      } else {
        toast({
          title: "Payment Failed",
          description: result?.message || "Failed to process payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
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
      cell: ({ row }: { row:any}) => (
        <span className="font-semibold text-blue-600">
          KES {row.original.pendingPayment}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <AnimatePresence mode="wait">
          {showSuccess === row.original.userId ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex items-center text-blue-600"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Paid
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                size="sm"
                variant={row.original.pendingPayment > 0 ? "default" : "outline"}
                onClick={() => handlePayment(row.original.userId)}
                disabled={
                  row.original.pendingPayment <= 0 || 
                  processingId === row.original.userId
                }
                className={
                  row.original.pendingPayment > 0 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : ""
                }
              >
                {processingId === row.original.userId ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : row.original.pendingPayment > 0 ? (
                  "Mark as Paid"
                ) : (
                  "Paid"
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
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
