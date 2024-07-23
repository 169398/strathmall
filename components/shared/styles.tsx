import Link from "next/link";
import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "../ui/button";
import CartButton from "./header/cart-button";
import Search from "./header/search";
import UserButton from "./header/user-button";
import Header from "./header";
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <div className="sticky inset-x-0 top-0 z-50 bg-white">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between sm:justify-start">
              <div className="flex items-center sm:ml-4 lg:ml-0">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="strathmall logo"
                    width={100}
                    height={100}
                    className="h-16 w-16 sm:h-24 sm:w-24 lg:h-30 lg:w-30"
                  />
                </Link>
                <div className="ml-2 lg:hidden">{/* Mobile Menu Icon */}</div>
              </div>

              <div className="block flex-1 ml-1 lg:ml-4">
                <Header />
              </div>

              <div className="h-8 w-full max-w-xs text-sm">
                <Search />
              </div>

              <div className="ml-auto flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                {session ? (
                  <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                    <UserButton />
                  </div>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className={buttonVariants({
                        variant: "secondary",
                        className: "text-xs sm:text-sm lg:text-base",
                      })}
                    >
                      Sign in
                    </Link>
                    <span
                      className="h-4 w-px bg-gray-200 sm:h-6"
                      aria-hidden="true"
                    />
                    <Link
                      href="/sign-in"
                      className={buttonVariants({
                        variant: "default",
                        className: "text-xs sm:text-sm lg:text-base",
                      })}
                    >
                      Create account
                    </Link>
                  </>
                )}
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                  <CartButton />
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
}
