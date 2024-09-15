"use client";

import { useForm } from "react-hook-form";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from "@mui/material";
import { UserCard } from "@/components/shared/card";
import { UserCard2 } from "@/components/shared/WhyStrathCard";
import { createSeller } from "@/lib/actions/selleractions";
import { CardSpot } from "@/components/shared/how-to-start";



const OnboardingForm = () => {
  // eslint-disable-next-line no-unused-vars

  const form = useForm<z.infer<typeof createSellerSchema>>({
    resolver: zodResolver(createSellerSchema),
  });
  const { toast } = useToast();
 const router = useRouter();

  async function onSubmit(values: z.infer<typeof createSellerSchema>) {
    const formData = new FormData();

    formData.append("shopName", values.shopName);
    formData.append("email", values.email);
    formData.append("phoneNumber", values.phoneNumber);
    try {
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
        router.push("/onboard");
      }
    } catch (error) {
      console.error("Error creating seller:", error);
      toast({
        variant: "destructive",
        description: "An error occurred while creating the seller.",
      });
    }
  }
    return (
      <div className="relative min-h-screen ">
        {/* <div className="absolute inset-0">
        <Image
          src="/background.jpg" // Your background image
          alt="Background"
          width={1000}
            height={1000}

          className="w-full h-full  "
          
        />
      </div> */}
        <div className="relative container mx-auto  rounded-sm p-10 bg-slate-50 bg-opacity-90">
          <Form {...form}>
            <form
              method="post"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <h1 className="text-3xl font-bold">Start your journey today</h1>
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

              <FormField
                //TO DO: Add a checkbox to get user consent and save to db
                render={() => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormLabel>
                      
                      <span className="text-xs">
                        By submitting  this form you agree to be  an authorized
                        representative of your shop on Strathmall, consent to
                        receive communications from Strathmall via WhatsApp,
                        email, and phone calls regarding your shop&quot;s
                        activities, including order updates, promotions, and
                        customer inquiries. You also acknowledge that Strathmall
                        will handle your contact information in accordance with
                        its Privacy Policy and that you may withdraw your
                        consent at any time.
                      </span>
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
                name={""}
              />
              <Button
                type="submit"
                size="default"
                disabled={form.formState.isSubmitting}
                className="w-full"
                variant={"default"}
                aria-label="submit"
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  const FAQ = () => {
    return (
      <div>
        <h2 className="text-3xl font-bold mb-8">
          Questions? We&apos;ve got answers
        </h2>

        <Stack>
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              How long does it take to become a seller on Strathmall?
            </AccordionSummary>
            <AccordionDetails id="panel1-content">
              <span className="text-xs">
                It takes less than 5 minutes to create a shop on Strathmall.You
                sign-up and submit your shop details ,Pay the onboarding fee
                then You can start uploading your products immediately after
                creating your shop.
              </span>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              How does pricing work ?
            </AccordionSummary>
            <AccordionDetails id="panel1-content">
              <span className="text-xs">
                StrathMall pricing has two parts. A one-time activation fee sets
                shop up . A service fee is
                calculated as a percentage of each shop order made through
                StrathMall. The service fee is deducted from the order amount .
              </span>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              Who handles delivery of products?
            </AccordionSummary>
            <AccordionDetails id="panel1-content">
              <span className="text-xs">
                StrathMall has a delivery service that handles delivery of
                products to customers. Sellers are responsible for
                packaging the products and handing them over to the delivery
                service.
              </span>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </div>
    );
  };

  const WhyStrathmall = () => (
    <div className="container mx-auto bg-slate-100  rounded-sm">
      <h2 className="relative text-3xl font-bold mb-8">Why Strathmall?</h2>

      <UserCard2 />
    </div>
  );

  const HowItWorks = () => (
    <div className="container mx-auto bg-slate-50 rounded-sm">
      <h2 className="relative  text-3xl font-bold mb-8">
        How Strathmall Works for Sellers
      </h2>

      <UserCard />
    </div>
  );

  const Testimonial = () => (
    <div className="py-10 bg-black text-white rounded-sm">
      <div className="container mx-auto flex flex-col md:flex-row items-center rounded-br-2xl">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">What Our Sellers Say</h2>
          <p className="mb-8">
            &quot; Strathmall will for sure transform the way I do business. The
            platform is user-friendly and has all the features I need to manage
            my shop efficiently.&quot;
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
    <div className="container max-auto rounded-sm bg-slate-50">
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
        <div className="md:w-1/2  mx-auto">
          <CardSpot />
        </div>
      </div>
    </div>
  );


  const OnboardingPage = () => {
    return (
      <div className="min-h-screen space-y-6">
        <OnboardingForm />
        <GetStarted />
        <WhyStrathmall />
        <HowItWorks />
        <Testimonial />

        <FAQ />
      </div>
    );
  };



export default OnboardingPage;

