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
      className="relative inline-block "
    >
      <div className=" flex items-center">
        <MenuIcon className="cursor-pointer text-blue-600" />
        {isOpen && (
          <div className="absolute left-0 top-full mt-0 w-64 bg-white border rounded-sm border-gray-200 shadow-lg z-50">
            <div className="flex items-center justify-between p-2 border-b">
              <span className="font-medium">All categories</span>
            </div>
            <div className="space-y-1 p-2">
              {categories.map((category: { name: string }) => (
                <Link
                  key={category.name}
                  href={`/search?category=${encodeURIComponent(category.name)}`}
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
