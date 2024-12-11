import Link from "next/link";
import Image from "next/image";
import Search from "./header/search";
import { HoverDrawer } from "./HoverDrawer";
import { getAllCategories } from "@/lib/actions/sellerproduct.actions";
import CartButton from "./header/cart-button";
import UserButton from "./header/user-button";
import FavoriteProductsSheet from "./product/favoriteProducts";
import { buttonVariants } from "../ui/button";

interface MobileNavProps {
  session: any; // Replace with your session type
}

export default async function MobileNav({ session }: MobileNavProps) {
  const categories = await getAllCategories();

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 z-50">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <HoverDrawer categories={categories} />
            <Link
              href="/"
              className="transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <Image
                src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728757714/logo_bxjyga.png"
                alt="strathmall logo"
                width={48}
                height={48}
                className="h-12 w-12"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
              <FavoriteProductsSheet />
            </div>

            {session ? (
              <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
                <UserButton />
              </div>
            ) : (
              <Link
                href="/sign-in"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className:
                    "text-xs hover:bg-blue-50 text-blue-600 transition-colors duration-200",
                })}
              >
                Sign in
              </Link>
            )}

            <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
              <CartButton />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-2 opacity-100 transition-opacity duration-300">
          <Search />
        </div>
      </div>
    </div>
  );
}
