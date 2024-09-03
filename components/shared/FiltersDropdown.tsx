"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const FiltersDropdown = ({
  categories,
  prices,
  ratings,
}: {
  categories: { name: string }[];
  prices: { name: string; value: string }[];
  ratings: number[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        Filters
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </Button>
      {isOpen && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-lg font-semibold">Category</div>
            <ul className="space-y-2">
              <li>
                <Link href={`/search?category=all`} className="text-sm">
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.name}>
                  <Link href={`/search?category=${c.name}`} className="text-sm">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-lg font-semibold">Price</div>
            <ul className="space-y-2">
              <li>
                <Link href={`/search?price=all`} className="text-sm">
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link href={`/search?price=${p.value}`} className="text-sm">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-lg font-semibold">Customer Review</div>
            <ul className="space-y-2">
              <li>
                <Link href={`/search?rating=all`} className="text-sm">
                  Any
                </Link>
              </li>
              {ratings.map((r) => (
                <li key={r}>
                  <Link href={`/search?rating=${r}`} className="text-sm">
                    {`${r} stars & up`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersDropdown;
