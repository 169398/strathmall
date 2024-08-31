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
    <div className="sticky top-0 bg-white z-10 shadow-md p-4">
          <Button
              variant={"secondary"}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center"
      >
        Filters
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </Button>
      {isOpen && (
        <div className="mt-4 space-y-6">
          <div>
            <div className="text-xl pt-3">Category</div>
            <ul className="space-y-2">
              <li>
                <Link href={`/search?category=all`}>Any</Link>
              </li>
              {categories.map((c) => (
                <li key={c.name}>
                  <Link href={`/search?category=${c.name}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xl pt-3">Price</div>
            <ul className="space-y-2">
              <li>
                <Link href={`/search?price=all`}>Any</Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link href={`/search?price=${p.value}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xl pt-3">Customer Review</div>
            <ul className="space-y-2">
              <li>
                <Link href={`/search?rating=all`}>Any</Link>
              </li>
              {ratings.map((r) => (
                <li key={r}>
                  <Link href={`/search?rating=${r}`}>{`${r} stars & up`}</Link>
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
