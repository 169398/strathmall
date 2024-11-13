import Link from "next/link";
import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "../ui/button";
import CartButton from "./header/cart-button";
import UserButton from "./header/user-button";
import MobileNav from "./MobileNav";
import Search from "./header/search";
import Header from "./header";
import FavoriteProductsSheet from "./product/favoriteProducts";
import { NavbarWrapper } from "./NavbarWrapper";
import { auth } from "@/auth";


export default async function Navbar() {
  const session = await auth();
  return (
    <NavbarWrapper>
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between lg:justify-start lg:py-4">
              <div className="flex items-center lg:ml-4">
                <Link
                  href="/"
                  aria-label="StrathMall Home"
                  className="focus:outline-none focus:ring-2"
                >
                  <Image
                    src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728757714/logo_bxjyga.png"
                    alt="strathmall logo"
                    width={100}
                    height={100}
                    className="h-24 w-24 lg:h-30 lg:w-30"
                  />
                </Link>
              </div>
              <div className="hidden lg:flex lg:flex-1 lg:ml-8 lg:space-x-8 items-center">
                <Header />
                <div className="flex-1 max-w-md">
                  <Search aria-label="Search products" />
                </div>
              </div>
              <div
                className="hidden lg:flex lg:items-center lg:space-x-6"
                role="group"
                aria-label="User actions"
              >
                <div className="ml-9">
                  <FavoriteProductsSheet />
                </div>
                <div className="flex items-center space-x-4">
                  {session ? (
                    <div className="h-12 w-12 flex items-center justify-center">
                      <UserButton />
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        className={buttonVariants({
                          variant: "secondary",
                          className: "text-sm focus:outline-none focus:ring-2",
                        })}
                        aria-label="Log in to your account"
                      >
                        Log in
                      </Link>

                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <Link
                        href="/sign-up"
                        className={buttonVariants({
                          variant: "default",
                          className: "text-sm focus:outline-none focus:ring-2",
                        })}
                        aria-label="Create a new account"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                  <CartButton />
                </div>
              </div>
            </div>
            <MobileNav />
          </div>
        </MaxWidthWrapper>
      </header>
    </NavbarWrapper>
  );
}
