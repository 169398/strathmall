

import Link from "next/link";
import Image from "next/image";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "../ui/button";
import CartButton from "./header/cart-button";
import Search from "./header/search";
import UserButton from "./header/user-button";
// import MobileNav from "./MobileNav";
import Header from "./header";
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <div className="sticky inset-x-0 top-0 z-50 h-16 bg-white">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <div className="lg:hidden"></div>
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="strathmall logo"
                    width={150}
                    height={150}
                    className="h-30 w-30"
                  />
                </Link>
              </div>

              <div className="z-50 hidden lg:ml-8 lg:block lg:self-stretch"></div>
              <Header />
              <div className="sm:block ">
                <Search />
              </div>

              <div className="ml-auto flex items-center">
                <div className=" lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6 ml-auto flex items-center space-x-2 sm:space-x-4 ">
                  {!session && (
                    <>
                      <Link
                        href="/sign-in"
                        className={buttonVariants({
                          variant: "secondary",
                        })}
                      >
                        Sign in
                      </Link>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <Link
                        href="sign-in"
                        className={buttonVariants({
                          variant: "default",
                        })}
                      >
                        Create account
                      </Link>
                    </>
                  )}

                  {session && (
                    <>
                      <UserButton />
                    </>
                  )}
                  <div className="ml-4 flow-root lg:ml-8 h-10 w-10 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                    <CartButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
}


