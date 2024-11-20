import { AlertTriangle, CreditCard, Lock, Truck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert-dialog";

export default function Component() {
  return (
    <div className="w-full rounded-sm border border-green-500">
      <div className="bg-[#008744] text-white p-4">
        <div className="container mx-auto rounded-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span className="font-medium">Strathmall&apos;s Commitments</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <span>Secure privacy</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span>Safe payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <span>Delivery guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Alert variant="warning" className="rounded-none border-x-0 border-t-0">
        <AlertTriangle className="h-4 w-4 text-green-600" />
        <AlertDescription className="flex items-center text-green-600 justify-between">
          Be wary of messages about delivery issues claiming to be from Strathmall.
          <span className="text-primary text-green-600 hover:underline cursor-pointer">
            View
          </span>
        </AlertDescription>
      </Alert>
    </div>
  );
}
