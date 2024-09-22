"use client";

import React, { useState } from "react";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const HoverDrawer = ({
  categories,
}: {
  categories: { name: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="relative inline-block w-64"
    >
      {/* Adjust the container to keep the icon and dropdown together */}
      <div className="relative flex items-center">
        <MenuIcon className="cursor-pointer text-blue-600" />
        {/* Make sure the dropdown opens right next to the icon */}
        {isOpen && (
          <div className="absolute left-0 top-full mt-0 w-full bg-white border rounded-sm border-gray-200 shadow-lg z-50">
            <div className="flex items-center justify-between p-2 border-b">
              <span className="font-medium">All categories</span>
            </div>
            <div className="space-y-1 p-2">
              {categories.map((category: { name: string }) => (
                <Link
                  key={category.name}
                  href={`/search?category=${category.name}`}
                >
                  <Button
                    className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 transition ease-out duration-200"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    aria-label="Category"
                  >
                    {category.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
