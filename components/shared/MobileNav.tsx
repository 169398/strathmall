import Link from "next/link";
import Image from "next/image";
import Search from "./header/search";
import { HoverDrawer } from "./HoverDrawer";
import { getAllCategories } from "@/lib/actions/sellerproduct.actions";
import CartButton from "./header/cart-button";
import UserButton from "./header/user-button";
import FavoriteProductsSheet from "./product/favoriteProducts";
import { buttonVariants } from "../ui/button";
import { auth } from "@/auth";

export default async function MobileNav() {
  const session = await auth(); // Fetch session server-side
  const categories = await getAllCategories(); // Fetch categories server-side

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 z-50 bg-white shadow-md">
      <div className="flex flex-col items-center border-b border-gray-200 p-2">
        {" "}
        {/* Reduced padding */}
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="strathmall logo"
              width={80} // Reduced logo size
              height={80}
              className="h-12 w-12" // Smaller logo dimensions
            />
          </Link>
          <div className="flex items-center space-x-1">
            {" "}
            {/* Reduced space between icons */}
            <FavoriteProductsSheet />
            {session ? (
              <div className="h-6 w-6 flex items-center justify-center">
                {" "}
                {/* Smaller buttons */}
                <UserButton />
              </div>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "secondary",
                    className: "text-xs", // Smaller text for links
                  })}
                >
                  Log in
                </Link>
                <span className="h-3 w-px bg-gray-200" aria-hidden="true" />{" "}
                {/* Thinner separator */}
                <Link
                  href="/sign-up"
                  className={buttonVariants({
                    variant: "default",
                    className: "text-xs", // Smaller text for links
                  })}
                >
                  Sign up
                </Link>
              </>
            )}
            <div className="h-6 w-6 flex items-center justify-center">
              {" "}
              {/* Smaller cart button */}
              <CartButton />
            </div>
          </div>
        </div>
        <div className="flex items-center w-full mt-1 space-x-1">
          {" "}
          {/* Reduced space */}
          <HoverDrawer categories={categories} />
          <Search />
        </div>
      </div>
    </div>
  );
}
