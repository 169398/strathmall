"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { createSellerSchema } from "@/lib/validator";
import { z } from "zod";
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
import { createSeller } from "@/lib/actions/selleractions";
import router from "next/router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";


const  OnboardingForm = () => {
  const form = useForm<z.infer<typeof createSellerSchema>>({
    resolver: zodResolver(createSellerSchema),
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof createSellerSchema>) {
    const formData = new FormData();
    formData.append("shopName", values.shopName);
    formData.append("email", values.email);
    formData.append("phoneNumber", values.phoneNumber);

    console.log("Form values:", values); // Debug log
    console.log("FormData values:", {
      shopName: formData.get("shopName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
    }); // Debug log

    const res = await createSeller({}, formData);
    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    } else {
      toast({
        description: res.message,
      });

      router.push('/seller/products')
    }
  }

  return (
    <div className="relative min-h-screen flex">
      <div className="absolute inset-0">
        <Image
          src="/background.jpg" // Your background image
          alt="Background"
          width={1000}
            height={1000}

          className="w-full h-full  "
          
        />
      </div>
      <div className="relative  w-1/2 p-10 bg-white bg-opacity-90">
        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="shopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your shop name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
              <Button
                type="submit"
                size="default"
                disabled={form.formState.isSubmitting}
                className="w-full"
                variant={'default'}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
const WhyStrathmall = () => (
  <div className="py-10 bg-gray-50">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-8">Why Strathmall?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feature 1</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Description of feature 1</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feature 2</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Description of feature 2</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feature 3</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Description of feature 3</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feature 4</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Description of feature 4</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const HowItWorks = () => (
  <div className="py-10 bg-white">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-8">
        How Strathmall Works for Sellers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Description of step 1</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Step 2</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Description of step 2</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Step 3</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Description of step 3</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Step 4</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Description of step 4</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const Testimonial = () => (
  <div className="py-10 bg-black text-white">
    <div className="container mx-auto flex flex-col md:flex-row items-center">
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4">What Our Sellers Say</h2>
        <p className="mb-8">
          &quot; Strathmall has transformed the way I do business. The platform
          is user-friendly and has all the features I need to manage my shop
          efficiently.&quot;
        </p>
      </div>
      <div className="md:w-1/2">
        <Image
          src="/background.jpg" // Testimonial image
          alt="Testimonial"
          width={500}
          height={300}
          className="rounded-lg"
        />
      </div>
    </div>
  </div>
);

const GetStarted = () => (
  <div className="py-10 bg-gray-50">
    <div className="container mx-auto flex flex-col md:flex-row items-center">
      <div className="md:w-1/2">
        <Image
          src="/get-started.jpg" // Get started image
          alt="Get Started"
          width={500}
          height={300}
          className="rounded-lg"
        />
      </div>
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-4">Get started in 3 steps</h2>
        <ul className="list-disc list-inside">
          <li>Tell us about your shop</li>
          <li>Upload your goods</li>
          <li>Access your dashboard to manage products</li>
        </ul>
      </div>
    </div>
  </div>
);

const FAQ = () => (
  <div className="py-10 bg-white">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-8">
        Questions? We&apos;ve got answers
      </h2>
      {/* Replace this with your modern cool FAQ component */}
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-bold">Question 1</h3>
          <p>Answer to question 1</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-bold">Question 2</h3>
          <p>Answer to question 2</p>
        </div>
      </div>
    </div>
  </div>
);

const OnboardingPage = () => {
  return (
    <div className="min-h-screen">
      <OnboardingForm />
      <WhyStrathmall />
      <HowItWorks />
      <Testimonial />
      <GetStarted />
      <FAQ />
    </div>
  );
};

export default OnboardingPage;

