"use client";
import React from "react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import { Button } from "./ui/button";

export function SellerButton() {
  return (
    <div className="m-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <Button />
        <span>Start Selling</span>
      </HoverBorderGradient>
    </div>
  );
}


