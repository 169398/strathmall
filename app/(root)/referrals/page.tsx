import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReferralDashboard } from "./referral-dashboard";
import { getReferralStats } from "@/lib/actions/referral.actions";
import { Suspense } from "react";

export default async function ReferralsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div className="flex flex-col gap-4 w-full animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>}>
        <ReferralStats userId={session.user.id as string} />
      </Suspense>
    </div>
  );
}

async function ReferralStats({ userId }: { userId: string }) {
  const stats = await getReferralStats(userId);
  return <ReferralDashboard stats={stats} userId={userId} />;
} 