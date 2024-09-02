import React from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import EcommerceFeatures from "@/components/shared/product/ecommerce-features";
import ProductPromotion from "@/components/shared/product/product-promotion";
import ProductList from "@/components/shared/product/home-productlist";
import SparklesText from "@/components/magicui/sparkles-text";
import Footer from "@/components/shared/footer";
import AllProductList from "@/components/shared/product/all-products";
import DiscountProductList from "@/components/shared/product/discountedProductList";
import confetti from "canvas-confetti";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Infinitetestimonials } from "./Testimonials";
import Ads from "./Ads";


   const handleClick = () => {
     const duration = 5 * 1000;
     const animationEnd = Date.now() + duration;
     const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

     const randomInRange = (min: number, max: number) =>
       Math.random() * (max - min) + min;

     const interval = window.setInterval(() => {
       const timeLeft = animationEnd - Date.now();

       if (timeLeft <= 0) return clearInterval(interval);

       const particleCount = 50 * (timeLeft / duration);
       confetti({
         ...defaults,
         particleCount,
         origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
       });
       confetti({
         ...defaults,
         particleCount,
         origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
       });
     }, 250);
   };
interface HomeContentProps {
  latestProducts: any;
  allProducts: any;
  discountedProducts: any; 
  Ads: any;
}

const HomeContent: React.FC<HomeContentProps> = ({
  latestProducts,
  allProducts,
  discountedProducts,
  
}) => {
  return (
    <div>
      <MaxWidthWrapper>
        <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center">
          <h1 className="tracking-tight text-4xl font-bold text-gray-950 sm:text-6xl">
            Your marketplace where quality finds{" "}
            <span className="text-blue-700">you</span>.
          </h1>
          <p className="mt-6 max-w-prose text-lg text-muted-foreground">
            Welcome to StrathMall. Every product on this platform is verified by
            our team to ensure our highest quality standards.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/seller"
              className={buttonVariants({ variant: "secondary" })}
            >
              <SparklesText
                onClick={handleClick}
                text="🎉Start selling"
                className="text-base text-blue-500"
              />
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
      <div className="space-y-8">
        <ProductList title="Newest Arrivals ✨" data={latestProducts} />
        <ProductPromotion />
        <DiscountProductList
          title="Discounted Products 💸"
          data={discountedProducts.data || []}
        />{" "}
        <Ads />
       
        <AllProductList title="More to love 💖" data={allProducts.data || []} />
        <EcommerceFeatures />
        <Infinitetestimonials />
        <Footer />
      </div>
    </div>
  );
};

export default HomeContent;
