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
import ShoesCategory from "./product/shoesCategory";
import Electronics from "./product/techCategory";
import Watches from "./product/watchesCategory";
import CategoryCarousel from "./product/categoryCarousel";
import Image from "next/image";
import HowItWorks from "./HowItWorks";
import Cakes from "./CakeSection";
import LastViewedCarousel from "./product/last-viewed-product";

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
}

const HomeContent: React.FC<HomeContentProps> = ({
  latestProducts,
  allProducts,
  discountedProducts,
}) => {
  return (
    <div>
      <div className="bg-gradient-to-b   from-white to-blue-50">
        <MaxWidthWrapper>
          <div className="mx-auto flex max-w-3xl flex-col  items-center     py-20 text-center">
            <h1 className="tracking-tight text-4xl font-bold bg-clip-text text-blue-800 sm:text-6xl">
              Your marketplace where quality finds{" "}
              <span className="text-blue-700">you</span>.
            </h1>
            <p className="mt-6 max-w-prose text-lg text-blue-800">
              Welcome to StrathMall. Every product on this platform is verified
              by our team to ensure our highest quality standards.
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/seller"
                className={`${buttonVariants({
                  variant: "secondary",
                })} text-base text-blue-500 bg-yellow-400 hover:bg-yellow-300`}
              >
                <SparklesText
                  onClick={handleClick}
                  text="🎉Start selling"
                  className="text-base text-blue-500"
                />
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <p className="text-sm text-blue-800 mr-2">Backed by</p>
              <Image
                src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728757715/ibizlg_uqwnej.png"
                alt="iBiz Africa logo"
                width={120}
                height={60}
                className="h-auto w-auto"
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      <HowItWorks />

      <div className="space-y-8 bg-gradient-to-b from-white to-blue-50 ">
        <ProductList title="Newest Arrivals ✨" data={latestProducts} />
        <ProductPromotion />
        <LastViewedCarousel />
        <ShoesCategory />
        <Cakes />

        <Electronics />
        <Watches />
        <DiscountProductList
          title="Discounted Products 💸"
          data={discountedProducts.data || []}
        />
        <CategoryCarousel />
        <AllProductList title="More to love 💖" data={allProducts.data || []} />
        <EcommerceFeatures />
        <Infinitetestimonials />
        <Footer />
      </div>
    </div>
  );
};

export default HomeContent;
