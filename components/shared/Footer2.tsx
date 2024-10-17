"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";
import { Skeleton } from "../ui/skeleton";

const skeleton =
  "w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700";

const Footer = () => {
  const pathname = usePathname();
  const pathsToMinimize = ["/verify-email", "/sign-up", "/sign-in"];

  
  return (
    <footer className="bg-gray-50 flex-grow-0 container">
      <MaxWidthWrapper>
        <div className="border-t border-gray-200">
          <Suspense
            fallback={
              <div className="flex justify-center py-10">
                <div className={skeleton} />
              </div>
            }
          >
            {!pathsToMinimize.includes(pathname) && (
              <div className="pb-2 pt-2">
                <div className="flex justify-center">
                  <Image
                    src="https://res.cloudinary.com/db0i0umxn/image/upload/v1728757714/logo_bxjyga.png"
                    alt="strathmall logo"
                    width={200}
                    height={200}
                    className="h-40 w-40"
                  />
                </div>
              </div>
            )}
          </Suspense>

          <Suspense
            fallback={
              <div className="px-6 py-6">
                <Skeleton className={skeleton} />
                <Skeleton className={`${skeleton} mt-2`} />
              </div>
            }
          >
            {!pathsToMinimize.includes(pathname) && (
              <div>
                <div className="relative flex items-center px-6 py-6 sm:py-8 lg:mt-0">
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div
                      aria-hidden="true"
                      className="absolute bg-zinc-50 inset-0 bg-gradient-to-br bg-opacity-90"
                    />
                  </div>

                  
                </div>
              </div>
            )}
          </Suspense>
        </div>

        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center md:mt-0 space-x-4">
            <Link
              href="https://www.instagram.com/strathmall/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                className="text-muted-foreground hover:text-gray-600"
                size={24}
              />
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=61565062336250"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook
                className="text-muted-foreground hover:text-gray-600"
                size={24}
              />
            </Link>
            <Link href="/" aria-label="TikTok">
              <FaTiktok
                className="text-muted-foreground hover:text-gray-600"
                size={24}
              />
            </Link>
            <Link
              href="https://x.com/strathmallkenya"
              aria-label="Twitter/X"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter
                className="text-muted-foreground hover:text-gray-600"
                size={24}
              />
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center md:mt-0">
            <div className="flex space-x-8">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-gray-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-gray-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-gray-600"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
