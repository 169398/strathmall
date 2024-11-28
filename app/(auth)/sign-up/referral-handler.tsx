"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { processReferral } from "@/lib/actions/referral.actions";
import { useToast } from "@/components/ui/use-toast";

export function ReferralHandler({ userId }: { userId?: string }) {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");
    const toast = useToast();
  useEffect(() => {
    async function handleReferral() {
      if (referralCode && userId) {
        const result = await processReferral(referralCode, userId);
        if (!result.success) {
          toast.toast({
            title: "Error",
            description: result.message
          });
        } else {
          toast.toast({
            title: "Success",
            description: "Referral code applied successfully!"
          });
        }
      }
    }

    handleReferral();
  }, [referralCode, toast, userId]);

  return null;
}
