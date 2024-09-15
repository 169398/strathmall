"use client";

import { useState } from "react";
import { FilterIcon, X } from "lucide-react";
import Link from "next/link";

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
    <div className="relative">
      {/* Show filters as a sidebar on large screens */}
      <div className="hidden lg:block w-[100%] max-w-[300px] p-4 bg-white shadow-lg">
        <div className="space-y-4">
          {/* Category Section */}
          <div>
            <div className="text-sm font-semibold">Category</div>
            <ul className="space-y-1">
              <li>
                <Link href="/search?category=all" className="text-xs">
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.name}>
                  <Link href={`/search?category=${c.name}`} className="text-xs">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Section */}
          <div>
            <div className="text-sm font-semibold">Price</div>
            <ul className="space-y-1">
              <li>
                <Link href="/search?price=all" className="text-xs">
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link href={`/search?price=${p.value}`} className="text-xs">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Review Section */}
          <div>
            <div className="text-sm font-semibold">Customer Review</div>
            <ul className="space-y-1">
              <li>
                <Link href="/search?rating=all" className="text-xs">
                  Any
                </Link>
              </li>
              {ratings.map((r) => (
                <li key={r}>
                  <Link href={`/search?rating=${r}`} className="text-xs">
                    {`${r} stars & up`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Dropdown for small screens */}
      <div className="lg:hidden  ">
        <button
          className="p-0 m-0 bg-transparent flex items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Filters"
        >
          <FilterIcon className="w-6 h-6" />
        </button>

        {isOpen && (
          <div className="absolute top-12 container rounded-sm left-0 w-full max-w-[300px] max-h-[calc(100vh-3rem)] p-4 bg-white shadow-lg z-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-0 m-0 bg-transparent"
                aria-label="Close Filters"  
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filter Sections */}
            <div className="space-y-4">
              {/* Category Section */}
              <div>
                <div className="text-sm font-semibold">Category</div>
                <ul className="space-y-1">
                  <li>
                    <Link href="/search?category=all" className="text-xs">
                      Any
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c.name}>
                      <Link
                        href={`/search?category=${c.name}`}
                        className="text-xs"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Section */}
              <div>
                <div className="text-sm font-semibold">Price</div>
                <ul className="space-y-1">
                  <li>
                    <Link href="/search?price=all" className="text-xs">
                      Any
                    </Link>
                  </li>
                  {prices.map((p) => (
                    <li key={p.value}>
                      <Link
                        href={`/search?price=${p.value}`}
                        className="text-xs"
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer Review Section */}
              <div>
                <div className="text-sm font-semibold">Customer Review</div>
                <ul className="space-y-1">
                  <li>
                    <Link href="/search?rating=all" className="text-xs">
                      Any
                    </Link>
                  </li>
                  {ratings.map((r) => (
                    <li key={r}>
                      <Link href={`/search?rating=${r}`} className="text-xs">
                        {`${r} stars & up`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersDropdown;