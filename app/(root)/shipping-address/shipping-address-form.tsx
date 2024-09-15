'use client';

import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema } from "@/lib/validator";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { updateUserAddress } from "@/lib/actions/user.actions";
import CheckoutSteps from "@/components/shared/checkout-steps";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { towns } from "@/lib/address";

export default function ShippingAddressForm({
  address,
}: {
  address: ShippingAddress | null;
}) {
  const router = useRouter();

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<ShippingAddress> = async (values) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      router.push("/payment-method");
    });
  };

  return (
    <>
      <CheckoutSteps current={1} />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your details and select your town.
        </p>
        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="town"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <select {...field} className="form-select">
                        <option value="">Select your town</option>
                        {towns.map((town) => (
                          <option key={town.name} value={town.name}>
                            {town.name} - {town.shippingPrice} ksh
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending} aria-label="continue">
                {isPending ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
