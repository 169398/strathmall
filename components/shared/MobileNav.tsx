import Link from "next/link";
import Image from "next/image";
import Search from "./header/search";
import { HoverDrawer } from "./HoverDrawer";
import { getAllCategories } from "@/lib/actions/sellerproduct.actions";
import CartButton from "./header/cart-button";
import UserButton from "./header/user-button";
import FavoriteProductsSheet from "./product/favoriteProducts";

export default async function MobileNav() {
  const categories = await getAllCategories();

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 z-50 bg-white shadow-md">
      <div className="flex flex-col items-center border-b border-gray-200 p-4">
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="strathmall logo"
              width={120}
              height={120}
              className="h-14 w-14"
            />
          </Link>
          <div className="flex items-center space-x-4">
            <FavoriteProductsSheet />
            <div className="h-10 w-10 flex items-center justify-center">
              <UserButton />
            </div>
            <div className="h-10 w-10 flex items-center justify-center">
              <CartButton />
            </div>
          </div>
        </div>
        <div className="flex items-center w-full mt-4 space-x-4">
          <HoverDrawer categories={categories} />
          <Search />
        </div>
      </div>
    </div>
  );
}
