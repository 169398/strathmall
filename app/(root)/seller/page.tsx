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
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { universities } from "@/lib/universities";
import { shopCategories } from "@/lib/shopCategories";
import Footer from "@/components/shared/Footer2";
import Banner from "@/components/shared/Banner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";




const OnboardingForm = () => {
  const [offersServices, setOffersServices] = useState(false);

  const form = useForm<z.infer<typeof createSellerSchema>>({
    resolver: zodResolver(createSellerSchema),
    defaultValues: {
      offersServices: false,
      services: [],
    }
  });
  const { toast } = useToast();
  const router = useRouter();
  const[isOpen, setIsOpen]= useState(false);

  const services = form.watch('services') || [];

  const handleAddService = () => {
    const currentServices = form.getValues('services') || [];
    form.setValue('services', [...currentServices, {
      name: "",
      description: "",
      price: null,
      hasCustomPrice: false,
      images: []
    }]);
  };

  async function onSubmit(values: z.infer<typeof createSellerSchema>) {
    const formData = new FormData();

    formData.append("shopName", values.shopName);
    formData.append("shopCategory", JSON.stringify(values.shopCategory));
    formData.append("email", values.email);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("university", values.university);
    formData.append("offersServices", String(values.offersServices));
    formData.append("services", JSON.stringify(values.services));

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
      toast({
        variant: "destructive",
        description: "An error occurred while creating the seller.",
      });
    }
  }
  return (
    <div className="relative min-h-screen py-9 lg:py-0 md:py-9">
      <Banner />
      <div className="relative container mx-auto rounded-sm p-10 bg-slate-50 bg-opacity-90">
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
              name="shopCategory"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Shop Categories
                  </FormLabel>
                  <FormControl>
                    <div
                      className="mt-1 relative"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <div className="bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 cursor-pointer flex justify-between items-center">
                        <span className="block truncate">
                          {field.value && field.value.length > 0
                            ? `${field.value.length} selected`
                            : "Select categories"}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      {isOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {shopCategories.map((category, index) => (
                            <div
                              key={index}
                              className={cn(
                                "cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100",
                                field.value?.includes(category)
                                  ? "bg-blue-50"
                                  : ""
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newValue = Array.isArray(field.value) && field.value.includes(category)
                                  ? field.value.filter((v) => v !== category)
                                  : [...(Array.isArray(field.value) ? field.value : []), category];
                                field.onChange(newValue);
                              }}
                            >
                              <span
                                className={cn(
                                  "block truncate",
                                  field.value?.includes(category)
                                    ? "font-semibold"
                                    : "font-normal"
                                )}
                              >
                                {category}
                              </span>
                              {field.value?.includes(category) && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                  <Check className="h-5 w-5 text-blue-600" />
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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

            {/* University Dropdown */}
            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>University</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                      defaultValue={field.value || ""}
                    >
                      <SelectTrigger>
                        <span>{field.value || "Select your university"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        {universities.map((university, index) => (
                          <SelectItem key={index} value={university}>
                            {university}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offersServices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you offer services?</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        setOffersServices(checked as boolean);
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {offersServices && (
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Card key={index} className="p-4">
                    <FormField
                      control={form.control}
                      name={`services.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`services.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`services.${index}.hasCustomPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Price?</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!service.hasCustomPrice && (
                      <FormField
                        control={form.control}
                        name={`services.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="mt-4">
                      <FormLabel>Service Images</FormLabel>
                      <div className="flex gap-2 flex-wrap">
                        {service.images?.map((image, imgIndex) => (
                          <Image
                            key={imgIndex}
                            src={image}
                            alt="service image"
                            width={100}
                            height={100}
                            className="object-cover rounded"
                          />
                        ))}
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: any) => {
                            const currentServices = form.getValues('services');
                            const newServices = [...currentServices];
                            newServices[index].images = [...(newServices[index].images || []), res[0].url];
                            form.setValue('services', newServices);
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}

                <Button
                  type="button"
                  onClick={handleAddService}
                >
                  Add Service
                </Button>
              </div>
            )}

            {/*  agreement, and submit button */}
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
            src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728757714/background_xffuvi.jpg" // Testimonial image
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
            src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728757715/get-started_smdhep.png" // Get started image
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
        <Footer />
      </div>
    );
  };



export default OnboardingPage;

