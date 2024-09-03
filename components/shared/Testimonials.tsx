"use client";

import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import AnimatedShinyText from "../magicui/animated-shiny-text";

export function Infinitetestimonials() {
  return (
    <div className="container flex flex-col items-center justify-center relative bg-white  dark:bg-grid-white/[0.05] rounded-sm p-4 sm:p-6 md:p-8 h-[24rem] sm:h-[30rem] md:h-[36rem]">
      <AnimatedShinyText className="inline-flex text-xl sm:text-2xl items-center justify-center px-4 py-1 transition ease-out font-bold hover:text-blue-600 hover:duration-300 hover:dark:text-neutral-400">
        What people say
      </AnimatedShinyText>
      <div className="relative w-full h-full mt-4 overflow-hidden">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="fast"
        />
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Strathmall has completely changed how I shop as a student. I love the convenience of getting everything I need online from my fellow students sellers  without the hassle of visiting the  market. It's easy, efficient, and perfect for my busy schedule with school work",
    name: "Charles Dickens",
    title: "Strathmore University Student",
  },
  {
    quote:
      "Joining   Strathmall  was a game-changer. It's so convenient to find everything I need online, and the variety is amazing. No more weekend trips—shopping is just a click away",
    name: "Job Ian",
    title: "Strathmore University Student",
  },
  {
    quote:
      "Strathmall has transformed my shopping experience as a Strathmore student. After years of navigating the crowded flea market, I now enjoy the convenience of finding everything I need online. It's quick, easy, and perfectly tailored to student life. Strathmall is my new go-to.",
    name: "Frankline Mwakio",
    title: "Strathmore University Student",
  },
  {
    quote:
      "Setting up my shop on Strathmall was seamless. As a vendor, I'm excited to reach more customers without the hassle of a physical store. The platform is user-friendly, and I’m confident it will help my business thrive in the digital space. Ready to start selling",
    name: "Samuel Mungai",
    title: "Vendor on Strathmall",
  },
  {
    quote:
      "Setting up my shop on Strathmall was a breeze. It's  exciting to finally bring my business online and reach more customers. The platform is user-friendly, and I can't wait to see my business grow",
    name: "Dan Kisame",
    title: "Local Business Owner",
  },
];
