import Search from "./header/search";
import { HoverDrawer } from "./HoverDrawer";
import { getAllCategories } from "@/lib/actions/sellerproduct.actions";

export default async function MobileNav() {
  const categories = await getAllCategories();

  return (
    <div className="flex flex-col items-center lg:hidden w-full mt-4">
      <div className="flex items-center w-full space-x-4">
        <HoverDrawer categories={categories} />
        <div className="h-8 w-full max-w-screen-lg text-sm">
          <Search />
        </div>
      </div>
    </div>
  );
}
