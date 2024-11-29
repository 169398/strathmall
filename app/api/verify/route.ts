import { NextResponse } from "next/server";
import { completeReferral } from "@/lib/actions/referral.actions";
import { formatError } from "@/lib/utils";
import verifyEmail from "@/emailverify/verify-email";

interface VerifyResult {
  success: boolean;
  userId?: string;
}

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const result = (await verifyEmail(token) as unknown) as VerifyResult;

    if (result.success && result.userId) {
      await completeReferral(result.userId);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: formatError(error) });
  }
}
