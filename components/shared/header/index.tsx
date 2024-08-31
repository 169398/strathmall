import { getAllCategories } from "@/lib/actions/sellerproduct.actions";
import { HoverDrawer } from "../HoverDrawer";

const Header = async () => {
  const categories = await getAllCategories();

  return (
    <header>
      <div className="wrapper flex-between">
        <div className="flex-start">
          <HoverDrawer categories={categories} />
        </div>
      </div>
    </header>
  );
};

export default Header;
