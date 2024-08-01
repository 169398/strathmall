


"use client";
import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export function UserCard2() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Increase your visibility
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          Strathmall strategically operates in a prime area, ensuring high
          online traffic and exposure to a diverse customer base. By
          establishing your business here, you can significantly increase your
          brand visibility and reach a wider audience{" "}
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Build Lasting Relationships
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          Connect with your customers on a deeper level through our loyalty
          programs and data insights. Understand their preferences, gather
          feedback, and foster long-term loyalty. Strathmall empowers you to
          build meaningful relationships with your customers, turning them into
          loyal advocates for your brand.
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          Amplify Your Reach
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          Stand out from the crowd with our integrated marketing strategies.
          From targeted in-mall promotions to engaging social media campaigns,
          we&apos;ll help you reach a wider audience and attract more customers to
          your doorstep. Increase your visibility and drive footfall like never
          before.
        </p>
      </WobbleCard>
    </div>
  );
}
